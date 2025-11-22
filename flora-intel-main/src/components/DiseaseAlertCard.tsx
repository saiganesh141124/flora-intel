import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Bug, Leaf } from 'lucide-react';
import { DiseaseAlert } from '@/types/sensor';
import { cn } from '@/lib/utils';

interface DiseaseAlertCardProps {
  alert: DiseaseAlert;
}

export const DiseaseAlertCard = ({ alert }: DiseaseAlertCardProps) => {
  const severityConfig = {
    low: { color: 'text-success', bg: 'bg-success/10', badge: 'bg-success' },
    medium: { color: 'text-warning', bg: 'bg-warning/10', badge: 'bg-warning' },
    high: { color: 'text-destructive', bg: 'bg-destructive/10', badge: 'bg-destructive' },
  };

  const config = severityConfig[alert.severity];

  return (
    <Card className={cn('p-5 border-l-4', config.bg, config.color)}>
      <div className="flex items-start gap-3">
        <div className={cn('p-2 rounded-lg', config.bg)}>
          <Bug className={cn('h-5 w-5', config.color)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="font-semibold text-foreground">{alert.diseaseName}</h4>
            <Badge variant="outline" className={cn('shrink-0', config.badge, 'text-white border-0')}>
              {alert.severity.toUpperCase()}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{alert.description}</p>
          <div className={cn('flex items-start gap-2 p-3 rounded-lg', 'bg-background/50')}>
            <Leaf className={cn('h-4 w-4 shrink-0 mt-0.5', 'text-primary')} />
            <div>
              <p className="text-xs font-medium text-foreground mb-1">Recommendation</p>
              <p className="text-xs text-muted-foreground">{alert.recommendation}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Detected {new Date(alert.detectedAt).toLocaleString()}
          </p>
        </div>
      </div>
    </Card>
  );
};
