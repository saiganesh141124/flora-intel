import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Droplets, Sprout, Shield, Sun, LucideIcon } from 'lucide-react';
import { Recommendation } from '@/types/sensor';
import { cn } from '@/lib/utils';

interface RecommendationCardProps {
  recommendation: Recommendation;
}

const categoryIcons: Record<string, LucideIcon> = {
  watering: Droplets,
  fertilizer: Sprout,
  'pest-control': Shield,
  environment: Sun,
};

export const RecommendationCard = ({ recommendation }: RecommendationCardProps) => {
  const Icon = categoryIcons[recommendation.category];
  
  const priorityConfig = {
    low: { color: 'text-muted-foreground', badge: 'bg-muted' },
    medium: { color: 'text-warning', badge: 'bg-warning' },
    high: { color: 'text-destructive', badge: 'bg-destructive' },
  };

  const config = priorityConfig[recommendation.priority];

  return (
    <Card className="p-5 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="font-semibold text-foreground">{recommendation.title}</h4>
            <Badge variant="outline" className={cn('shrink-0', config.badge, 'text-white border-0 text-xs')}>
              {recommendation.priority.toUpperCase()}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{recommendation.description}</p>
          <div className="mt-3">
            <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground capitalize">
              {recommendation.category.replace('-', ' ')}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
