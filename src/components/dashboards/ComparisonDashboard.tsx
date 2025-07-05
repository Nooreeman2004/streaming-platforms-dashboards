
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useState } from 'react';
import { ZoomIn, ZoomOut, TrendingUp } from 'lucide-react';

const ComparisonDashboard = () => {
  const [zoom, setZoom] = useState(1);

  const platformData = [
    { platform: 'Netflix', totalShows: 13500, movies: 10400, series: 3100, color: '#E50914' },
    { platform: 'Amazon Prime', totalShows: 9684, movies: 7814, series: 1854, color: '#00A8E1' },
    { platform: 'Disney+', totalShows: 1450, movies: 1052, series: 398, color: '#8B5CF6' }
  ];

  const genreComparison = [
    { genre: 'Action', Netflix: 1854, Amazon: 1854, Disney: 98 },
    { genre: 'Comedy', Netflix: 1456, Amazon: 1456, Disney: 145 },
    { genre: 'Drama', Netflix: 1234, Amazon: 1234, Disney: 167 },
    { genre: 'Animation', Netflix: 765, Amazon: 765, Disney: 234 },
    { genre: 'Documentary', Netflix: 987, Amazon: 987, Disney: 123 }
  ];

  const marketShare = [
    { name: 'Netflix', value: 54.8, color: '#E50914' },
    { name: 'Amazon Prime', value: 39.3, color: '#00A8E1' },
    { name: 'Disney+', value: 5.9, color: '#8B5CF6' }
  ];

  const yearlyGrowth = [
    { year: 2019, Netflix: 8500, Amazon: 6500, Disney: 500 },
    { year: 2020, Netflix: 11000, Amazon: 8000, Disney: 900 },
    { year: 2021, Netflix: 13500, Amazon: 9684, Disney: 1450 }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 via-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
            VS
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Platform Comparison Dashboard</h2>
            <p className="text-gray-400">Netflix vs Amazon Prime vs Disney+</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => setZoom(prev => Math.max(prev - 0.2, 0.5))} className="text-gray-300 border-gray-600">
            <ZoomOut className="h-3 w-3" />
          </Button>
          <span className="text-gray-300 text-xs">{Math.round(zoom * 100)}%</span>
          <Button variant="outline" size="sm" onClick={() => setZoom(prev => Math.min(prev + 0.2, 2))} className="text-gray-300 border-gray-600">
            <ZoomIn className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Platform KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {platformData.map((platform, index) => (
          <Card key={index} className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">{platform.platform}</CardTitle>
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: platform.color }}
                ></div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Shows</span>
                <span className="text-white font-bold">{platform.totalShows.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Movies</span>
                <span className="text-white font-bold">{platform.movies.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Series</span>
                <span className="text-white font-bold">{platform.series.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Movies %</span>
                <Badge variant="secondary" style={{ backgroundColor: `${platform.color}20`, color: platform.color }}>
                  {Math.round((platform.movies / platform.totalShows) * 100)}%
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Market Share */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Market Share by Content Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={marketShare}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {marketShare.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }} 
                    formatter={(value) => [`${value}%`, 'Market Share']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Content Growth Over Time */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Content Growth (2019-2021)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={yearlyGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="year" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }} 
                  />
                  <Line type="monotone" dataKey="Netflix" stroke="#E50914" strokeWidth={3} />
                  <Line type="monotone" dataKey="Amazon" stroke="#00A8E1" strokeWidth={3} />
                  <Line type="monotone" dataKey="Disney" stroke="#8B5CF6" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Genre Comparison */}
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Genre Distribution Comparison</CardTitle>
          <div className="flex space-x-6 text-sm mt-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-300">Netflix</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-300">Amazon Prime</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-gray-300">Disney+</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={genreComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="genre" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Bar dataKey="Netflix" fill="#E50914" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Amazon" fill="#00A8E1" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Disney" fill="#8B5CF6" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Key Insights</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 text-sm space-y-3">
            <div className="flex items-center justify-between">
              <span>Content Leader</span>
              <Badge className="bg-red-500/20 text-red-400">Netflix</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Fastest Growing</span>
              <Badge className="bg-purple-500/20 text-purple-400">Disney+</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Most Diverse</span>
              <Badge className="bg-blue-500/20 text-blue-400">Amazon Prime</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Family Friendly</span>
              <Badge className="bg-purple-500/20 text-purple-400">Disney+</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Platform Strengths</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 text-sm space-y-2">
            <p><strong className="text-red-400">Netflix:</strong> Dominates with original series and global content variety.</p>
            <p><strong className="text-blue-400">Amazon Prime:</strong> Strong in movies and documentaries with diverse catalog.</p>
            <p><strong className="text-purple-400">Disney+:</strong> Excellence in family content and premium animated features.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComparisonDashboard;
