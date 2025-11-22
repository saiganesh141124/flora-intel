import { SensorData, DiseaseAlert, Recommendation } from '@/types/sensor';

export const generateMockSensorData = (): SensorData => {
  return {
    timestamp: new Date(),
    temperature: 22 + Math.random() * 10,
    humidity: 50 + Math.random() * 30,
    soilMoisture: 40 + Math.random() * 40,
    lightIntensity: 300 + Math.random() * 700,
    pH: 6 + Math.random() * 2,
  };
};

export const getHistoricalData = (hours: number = 24): SensorData[] => {
  const data: SensorData[] = [];
  const now = new Date();
  
  for (let i = hours; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
    data.push({
      timestamp,
      temperature: 20 + Math.sin(i / 4) * 8 + Math.random() * 3,
      humidity: 60 + Math.cos(i / 3) * 15 + Math.random() * 5,
      soilMoisture: 55 + Math.sin(i / 5) * 20 + Math.random() * 5,
      lightIntensity: i % 24 < 6 || i % 24 > 18 ? 100 + Math.random() * 200 : 500 + Math.random() * 400,
      pH: 6.5 + Math.random() * 0.5,
    });
  }
  
  return data;
};

export const mockDiseaseAlerts: DiseaseAlert[] = [
  {
    id: '1',
    severity: 'medium',
    diseaseName: 'Early Blight Risk',
    description: 'Environmental conditions suggest increased risk of early blight development',
    recommendation: 'Apply copper-based fungicide preventively. Ensure proper air circulation.',
    detectedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
];

export const mockRecommendations: Recommendation[] = [
  {
    id: '1',
    category: 'watering',
    title: 'Increase Watering Frequency',
    description: 'Soil moisture levels are slightly below optimal. Recommend increasing watering frequency by 20%.',
    priority: 'medium',
  },
  {
    id: '2',
    category: 'fertilizer',
    title: 'pH Adjustment Needed',
    description: 'Soil pH is trending acidic. Consider adding agricultural lime to bring pH to optimal range (6.5-7.0).',
    priority: 'low',
  },
  {
    id: '3',
    category: 'environment',
    title: 'Optimize Light Exposure',
    description: 'Light intensity is below optimal levels. Consider repositioning plant or supplementing with grow lights.',
    priority: 'medium',
  },
];
