import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { AuthForm } from '@/components/AuthForm';
import { SensorCard } from '@/components/SensorCard';
import { PlantHealthCard } from '@/components/PlantHealthCard';
import { DiseaseAlertCard } from '@/components/DiseaseAlertCard';
import { RecommendationCard } from '@/components/RecommendationCard';
import { SensorChart } from '@/components/SensorChart';
import { PlantImageCapture } from '@/components/PlantImageCapture';
import { PlantImageHistory } from '@/components/PlantImageHistory';
import { Thermometer, Droplets, Leaf, Sun, Activity } from 'lucide-react';
import { SensorData } from '@/types/sensor';
import { 
  generateMockSensorData, 
  getHistoricalData, 
  mockDiseaseAlerts,
  mockRecommendations 
} from '@/utils/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const [currentData, setCurrentData] = useState<SensorData>(generateMockSensorData());
  const [historicalData] = useState<SensorData[]>(getHistoricalData(24));
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // Check auth status
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setAuthLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentData(generateMockSensorData());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const calculateHealthScore = (data: SensorData): number => {
    const tempScore = data.temperature >= 20 && data.temperature <= 30 ? 100 : 70;
    const humidityScore = data.humidity >= 50 && data.humidity <= 70 ? 100 : 75;
    const moistureScore = data.soilMoisture >= 40 && data.soilMoisture <= 80 ? 100 : 70;
    const phScore = data.pH >= 6.0 && data.pH <= 7.5 ? 100 : 80;
    
    return Math.round((tempScore + humidityScore + moistureScore + phScore) / 4);
  };

  const healthScore = calculateHealthScore(currentData);
  const healthStatus = healthScore >= 80 ? 'healthy' : healthScore >= 60 ? 'warning' : 'critical';

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <Header />
        <div className="container py-8 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <Header />
        <main className="container py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-foreground">Welcome to AgriSense AI</h1>
              <p className="text-muted-foreground">
                Sign in or create an account to access AI-powered plant disease analysis
              </p>
            </div>
            <AuthForm />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Header />
      
      <main className="container py-8 space-y-8">
        {/* Plant Health Overview */}
        <section>
          <PlantHealthCard
            score={healthScore}
            status={healthStatus}
            message={
              healthStatus === 'healthy' 
                ? 'All environmental parameters are within optimal ranges. Plant is thriving!' 
                : healthStatus === 'warning'
                ? 'Some parameters need attention. Review recommendations below.'
                : 'Multiple parameters are outside optimal range. Immediate action recommended.'
            }
          />
        </section>

        {/* Plant Image Analysis */}
        <section>
          <PlantImageCapture />
        </section>

        {/* Plant Image History */}
        <section>
          <PlantImageHistory />
        </section>

        {/* Real-time Sensor Data */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-foreground">Real-Time Monitoring</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <SensorCard
              title="Temperature"
              value={currentData.temperature}
              unit="°C"
              icon={Thermometer}
              status={currentData.temperature >= 20 && currentData.temperature <= 30 ? 'normal' : 'warning'}
            />
            <SensorCard
              title="Humidity"
              value={currentData.humidity}
              unit="%"
              icon={Droplets}
              status={currentData.humidity >= 50 && currentData.humidity <= 70 ? 'normal' : 'warning'}
            />
            <SensorCard
              title="Soil Moisture"
              value={currentData.soilMoisture}
              unit="%"
              icon={Leaf}
              status={currentData.soilMoisture >= 40 && currentData.soilMoisture <= 80 ? 'normal' : 'warning'}
            />
            <SensorCard
              title="Light Intensity"
              value={Math.round(currentData.lightIntensity)}
              unit="lux"
              icon={Sun}
              status={currentData.lightIntensity >= 400 ? 'normal' : 'warning'}
            />
            <SensorCard
              title="Soil pH"
              value={currentData.pH}
              unit=""
              icon={Activity}
              status={currentData.pH >= 6.0 && currentData.pH <= 7.5 ? 'normal' : 'warning'}
            />
          </div>
        </section>

        {/* Charts */}
        <section>
          <Tabs defaultValue="environment" className="space-y-4">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="environment">Environment</TabsTrigger>
              <TabsTrigger value="soil">Soil Conditions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="environment" className="space-y-4">
              <SensorChart
                data={historicalData}
                title="Temperature & Humidity (24h)"
                dataKeys={[
                  { key: 'temperature', label: 'Temperature (°C)', color: 'hsl(var(--chart-1))' },
                  { key: 'humidity', label: 'Humidity (%)', color: 'hsl(var(--chart-2))' },
                ]}
              />
            </TabsContent>
            
            <TabsContent value="soil" className="space-y-4">
              <SensorChart
                data={historicalData}
                title="Soil Moisture & pH (24h)"
                dataKeys={[
                  { key: 'soilMoisture', label: 'Soil Moisture (%)', color: 'hsl(var(--chart-3))' },
                  { key: 'pH', label: 'pH Level', color: 'hsl(var(--chart-4))' },
                ]}
              />
            </TabsContent>
          </Tabs>
        </section>

        {/* Disease Alerts */}
        {mockDiseaseAlerts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-4 text-foreground">Disease Alerts</h2>
            <div className="space-y-3">
              {mockDiseaseAlerts.map(alert => (
                <DiseaseAlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          </section>
        )}

        {/* AI Recommendations */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-foreground">AI-Powered Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockRecommendations.map(rec => (
              <RecommendationCard key={rec.id} recommendation={rec} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
