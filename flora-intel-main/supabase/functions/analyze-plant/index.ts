import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64 } = await req.json();
    
    if (!imageBase64) {
      throw new Error('No image data provided');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    console.log('Starting plant disease analysis...');

    // Call Lovable AI with vision capabilities for microscopic disease analysis
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-pro', // Using pro for best vision + reasoning
        messages: [
          {
            role: 'system',
            content: `You are an expert plant pathologist and agricultural scientist with deep knowledge of plant diseases, pests, and microscopic analysis. Analyze plant images to detect diseases, provide detailed microscopic-level insights, and recommend treatments.

Your analysis should include:
1. Overall plant health assessment
2. Disease identification (if any) with confidence level
3. Microscopic symptoms and cellular-level indicators
4. Pathogen identification (fungal, bacterial, viral, or pest-related)
5. Environmental stress indicators
6. Severity assessment (healthy, mild, moderate, severe, critical)
7. Specific recommendations for treatment and prevention
8. Eco-friendly and sustainable treatment options

Respond in JSON format with the following structure:
{
  "health_score": number (0-100),
  "status": "healthy" | "mild" | "moderate" | "severe" | "critical",
  "disease_detected": string or null,
  "pathogen_type": "fungal" | "bacterial" | "viral" | "pest" | "environmental" | "none",
  "confidence": number (0-100),
  "microscopic_analysis": string (detailed cellular-level observations),
  "visible_symptoms": string[],
  "affected_areas": string[],
  "recommendations": string[],
  "preventive_measures": string[],
  "eco_friendly_treatments": string[],
  "estimated_progression": string,
  "urgent_action_required": boolean
}`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this plant image for diseases and provide a detailed microscopic analysis.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64
                }
              }
            ]
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      if (response.status === 402) {
        throw new Error('AI usage limit reached. Please add credits to your workspace.');
      }
      
      throw new Error(`AI analysis failed: ${errorText}`);
    }

    const data = await response.json();
    const analysisText = data.choices?.[0]?.message?.content;
    
    if (!analysisText) {
      throw new Error('No analysis result received');
    }

    console.log('Raw AI response:', analysisText);

    // Parse the JSON response
    let analysis;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = analysisText.match(/```json\n([\s\S]*?)\n```/) || 
                       analysisText.match(/```\n([\s\S]*?)\n```/);
      const jsonText = jsonMatch ? jsonMatch[1] : analysisText;
      analysis = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Return a structured error with the raw text
      analysis = {
        health_score: 75,
        status: 'moderate',
        disease_detected: 'Analysis parsing error',
        pathogen_type: 'none',
        confidence: 50,
        microscopic_analysis: analysisText,
        visible_symptoms: ['Unable to parse detailed analysis'],
        affected_areas: ['See microscopic analysis for details'],
        recommendations: ['Please try again or consult with an agricultural expert'],
        preventive_measures: ['Regular monitoring recommended'],
        eco_friendly_treatments: [],
        estimated_progression: 'Unknown',
        urgent_action_required: false
      };
    }

    console.log('Analysis complete:', JSON.stringify(analysis, null, 2));

    return new Response(
      JSON.stringify(analysis),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in analyze-plant function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        details: 'Plant analysis failed'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});