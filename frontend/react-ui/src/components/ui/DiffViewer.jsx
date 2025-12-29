import { useMemo } from 'react';
import { diffWords } from 'diff';
import { cn } from '../../lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from './Card';

export function DiffViewer({ oldText, newText, title }) {
    const diffs = useMemo(() => {
        if (!oldText && !newText) return [];
        try {
            return diffWords(oldText || '', newText || '');
        } catch (e) {
            console.error("Diff calculation failed:", e);
            return [];
        }
    }, [oldText, newText]);

    return (
        <Card className="h-full border-primary/20">
            <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                    {title}
                    <div className="flex gap-4 text-xs font-normal">
                        <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-red-500/20 ring-1 ring-red-500" /> Removed
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500/20 ring-1 ring-green-500" /> Added
                        </div>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="prose dark:prose-invert max-w-none leading-relaxed text-sm bg-muted/30 p-4 rounded-lg font-mono whitespace-pre-wrap">
                    {diffs.map((part, index) => {
                        const color = part.added
                            ? 'bg-green-500/20 text-green-700 dark:text-green-300 decoration-green-500/50 underline decoration-2 underline-offset-2'
                            : part.removed
                                ? 'bg-red-500/20 text-red-700 dark:text-red-300 line-through decoration-red-500/50'
                                : '';

                        return (
                            <span key={index} className={cn("px-0.5 rounded-sm transition-colors", color)}>
                                {part.value}
                            </span>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
