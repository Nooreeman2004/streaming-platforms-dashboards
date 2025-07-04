
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import NetflixDashboard from '@/components/dashboards/NetflixDashboard';
import AmazonDashboard from '@/components/dashboards/AmazonDashboard';
import DisneyDashboard from '@/components/dashboards/DisneyDashboard';
import ComparisonDashboard from '@/components/dashboards/ComparisonDashboard';

type Platform = 'netflix' | 'amazon' | 'disney' | 'comparison';

const Index = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('netflix');

  const platforms = [
    { id: 'netflix', name: 'Netflix', color: 'bg-red-500', textColor: 'text-red-500' },
    { id: 'amazon', name: 'Amazon Prime', color: 'bg-blue-500', textColor: 'text-blue-500' },
    { id: 'disney', name: 'Disney+', color: 'bg-purple-500', textColor: 'text-purple-500' },
    { id: 'comparison', name: 'Compare All', color: 'bg-gradient-to-r from-red-500 via-blue-500 to-purple-500', textColor: 'text-gray-700' }
  ];

  const renderDashboard = () => {
    try {
      switch (selectedPlatform) {
        case 'netflix':
          return <NetflixDashboard />;
        case 'amazon':
          return <AmazonDashboard />;
        case 'disney':
          return <DisneyDashboard />;
        case 'comparison':
          return <ComparisonDashboard />;
        default:
          return <NetflixDashboard />;
      }
    } catch (error) {
      console.error('Error rendering dashboard:', error);
      return (
        <div className="text-white text-center py-20">
          <h2 className="text-2xl mb-4">Error loading dashboard</h2>
          <p className="text-gray-400">Please try refreshing the page</p>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header Navigation */}
      <div className="sticky top-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white">Streaming Analytics</h1>
              <Badge variant="secondary" className="text-xs">
                Dashboard Suite
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              {platforms.map((platform) => (
                <Button
                  key={platform.id}
                  variant={selectedPlatform === platform.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedPlatform(platform.id as Platform)}
                  className={`transition-all duration-300 ${
                    selectedPlatform === platform.id
                      ? `${platform.color} text-white shadow-lg`
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {platform.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-6">
        {renderDashboard()}
      </div>
    </div>
  );
};

export default Index;
