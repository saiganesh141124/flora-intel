import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { 
  Leaf, 
  Brain, 
  Wifi, 
  TrendingUp, 
  Shield, 
  Zap,
  Droplets,
  Sun,
  Activity
} from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Wifi,
      title: 'IoT Sensor Integration',
      description: 'Real-time monitoring of temperature, humidity, soil moisture, light intensity, and pH levels through advanced sensor arrays.',
    },
    {
      icon: Brain,
      title: 'AI Disease Prediction',
      description: 'Machine learning algorithms analyze environmental patterns to predict and prevent plant diseases before they occur.',
    },
    {
      icon: TrendingUp,
      title: 'Smart Recommendations',
      description: 'Get personalized suggestions for watering, fertilization, and pest control based on real-time data analysis.',
    },
    {
      icon: Shield,
      title: 'Early Detection',
      description: 'Identify potential issues before they become critical, protecting your crops and maximizing yield.',
    },
    {
      icon: Zap,
      title: 'Automated Alerts',
      description: 'Receive instant notifications when environmental conditions require attention or intervention.',
    },
    {
      icon: Leaf,
      title: 'Eco-Friendly Solutions',
      description: 'Promote sustainable agriculture with data-driven decisions that reduce chemical usage and environmental impact.',
    },
  ];

  const metrics = [
    { icon: Droplets, label: 'Water Efficiency', value: '+35%' },
    { icon: Sun, label: 'Yield Increase', value: '+42%' },
    { icon: Activity, label: 'Disease Prevention', value: '94%' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Header />
      
      {/* Hero Section */}
      <section className="container py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20">
            <Leaf className="h-4 w-4" />
            <span className="text-sm font-medium">Next-Generation Smart Farming</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
            AI-Powered Plant{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Health Monitoring
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Revolutionary IoT and AI technology that predicts plant diseases, optimizes growing conditions, 
            and promotes sustainable agriculture for farmers of all scales.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/dashboard')}
              className="text-lg px-8"
            >
              View Live Dashboard
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8"
            >
              Learn More
            </Button>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
            {metrics.map((metric, index) => (
              <Card key={index} className="p-6 bg-card/50 backdrop-blur border-2 hover:shadow-lg transition-shadow">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <metric.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-foreground">{metric.value}</p>
                    <p className="text-sm text-muted-foreground">{metric.label}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-20 bg-gradient-to-b from-transparent to-muted/20">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Comprehensive Plant Care Platform
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Cutting-edge technology that transforms traditional farming into precision agriculture
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="p-6 hover:shadow-xl transition-all hover:-translate-y-1 border-2"
              >
                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-primary/10 w-fit">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container py-20">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple, effective, and accessible to farmers of all experience levels
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Sensor Deployment',
                description: 'Install IoT sensors near your plants using affordable Raspberry Pi or ESP32 modules.',
              },
              {
                step: '02',
                title: 'Data Collection',
                description: 'Sensors continuously monitor environmental conditions and transmit data in real-time.',
              },
              {
                step: '03',
                title: 'AI Analysis',
                description: 'Our AI analyzes patterns, predicts issues, and provides actionable recommendations.',
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                <Card className="p-8 h-full border-2 hover:border-primary/50 transition-colors">
                  <div className="text-6xl font-bold text-primary/20 mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-semibold text-foreground mb-3">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {item.description}
                  </p>
                </Card>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-primary/30" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20">
        <Card className="max-w-4xl mx-auto p-12 text-center bg-gradient-to-br from-primary/10 to-accent/10 border-2">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Ready to Transform Your Farm?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join the smart farming revolution and start optimizing your crop yields with AI-powered insights today.
            </p>
            <Button 
              size="lg"
              onClick={() => navigate('/dashboard')}
              className="text-lg px-8"
            >
              Get Started Now
            </Button>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/20">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-primary" />
              <span className="font-bold text-foreground">AgriSense AI</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              © 2024 AgriSense AI. Empowering sustainable agriculture through technology.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
