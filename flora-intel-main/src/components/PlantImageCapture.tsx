import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Upload, X, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const PlantImageCapture = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
        setAnalysis(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!capturedImage) return;
    
    setIsAnalyzing(true);
    try {
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to analyze plant images",
          variant: "destructive",
        });
        setIsAnalyzing(false);
        return;
      }

      console.log('Starting AI analysis...');

      // Call the edge function for AI analysis
      const { data: analysisData, error: functionError } = await supabase.functions.invoke('analyze-plant', {
        body: { imageBase64: capturedImage }
      });

      if (functionError) {
        console.error('Function error:', functionError);
        throw new Error(functionError.message || 'Analysis failed');
      }

      console.log('Analysis result:', analysisData);

      // Upload image to storage
      const fileName = `${user.id}/${Date.now()}.jpg`;
      const base64Data = capturedImage.split(',')[1];
      const binaryData = atob(base64Data);
      const bytes = new Uint8Array(binaryData.length);
      for (let i = 0; i < binaryData.length; i++) {
        bytes[i] = binaryData.charCodeAt(i);
      }

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('plant-images')
        .upload(fileName, bytes, {
          contentType: 'image/jpeg',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('plant-images')
        .getPublicUrl(fileName);

      // Save to database
      const { error: dbError } = await supabase
        .from('plant_analyses')
        .insert({
          user_id: user.id,
          image_url: publicUrl,
          analysis_result: analysisData,
          disease_detected: analysisData.disease_detected,
          severity: analysisData.status,
          recommendations: analysisData.recommendations || []
        });

      if (dbError) {
        console.error('Database error:', dbError);
        throw dbError;
      }

      // Format analysis for display
      const formattedAnalysis = `
**Plant Health Analysis:**

• **Health Score:** ${analysisData.health_score}/100
• **Status:** ${analysisData.status.toUpperCase()}
• **Disease Detected:** ${analysisData.disease_detected || 'None'}
• **Pathogen Type:** ${analysisData.pathogen_type}
• **Confidence Level:** ${analysisData.confidence}%

**Microscopic Analysis:**
${analysisData.microscopic_analysis}

**Visible Symptoms:**
${analysisData.visible_symptoms?.map((s: string) => `  - ${s}`).join('\n') || 'None detected'}

**Affected Areas:**
${analysisData.affected_areas?.map((a: string) => `  - ${a}`).join('\n') || 'None'}

**Recommendations:**
${analysisData.recommendations?.map((r: string) => `  - ${r}`).join('\n') || 'No recommendations'}

**Eco-Friendly Treatments:**
${analysisData.eco_friendly_treatments?.map((t: string) => `  - ${t}`).join('\n') || 'None needed'}

**Preventive Measures:**
${analysisData.preventive_measures?.map((p: string) => `  - ${p}`).join('\n') || 'None'}

**Estimated Progression:** ${analysisData.estimated_progression}
${analysisData.urgent_action_required ? '\n⚠️ **URGENT ACTION REQUIRED**' : ''}
      `.trim();

      setAnalysis(formattedAnalysis);
      
      toast({
        title: "Analysis Complete",
        description: "Plant image analyzed and saved successfully",
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Unable to analyze image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearImage = () => {
    setCapturedImage(null);
    setAnalysis(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="p-6 bg-card border-border">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-foreground">Plant Image Analysis</h3>
          {capturedImage && (
            <Button variant="ghost" size="icon" onClick={clearImage}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {!capturedImage ? (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                Capture or upload a plant image for AI analysis
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleCapture}
                className="hidden"
                id="camera-input"
              />
              <div className="flex gap-2 justify-center">
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-2"
                >
                  <Camera className="h-4 w-4" />
                  Take Photo
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.removeAttribute('capture');
                      fileInputRef.current.click();
                    }
                  }}
                  className="gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Upload
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden">
              <img 
                src={capturedImage} 
                alt="Captured plant" 
                className="w-full h-auto max-h-96 object-contain bg-muted"
              />
            </div>
            
            {!analysis && (
              <Button 
                onClick={analyzeImage}
                disabled={isAnalyzing}
                className="w-full gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze Plant Health'
                )}
              </Button>
            )}

            {analysis && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <h4 className="font-semibold text-foreground mb-2">AI Analysis Results</h4>
                <div className="text-sm text-foreground/90 whitespace-pre-line">
                  {analysis}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
