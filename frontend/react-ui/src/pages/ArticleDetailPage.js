import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { articleService } from '../services/api';
import { Loader2, ArrowLeft, Calendar, ExternalLink, BookOpen, AlertCircle, Download } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { useReadingProgress } from '../hooks/useReadingProgress';

function ArticleDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const readingProgress = useReadingProgress();

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await articleService.getArticleById(id);
      setArticle(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch article');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const parseReferences = (references) => {
    if (!references) return [];
    try {
      return typeof references === 'string' ? JSON.parse(references) : references;
    } catch {
      return [];
    }
  };

  const handleExport = (format) => {
    if (!article) return;

    let content = '';
    let mimeType = 'text/plain';
    let extension = 'txt';

    if (format === 'markdown') {
      content = `# ${article.title}\n\n${article.content}`;
      mimeType = 'text/markdown';
      extension = 'md';
    } else {
      content = `Title: ${article.title}\n\n${article.content}`;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${article.title.replace(/\s+/g, '-').toLowerCase()}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <Skeleton className="h-10 w-32" />
      <Card className="overflow-hidden border-none shadow-2xl">
        <div className="p-8 md:p-12 border-b space-y-6">
          <Skeleton className="h-6 w-32 rounded-full" />
          <Skeleton className="h-12 w-3/4" />
          <div className="flex gap-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <CardContent className="p-8 md:p-12 space-y-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
      </Card>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <AlertCircle className="h-12 w-12 text-destructive" />
      <p className="text-lg font-medium">{error}</p>
      <Button onClick={fetchArticle}>Retry</Button>
    </div>
  );

  if (!article) return <div>Article not found</div>;

  const isUpdated = article.version === 'updated';
  const references = parseReferences(article.references);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div
        className="fixed top-0 left-0 h-1 bg-primary z-50 transition-all duration-300"
        style={{ width: `${readingProgress}%` }}
      />
      <Breadcrumbs
        items={[
          { label: 'Articles', href: '/articles' },
          { label: article.title }
        ]}
      />

      <Card className="overflow-hidden border-none shadow-2xl">
        {/* Hero Header */}
        <div className="relative bg-gradient-to-br from-primary/5 to-secondary p-8 md:p-12 border-b">
          <div className="absolute top-6 left-6">
            <Badge variant={isUpdated ? "success" : "secondary"} className="scale-110">
              {isUpdated ? 'AI Enhanced Version' : 'Original Version'}
            </Badge>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-8">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
              {article.title}
            </h1>
            <Button variant="outline" onClick={() => handleExport('markdown')} className="gap-2 shrink-0">
              <Download className="h-4 w-4" /> Export MD
            </Button>
          </div>

          <div className="mt-6 flex flex-wrap gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {formatDate(article.created_at)}
            </div>
            {article.source_url && (
              <a
                href={article.source_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                View Original Source
              </a>
            )}
          </div>
        </div>

        {/* Navigation Alerts */}
        {(isUpdated && article.original_article) && (
          <div className="bg-blue-50/50 p-4 flex items-center justify-between border-b border-blue-100">
            <div className="flex items-center gap-2 text-sm text-blue-800">
              <BookOpen className="h-4 w-4" />
              This is an AI-enhanced version.
            </div>
            <Link to={`/article/${article.original_article.id}`}>
              <Button variant="link" size="sm">View Original</Button>
            </Link>
          </div>
        )}

        {(article.version === 'original' && article.updated_versions?.length > 0) && (
          <div className="bg-green-50/50 p-4 flex items-center justify-between border-b border-green-100">
            <div className="flex items-center gap-2 text-sm text-green-800">
              <BookOpen className="h-4 w-4" />
              An AI-enhanced version is available!
            </div>
            <Link to={`/article/${article.updated_versions[0].id}`}>
              <Button variant="link" size="sm" className="text-green-700">View Enhanced</Button>
            </Link>
          </div>
        )}

        <CardContent className="p-8 md:p-12">
          <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
            <ReactMarkdown>{article.content}</ReactMarkdown>
          </div>

          {references.length > 0 && (
            <div className="mt-12 rounded-xl bg-muted/30 p-6">
              <h3 className="flex items-center gap-2 font-semibold text-lg mb-4">
                <BookOpen className="h-5 w-5" /> References
              </h3>
              <ul className="space-y-3">
                {references.map((ref, idx) => (
                  <li key={idx} className="flex gap-3 text-sm">
                    <span className="font-mono text-muted-foreground">{idx + 1}.</span>
                    <a
                      href={ref}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:underline break-all"
                    >
                      {ref}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Nav Footer */}
      <div className="flex justify-center pt-8">
        <Link to="/articles">
          <Button size="lg" variant="secondary">Browse More Articles</Button>
        </Link>
      </div>
    </div>
  );
}

export default ArticleDetailPage;
