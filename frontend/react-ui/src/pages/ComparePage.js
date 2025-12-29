import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { articleService } from '../services/api';
import { ArrowLeft, Split, Minimize, AlertCircle, FileText, Zap, TrendingUp, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { StatsCard } from '../components/ui/StatsCard';
import { cn } from '../lib/utils';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { DiffViewer } from '../components/ui/DiffViewer';

function ComparePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('side-by-side');

  useEffect(() => {
    fetchComparison();
  }, [id]);

  const fetchComparison = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await articleService.getComparison(id);
      setComparison(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load comparison');
    } finally {
      setLoading(false);
    }
  };

  const getWordCount = (text) => text ? text.split(/\s+/).filter(w => w.length > 0).length : 0;

  const getReadingTime = (text) => {
    const minutes = Math.ceil(getWordCount(text) / 200);
    return minutes;
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
      <AlertCircle className="h-12 w-12 text-destructive" />
      <p className="text-lg font-medium">{error}</p>
      <Button onClick={() => navigate('/articles')}>Back to Articles</Button>
    </div>
  );

  const { original, enhanced } = comparison || {};

  if (!original && !enhanced) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <AlertCircle className="h-12 w-12 text-yellow-500" />
        <p className="text-lg font-medium">No comparison data available</p>
        <Button onClick={() => navigate('/articles')}>Back to Articles</Button>
      </div>
    );
  }

  const improvement = enhanced && original
    ? Math.round(((getWordCount(enhanced.content) - getWordCount(original.content)) / getWordCount(original.content)) * 100)
    : 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <Breadcrumbs
            items={[
              { label: 'Articles', href: '/articles' },
              { label: `Comparison: ${original?.title || 'Loading...'}` }
            ]}
            className="mb-2"
          />
          <h1 className="text-3xl font-bold tracking-tight">Article Comparison</h1>
          <p className="text-muted-foreground">Analyze the AI-driven improvements.</p>
        </div>

        <div className="flex rounded-lg border bg-card p-1">
          <Button
            size="sm"
            variant={viewMode === 'side-by-side' ? 'secondary' : 'ghost'}
            onClick={() => setViewMode('side-by-side')}
            className="gap-2"
          >
            <Split className="h-4 w-4" /> Side by Side
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'diff' ? 'secondary' : 'ghost'}
            onClick={() => setViewMode('diff')}
            className="gap-2"
          >
            <FileText className="h-4 w-4" /> Smart Diff
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'stacked' ? 'secondary' : 'ghost'}
            onClick={() => setViewMode('stacked')}
            className="gap-2"
          >
            <Minimize className="h-4 w-4" /> Stacked
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          icon={FileText}
          label="Original Words"
          value={getWordCount(original?.content)}
          color="text-blue-500"
        />
        <StatsCard
          icon={Zap}
          label="Enhanced Words"
          value={getWordCount(enhanced?.content)}
          color="text-emerald-500"
        />
        <StatsCard
          icon={TrendingUp}
          label="Improvement"
          value={`${improvement > 0 ? '+' : ''}${improvement}%`}
          color="text-purple-500"
        />
      </div>

      {/* Comparison View */}
      {viewMode === 'diff' ? (
        <DiffViewer
          oldText={original?.content || ''}
          newText={enhanced?.content || ''}
          title="Smart Text Comparison"
        />
      ) : (
        <div className={cn("grid gap-6", viewMode === 'side-by-side' ? 'md:grid-cols-2' : 'grid-cols-1')}>
          {/* Original */}
          <Card className="flex flex-col overflow-hidden border-blue-100 shadow-md">
            <div className="bg-blue-50/80 p-4 border-b border-blue-100 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-white text-blue-700 border-blue-200">
                  ORIGINAL
                </Badge>
                <span className="text-sm text-muted-foreground">{getReadingTime(original?.content)} min read</span>
              </div>
              {original?.source_url && (
                <a href={original.source_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800">
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
            <CardContent className="p-6 flex-1 bg-white/50">
              {original ? (
                <div className="prose prose-sm max-w-none">
                  <h2 className="mt-0">{original.title}</h2>
                  <ReactMarkdown>{original.content}</ReactMarkdown>
                </div>
              ) : (
                <div className="flex justify-center py-12 text-muted-foreground">No original version</div>
              )}
            </CardContent>
          </Card>

          {/* Enhanced */}
          <Card className="flex flex-col overflow-hidden border-green-100 shadow-md">
            <div className="bg-green-50/80 p-4 border-b border-green-100 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Badge variant="success" className="bg-green-100 text-green-700 border-green-200">
                  AI ENHANCED
                </Badge>
                <span className="text-sm text-muted-foreground">{getReadingTime(enhanced?.content)} min read</span>
              </div>
            </div>
            <CardContent className="p-6 flex-1 bg-white/50">
              {enhanced ? (
                <div className="prose prose-sm max-w-none">
                  <h2 className="mt-0">{enhanced.title}</h2>
                  <ReactMarkdown>{enhanced.content}</ReactMarkdown>

                  {enhanced.references && (
                    <div className="mt-8 rounded-lg bg-blue-50/50 p-4 text-xs">
                      <p className="font-semibold mb-2">References used:</p>
                      <ul className="space-y-1 list-disc list-inside">
                        {JSON.parse(enhanced.references).map((ref, idx) => (
                          <li key={idx} className="truncate">
                            <a href={ref} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                              {ref}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Zap className="h-12 w-12 text-muted-foreground/30 mb-4" />
                  <p>No enhanced version yet</p>
                  <Button className="mt-4" onClick={() => navigate('/automation')}>Run Enhancement</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}



export default ComparePage;
