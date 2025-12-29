import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { ArrowRight, Zap, Database, BarChart3, Bot } from 'lucide-react';

const LandingPage = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col min-h-[80vh] items-center justify-center">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="text-center max-w-4xl mx-auto space-y-8"
      >
        <motion.div variants={item} className="space-y-4">
          <div className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            Next Generation Content Intelligence
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground sm:text-7xl">
            Automate Article <span className="text-gradient">Optimization</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
            Leverage AI to analyze, compare, and enhance your content automatically.
            Connect sources, run pipelines, and get actionable insights in seconds.
          </p>
        </motion.div>

        <motion.div variants={item} className="flex gap-4 justify-center">
          <Link to="/articles">
            <Button size="lg" className="gap-2">
              Explore Articles <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/automation">
            <Button variant="outline" size="lg">
              Start Automation
            </Button>
          </Link>
        </motion.div>

        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16 text-left">
          <FeatureCard
            icon={Bot}
            title="AI Powered"
            description="Automatic content enhancement using advanced LLMs."
          />
          <FeatureCard
            icon={Database}
            title="Data Scraper"
            description="Intelligent web scraping for competitive analysis."
          />
          <FeatureCard
            icon={GitCompare}
            title="Comparison"
            description="Side-by-side diffs to visualize changes."
          />
          <FeatureCard
            icon={Zap}
            title="Automation"
            description="Set and forget text processing pipelines."
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description }) => (
  <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
    <CardContent className="pt-6">
      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

// Helper for icon
const GitCompare = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="18" cy="18" r="3" />
    <circle cx="6" cy="6" r="3" />
    <path d="M13 6h3a2 2 0 0 1 2 2v7" />
    <path d="M11 18H8a2 2 0 0 1-2-2V9" />
  </svg>
)

export default LandingPage;
