import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Heart, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlantHealthCardProps {
  score: number;
  status: 'healthy' | 'warning' | 'critical';
  message: string;
}

export const PlantHealthCard = ({ score, status, message }: PlantHealthCardProps) => {
  const statusConfig = {
    healthy: {
      icon: CheckCircle2,
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/30',
      label: 'Healthy',
    },
    warning: {
      icon: AlertTriangle,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/30',
      label: 'Attention Needed',
    },
    critical: {
      icon: AlertTriangle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      borderColor: 'border-destructive/30',
      label: 'Critical',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Card className={cn('p-6 border-2', config.borderColor, config.bgColor)}>
      <div className="flex items-start gap-4">
        <div className={cn('p-3 rounded-xl', config.color, 'bg-background/50')}>
          <Heart className="h-8 w-8 fill-current" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Plant Health Status</h3>
            <div className={cn('flex items-center gap-2 px-3 py-1 rounded-full', config.bgColor, config.color)}>
              <Icon className="h-4 w-4" />
              <span className="text-sm font-medium">{config.label}</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4">{message}</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Health Score</span>
              <span className={cn('font-semibold', config.color)}>{score}%</span>
            </div>
            <Progress 
              value={score} 
              className="h-2"
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
