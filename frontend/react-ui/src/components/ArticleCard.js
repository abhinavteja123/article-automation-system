import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Calendar, FileText, ArrowRight, GitCompare } from 'lucide-react';
import { cn } from '../lib/utils';

function ArticleCard({ article, selected = false, onSelect = null }) {
  const isUpdated = article.version === 'updated';

  const getPreview = (content, maxLength = 120) => {
    if (!content) return '';
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleCheckboxChange = (e) => {
    e.stopPropagation();
    console.log('Checkbox changed for article:', article.id);
    if (onSelect) {
      onSelect(article.id);
    }
  };

  return (
    <Card className={cn(
      "group h-full flex flex-col transition-all hover:shadow-lg hover:-translate-y-1",
      selected && "ring-2 ring-primary bg-primary/5"
    )}>
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {onSelect && (
              <label className="flex items-center cursor-pointer" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 rounded border-gray-300 cursor-pointer"
                />
              </label>
            )}
            <Badge variant={isUpdated ? "success" : "secondary"}>
              {isUpdated ? 'AI Enhanced' : 'Original'}
            </Badge>
          </div>
          <div className="flex items-center text-xs text-muted-foreground gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(article.created_at)}
          </div>
        </div>

        <Link to={`/article/${article.id}`}>
          <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors cursor-pointer">
            {article.title}
          </CardTitle>
        </Link>
      </CardHeader>

      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {getPreview(article.content)}
        </p>
      </CardContent>

      <CardFooter className="border-t bg-muted/20 p-4">
        <div className="flex w-full items-center justify-between gap-2">
          <div className="flex items-center text-xs text-muted-foreground gap-1">
            <FileText className="h-3 w-3" />
            <span>{article.content?.split(' ').length || 0} words</span>
          </div>

          <div className="flex gap-2">
            <Link to={`/compare/${article.id}`}>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Compare">
                <GitCompare className="h-4 w-4" />
              </Button>
            </Link>
            <Link to={`/article/${article.id}`}>
              <Button size="sm" className="h-8 gap-1 text-xs">
                Read <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

export default ArticleCard;
