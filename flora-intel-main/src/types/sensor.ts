export interface SensorData {
  timestamp: Date;
  temperature: number;
  humidity: number;
  soilMoisture: number;
  lightIntensity: number;
  pH: number;
}

export interface PlantHealth {
  status: 'healthy' | 'warning' | 'critical';
  score: number;
  message: string;
}

export interface DiseaseAlert {
  id: string;
  severity: 'low' | 'medium' | 'high';
  diseaseName: string;
  description: string;
  recommendation: string;
  detectedAt: Date;
}

export interface Recommendation {
  id: string;
  category: 'watering' | 'fertilizer' | 'pest-control' | 'environment';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
}
