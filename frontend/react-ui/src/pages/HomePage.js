import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { articleService } from '../services/api';
import ArticleCard from '../components/ArticleCard';
import { Button } from '../components/ui/Button';
import { Search, Plus, FileText, Bot, Layers } from 'lucide-react';
import { Skeleton } from '../components/ui/Skeleton';
import { StatsCard } from '../components/ui/StatsCard';
import { cn } from '../lib/utils';

function HomePage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await articleService.getAllArticles();
      setArticles(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch articles');
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = articles.filter(article => {
    if (filter !== 'all' && article.version !== filter) return false;
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        article.title?.toLowerCase().includes(search) ||
        article.content?.toLowerCase().includes(search)
      );
    }
    return true;
  });

  const stats = {
    total: articles.length,
    original: articles.filter(a => a.version === 'original').length,
    updated: articles.filter(a => a.version === 'updated').length,
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>

        <div className="border-b pb-1">
          <div className="flex gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-24" />
            ))}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 rounded-xl border bg-card p-6 space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="pt-4 mt-auto">
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg bg-destructive/10 p-6 text-center text-destructive">
        <p className="font-semibold">{error}</p>
        <Button onClick={fetchArticles} variant="outline" className="mt-4">Try Again</Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Articles</h1>
          <p className="text-muted-foreground">Manage and track your content pipeline.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/scraper">
            <Button variant="outline" className="gap-2">
              <Plus className="h-4 w-4" /> Import Content
            </Button>
          </Link>
          <Link to="/automation">
            <Button className="gap-2">
              <Bot className="h-4 w-4" /> Run Automation
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <StatsCard
          icon={FileText}
          label="Total Articles"
          value={stats.total}
          trend="up"
          trendValue="+12%"
          color="text-blue-500"
        />
        <StatsCard
          icon={Layers}
          label="Original Content"
          value={stats.original}
          color="text-slate-500"
        />
        <StatsCard
          icon={Bot}
          label="AI Enhanced"
          value={stats.updated}
          trend="up"
          trendValue="+5 new"
          color="text-indigo-500"
        />
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
        <div className="flex gap-6">
          <FilterTab active={filter === 'all'} onClick={() => setFilter('all')}>All Articles</FilterTab>
          <FilterTab active={filter === 'original'} onClick={() => setFilter('original')}>Original</FilterTab>
          <FilterTab active={filter === 'updated'} onClick={() => setFilter('updated')}>Enhanced</FilterTab>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      {filteredArticles.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-16 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No articles found</h3>
          <p className="text-muted-foreground max-w-sm mx-auto mb-6">
            There are no articles matching your criteria. Try adjusting your filters or run the scraper.
          </p>
          <Link to="/scraper">
            <Button>Go to Scraper</Button>
          </Link>
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filteredArticles.map((article) => (
            <motion.div key={article.id} variants={item}>
              <ArticleCard article={article} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}



const FilterTab = ({ active, children, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      "border-b-2 pb-3 text-sm font-medium transition-colors hover:text-primary",
      active ? "border-primary text-primary" : "border-transparent text-muted-foreground"
    )}
  >
    {children}
  </button>
)

export default HomePage;
