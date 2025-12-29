import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    FileText,
    GitCompare,
    Bot,
    Search,
    Menu,
    X,
    ChevronRight,
    Sun,
    Moon
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';
import { CommandPalette } from '../ui/CommandPalette';

const SidebarItem = ({ icon: Icon, label, href, active, collapsed }) => (
    <Link to={href}>
        <div
            className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-primary/10",
                active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-primary",
                collapsed && "justify-center px-2"
            )}
        >
            <Icon className={cn("h-5 w-5 transition-transform group-hover:scale-110", active && "text-primary")} />
            {!collapsed && (
                <span className="flex-1 truncate">{label}</span>
            )}
            {!collapsed && active && (
                <motion.div
                    layoutId="active-sidebar"
                    className="h-1.5 w-1.5 rounded-full bg-primary"
                />
            )}
        </div>
    </Link>
);

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    const items = [
        { icon: FileText, label: 'Articles', href: '/articles' },
        { icon: GitCompare, label: 'Comparison', href: '/compare/1' }, // Default to 1 or handle properly
        { icon: Search, label: 'Scraper', href: '/scraper' },
        { icon: Bot, label: 'Automation', href: '/automation' },
    ];

    return (
        <>
            {/* Mobile Backdrop */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Container */}
            <motion.aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-card shadow-lg transition-all duration-300 lg:static",
                    collapsed ? "w-20" : "w-64",
                    !isOpen && "-translate-x-full lg:translate-x-0"
                )}
            >
                {/* Header */}
                <div className="flex h-16 items-center justify-between px-4 border-b">
                    {!collapsed && (
                        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary overflow-hidden">
                            <span className="truncate">ArticleAI</span>
                        </Link>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCollapsed(!collapsed)}
                        className="hidden lg:flex"
                    >
                        <ChevronRight className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden">
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Nav Items */}
                <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                    <SidebarItem
                        icon={LayoutDashboard}
                        label="Dashboard"
                        href="/"
                        active={location.pathname === '/'}
                        collapsed={collapsed}
                    />
                    <div className="my-4 h-px bg-border/50" />
                    {items.map((item) => (
                        <SidebarItem
                            key={item.href}
                            {...item}
                            active={location.pathname.startsWith(item.href)}
                            collapsed={collapsed}
                        />
                    ))}
                </div>

                {/* Footer */}
                <div className="border-t p-4">
                    {!collapsed ? (
                        <div className="rounded-lg bg-primary/10 p-4">
                            <p className="text-sm font-medium text-primary mb-1">Status</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                System Online
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        </div>
                    )}
                </div>
            </motion.aside>
        </>
    );
};

const Header = ({ onMenuClick }) => {
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            if (localStorage.getItem('theme')) return localStorage.getItem('theme');
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
        }
        return 'light';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center gap-4 border-b bg-background/70 px-6 backdrop-blur-xl">
            <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden">
                <Menu className="h-5 w-5" />
            </Button>

            <div className="flex flex-1 items-center gap-4 justify-end">
                {/* Spacer or other nav items */}
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                >
                    {theme === 'light' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    A
                </div>
            </div>
        </header>
    )
}

const Layout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <CommandPalette />
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex flex-1 flex-col overflow-hidden">
                <Header onMenuClick={() => setSidebarOpen(true)} />
                <main className="flex-1 overflow-y-auto p-4 md:p-8 relative scroll-smooth">
                    <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
