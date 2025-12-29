import { Card, CardContent } from './Card';
import { cn } from '../../lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function StatsCard({ icon: Icon, label, value, trend, trendValue, color }) {
    const isPositive = trend === 'up';

    return (
        <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className={cn("p-2 rounded-lg bg-opacity-10", color.replace('text-', 'bg-'))}>
                        <Icon className={cn("h-5 w-5", color)} />
                    </div>
                    {trend && (
                        <div className={cn(
                            "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                            isPositive ? "text-green-700 bg-green-50" : "text-red-700 bg-red-50"
                        )}>
                            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            {trendValue}
                        </div>
                    )}
                </div>

                <div className="space-y-1">
                    <h3 className="text-sm font-medium text-muted-foreground">{label}</h3>
                    <div className="text-2xl font-bold tracking-tight">{value}</div>
                </div>

                {/* Decorative Micro-chart (Sparkline Simulation) */}
                <div className="mt-4 h-1 w-full bg-muted/50 rounded-full overflow-hidden">
                    <div
                        className={cn("h-full rounded-full", isPositive ? "bg-green-500" : "bg-primary")}
                        style={{ width: `${Math.random() * 40 + 60}%` }}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
