import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SensorCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: LucideIcon;
  status?: 'normal' | 'warning' | 'critical';
  trend?: 'up' | 'down' | 'stable';
}

export const SensorCard = ({ 
  title, 
  value, 
  unit, 
  icon: Icon, 
  status = 'normal',
  trend = 'stable' 
}: SensorCardProps) => {
  const statusColors = {
    normal: 'border-success/20 bg-success/5',
    warning: 'border-warning/20 bg-warning/5',
    critical: 'border-destructive/20 bg-destructive/5',
  };

  const iconColors = {
    normal: 'text-success',
    warning: 'text-warning',
    critical: 'text-destructive',
  };

  return (
    <Card className={cn(
      'p-6 transition-all duration-300 hover:shadow-lg border-2',
      statusColors[status]
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className={cn('p-3 rounded-xl', iconColors[status], 'bg-background/50')}>
          <Icon className="h-6 w-6" />
        </div>
        {trend !== 'stable' && (
          <div className={cn(
            'text-xs px-2 py-1 rounded-full',
            trend === 'up' ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'
          )}>
            {trend === 'up' ? '↑' : '↓'}
          </div>
        )}
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-1">{title}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-foreground">
            {typeof value === 'number' ? value.toFixed(1) : value}
          </span>
          <span className="text-sm text-muted-foreground">{unit}</span>
        </div>
      </div>
    </Card>
  );
};
