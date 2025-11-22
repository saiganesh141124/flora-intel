import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Trash2, Eye, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PlantAnalysis {
  id: string;
  image_url: string;
  disease_detected: string | null;
  severity: string;
  created_at: string;
  analysis_result: {
    health_score: number;
    status: string;
    microscopic_analysis: string;
    recommendations: string[];
    visible_symptoms: string[];
    pathogen_type: string;
    confidence: number;
  };
}

export const PlantImageHistory = () => {
  const [analyses, setAnalyses] = useState<PlantAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnalysis, setSelectedAnalysis] = useState<PlantAnalysis | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchAnalyses = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setAnalyses([]);
        return;
      }

      const { data, error } = await supabase
        .from('plant_analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnalyses((data || []) as unknown as PlantAnalysis[]);
    } catch (error) {
      console.error('Error fetching analyses:', error);
      toast({
        title: "Failed to load history",
        description: "Unable to fetch plant analysis history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyses();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('plant_analyses_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'plant_analyses'
        },
        () => {
          fetchAnalyses();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const deleteAnalysis = async (id: string) => {
    try {
      const { error } = await supabase
        .from('plant_analyses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Analysis deleted",
        description: "Plant analysis removed from history",
      });
      
      fetchAnalyses();
    } catch (error) {
      console.error('Error deleting analysis:', error);
      toast({
        title: "Delete failed",
        description: "Unable to delete analysis",
        variant: "destructive",
      });
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'healthy':
        return 'bg-green-500/20 text-green-700 dark:text-green-400';
      case 'mild':
        return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400';
      case 'moderate':
        return 'bg-orange-500/20 text-orange-700 dark:text-orange-400';
      case 'severe':
      case 'critical':
        return 'bg-red-500/20 text-red-700 dark:text-red-400';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <Card className="p-6 bg-card border-border">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-6 bg-card border-border">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-foreground">Analysis History</h3>
          
          {analyses.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No plant analyses yet. Capture and analyze a plant image to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analyses.map((analysis) => (
                <div
                  key={analysis.id}
                  className="border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative aspect-video">
                    <img
                      src={analysis.image_url}
                      alt="Plant analysis"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge className={getSeverityColor(analysis.severity)}>
                        {analysis.severity}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(analysis.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">
                        {analysis.disease_detected || 'No disease detected'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Health Score: {analysis.analysis_result.health_score}/100
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          setSelectedAnalysis(analysis);
                          setDialogOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteAnalysis(analysis.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Plant Analysis Details</DialogTitle>
            <DialogDescription>
              Detailed microscopic analysis and recommendations
            </DialogDescription>
          </DialogHeader>
          
          {selectedAnalysis && (
            <div className="space-y-4">
              <img
                src={selectedAnalysis.image_url}
                alt="Plant analysis"
                className="w-full rounded-lg"
              />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Health Score</p>
                  <p className="text-2xl font-bold text-foreground">
                    {selectedAnalysis.analysis_result.health_score}/100
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge className={getSeverityColor(selectedAnalysis.severity)}>
                    {selectedAnalysis.severity}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pathogen Type</p>
                  <p className="text-foreground">{selectedAnalysis.analysis_result.pathogen_type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Confidence</p>
                  <p className="text-foreground">{selectedAnalysis.analysis_result.confidence}%</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">Microscopic Analysis</h4>
                <p className="text-sm text-foreground/90 whitespace-pre-line">
                  {selectedAnalysis.analysis_result.microscopic_analysis}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">Visible Symptoms</h4>
                <ul className="list-disc list-inside space-y-1">
                  {selectedAnalysis.analysis_result.visible_symptoms?.map((symptom, idx) => (
                    <li key={idx} className="text-sm text-foreground/90">{symptom}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">Recommendations</h4>
                <ul className="list-disc list-inside space-y-1">
                  {selectedAnalysis.analysis_result.recommendations?.map((rec, idx) => (
                    <li key={idx} className="text-sm text-foreground/90">{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};