
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { useState } from 'react';
import { TrendingUp, Users, Globe, Star, ZoomIn, ZoomOut, Filter } from 'lucide-react';

const ComparisonDashboard = () => {
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [selectedMetric, setSelectedMetric] = useState('All');
  const [selectedYear, setSelectedYear] = useState('2023');
  
  // Individual zoom states
  const [marketZoom, setMarketZoom] = useState(1);
  const [contentZoom, setContentZoom] = useState(1);
  const [budgetZoom, setBudgetZoom] = useState(1);
  const [performanceZoom, setPerformanceZoom] = useState(1);
  const [genreZoom, setGenreZoom] = useState(1);
  const [regionalZoom, setRegionalZoom] = useState(1);

  const platforms = ['All', 'Netflix', 'Amazon Prime', 'Disney+', 'Hulu', 'HBO Max'];
  const metrics = ['All', 'Subscribers', 'Content', 'Revenue', 'Engagement'];
  const years = ['2021', '2022', '2023', '2024'];

  // Updated data with colors for Content Production Budget
  const contentProductionData = [
    { platform: 'Netflix', budget: 17.0, color: '#DC2626' },
    { platform: 'Amazon Prime', budget: 13.0, color: '#2563EB' },
    { platform: 'Disney+', budget: 10.0, color: '#7C3AED' },
    { platform: 'HBO Max', budget: 8.0, color: '#059669' },
    { platform: 'Apple TV+', budget: 6.0, color: '#D97706' },
    { platform: 'Hulu', budget: 4.0, color: '#DC2626' }
  ];

  const marketShareData = [
    { platform: 'Netflix', share: 28, subscribers: 247.2, color: '#DC2626' },
    { platform: 'Amazon Prime', share: 22, subscribers: 200.0, color: '#2563EB' },
    { platform: 'Disney+', share: 15, subscribers: 164.2, color: '#7C3AED' },
    { platform: 'HBO Max', share: 12, subscribers: 95.8, color: '#059669' },
    { platform: 'Hulu', share: 10, subscribers: 48.2, color: '#D97706' },
    { platform: 'Others', share: 13, subscribers: 120.5, color: '#6B7280' }
  ];

  const contentVolumeData = [
    { year: '2020', netflix: 3500, amazon: 2800, disney: 1200, hulu: 1800, hbo: 1500 },
    { year: '2021', netflix: 4200, amazon: 3400, disney: 1600, hulu: 2100, hbo: 1800 },
    { year: '2022', netflix: 5100, amazon: 4200, disney: 2200, hulu: 2500, hbo: 2200 },
    { year: '2023', netflix: 6200, amazon: 5200, disney: 2900, hulu: 3100, hbo: 2800 }
  ];

  const performanceMetrics = [
    { platform: 'Netflix', engagement: 85, retention: 78, satisfaction: 82 },
    { platform: 'Amazon Prime', engagement: 79, retention: 74, satisfaction: 79 },
    { platform: 'Disney+', engagement: 88, retention: 82, satisfaction: 87 },
    { platform: 'HBO Max', engagement: 82, retention: 76, satisfaction: 84 },
    { platform: 'Hulu', engagement: 75, retention: 71, satisfaction: 76 }
  ];

  const genrePopularityData = [
    { genre: 'Drama', netflix: 25, amazon: 22, disney: 15, hbo: 30 },
    { genre: 'Comedy', netflix: 20, amazon: 18, disney: 25, hbo: 15 },
    { genre: 'Action', netflix: 18, amazon: 25, disney: 20, hbo: 20 },
    { genre: 'Documentary', netflix: 15, amazon: 20, disney: 10, hbo: 18 },
    { genre: 'Animation', netflix: 12, amazon: 8, disney: 40, hbo: 5 },
    { genre: 'Sci-Fi', netflix: 10, amazon: 15, disney: 8, hbo: 12 }
  ];

  const regionalReachData = [
    { region: 'North America', netflix: 95, amazon: 88, disney: 92, hbo: 85 },
    { region: 'Europe', netflix: 87, amazon: 82, disney: 78, hbo: 75 },
    { region: 'Asia Pacific', netflix: 78, amazon: 85, disney: 65, hbo: 45 },
    { region: 'Latin America', netflix: 92, amazon: 70, disney: 68, hbo: 55 },
    { region: 'Middle East', netflix: 65, amazon: 75, disney: 58, hbo: 40 }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-700 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
            VS
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Platform Comparison Dashboard</h2>
            <p className="text-gray-400">Comprehensive streaming platform analytics</p>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Analysis Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-gray-300 text-sm mb-2 block">Platform</label>
              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {platforms.map(platform => (
                    <SelectItem key={platform} value={platform} className="text-white hover:bg-gray-600">{platform}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-gray-300 text-sm mb-2 block">Metric Focus</label>
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select metric" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {metrics.map(metric => (
                    <SelectItem key={metric} value={metric} className="text-white hover:bg-gray-600">{metric}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-gray-300 text-sm mb-2 block">Year</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {years.map(year => (
                    <SelectItem key={year} value={year} className="text-white hover:bg-gray-600">{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-purple-600 to-purple-700 border-0 text-white">
          <CardHeader className="pb-2 flex flex-row items-center space-y-0">
            <CardTitle className="text-sm font-medium opacity-90">Total Platforms</CardTitle>
            <Globe className="h-4 w-4 ml-auto opacity-70" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">25+</div>
            <div className="text-sm opacity-70">Major Services</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 text-white">
          <CardHeader className="pb-2 flex flex-row items-center space-y-0">
            <CardTitle className="text-sm font-medium opacity-90">Global Subscribers</CardTitle>
            <Users className="h-4 w-4 ml-auto opacity-70" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-400">1.2B+</div>
            <div className="text-sm opacity-70">Worldwide</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 text-white">
          <CardHeader className="pb-2 flex flex-row items-center space-y-0">
            <CardTitle className="text-sm font-medium opacity-90">Content Investment</CardTitle>
            <TrendingUp className="h-4 w-4 ml-auto opacity-70" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-400">$58B+</div>
            <div className="text-sm opacity-70">Annual Budget</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 text-white">
          <CardHeader className="pb-2 flex flex-row items-center space-y-0">
            <CardTitle className="text-sm font-medium opacity-90">Avg Rating</CardTitle>
            <Star className="h-4 w-4 ml-auto opacity-70" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-400">8.2</div>
            <div className="text-sm opacity-70">User Score</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid - Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Market Share - Pie Chart */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Market Share Distribution</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setMarketZoom(prev => Math.max(prev - 0.2, 0.5))} className="text-gray-300 border-gray-600">
                <ZoomOut className="h-3 w-3" />
              </Button>
              <span className="text-gray-300 text-xs">{Math.round(marketZoom * 100)}%</span>
              <Button variant="outline" size="sm" onClick={() => setMarketZoom(prev => Math.min(prev + 0.2, 2))} className="text-gray-300 border-gray-600">
                <ZoomIn className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div style={{ transform: `scale(${marketZoom})`, transformOrigin: 'center' }}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={marketShareData}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="share"
                  >
                    {marketShareData.map((entry, index) => (
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
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Content Volume - Area Chart */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Content Volume Growth</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setContentZoom(prev => Math.max(prev - 0.2, 0.5))} className="text-gray-300 border-gray-600">
                <ZoomOut className="h-3 w-3" />
              </Button>
              <span className="text-gray-300 text-xs">{Math.round(contentZoom * 100)}%</span>
              <Button variant="outline" size="sm" onClick={() => setContentZoom(prev => Math.min(prev + 0.2, 2))} className="text-gray-300 border-gray-600">
                <ZoomIn className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div style={{ transform: `scale(${contentZoom})`, transformOrigin: 'center' }}>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={contentVolumeData}>
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
                  <Legend />
                  <Area type="monotone" dataKey="netflix" stackId="1" stroke="#DC2626" fill="#DC2626" fillOpacity={0.8} name="Netflix" />
                  <Area type="monotone" dataKey="amazon" stackId="1" stroke="#2563EB" fill="#2563EB" fillOpacity={0.8} name="Amazon Prime" />
                  <Area type="monotone" dataKey="disney" stackId="1" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.8} name="Disney+" />
                  <Area type="monotone" dataKey="hulu" stackId="1" stroke="#D97706" fill="#D97706" fillOpacity={0.8} name="Hulu" />
                  <Area type="monotone" dataKey="hbo" stackId="1" stroke="#059669" fill="#059669" fillOpacity={0.8} name="HBO Max" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Production Budget - Fixed with colors */}
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Content Production Budget (Billions $)</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => setBudgetZoom(prev => Math.max(prev - 0.2, 0.5))} className="text-gray-300 border-gray-600">
              <ZoomOut className="h-3 w-3" />
            </Button>
            <span className="text-gray-300 text-xs">{Math.round(budgetZoom * 100)}%</span>
            <Button variant="outline" size="sm" onClick={() => setBudgetZoom(prev => Math.min(prev + 0.2, 2))} className="text-gray-300 border-gray-600">
              <ZoomIn className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div style={{ transform: `scale(${budgetZoom})`, transformOrigin: 'center' }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={contentProductionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="platform" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Bar dataKey="budget" fill="#8884d8" radius={[4, 4, 0, 0]}>
                  {contentProductionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Charts Grid - Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Metrics - Radar Chart */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Platform Performance Metrics</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setPerformanceZoom(prev => Math.max(prev - 0.2, 0.5))} className="text-gray-300 border-gray-600">
                <ZoomOut className="h-3 w-3" />
              </Button>
              <span className="text-gray-300 text-xs">{Math.round(performanceZoom * 100)}%</span>
              <Button variant="outline" size="sm" onClick={() => setPerformanceZoom(prev => Math.min(prev + 0.2, 2))} className="text-gray-300 border-gray-600">
                <ZoomIn className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div style={{ transform: `scale(${performanceZoom})`, transformOrigin: 'center' }}>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={performanceMetrics}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis dataKey="platform" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                  <PolarRadiusAxis tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                  <Radar
                    name="Engagement"
                    dataKey="engagement"
                    stroke="#DC2626"
                    fill="#DC2626"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Radar
                    name="Retention"
                    dataKey="retention"
                    stroke="#2563EB"
                    fill="#2563EB"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Radar
                    name="Satisfaction"
                    dataKey="satisfaction"
                    stroke="#7C3AED"
                    fill="#7C3AED"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }} 
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Genre Popularity - Line Chart */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Genre Popularity by Platform</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setGenreZoom(prev => Math.max(prev - 0.2, 0.5))} className="text-gray-300 border-gray-600">
                <ZoomOut className="h-3 w-3" />
              </Button>
              <span className="text-gray-300 text-xs">{Math.round(genreZoom * 100)}%</span>
              <Button variant="outline" size="sm" onClick={() => setGenreZoom(prev => Math.min(prev + 0.2, 2))} className="text-gray-300 border-gray-600">
                <ZoomIn className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div style={{ transform: `scale(${genreZoom})`, transformOrigin: 'center' }}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={genrePopularityData}>
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
                  <Legend />
                  <Line type="monotone" dataKey="netflix" stroke="#DC2626" strokeWidth={2} name="Netflix" />
                  <Line type="monotone" dataKey="amazon" stroke="#2563EB" strokeWidth={2} name="Amazon Prime" />
                  <Line type="monotone" dataKey="disney" stroke="#7C3AED" strokeWidth={2} name="Disney+" />
                  <Line type="monotone" dataKey="hbo" stroke="#059669" strokeWidth={2} name="HBO Max" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Regional Reach Analysis */}
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Regional Market Penetration (%)</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => setRegionalZoom(prev => Math.max(prev - 0.2, 0.5))} className="text-gray-300 border-gray-600">
              <ZoomOut className="h-3 w-3" />
            </Button>
            <span className="text-gray-300 text-xs">{Math.round(regionalZoom * 100)}%</span>
            <Button variant="outline" size="sm" onClick={() => setRegionalZoom(prev => Math.min(prev + 0.2, 2))} className="text-gray-300 border-gray-600">
              <ZoomIn className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div style={{ transform: `scale(${regionalZoom})`, transformOrigin: 'center' }}>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={regionalReachData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#9CA3AF" />
                <YAxis dataKey="region" type="category" stroke="#9CA3AF" width={100} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Legend />
                <Bar dataKey="netflix" fill="#DC2626" name="Netflix" />
                <Bar dataKey="amazon" fill="#2563EB" name="Amazon Prime" />
                <Bar dataKey="disney" fill="#7C3AED" name="Disney+" />
                <Bar dataKey="hbo" fill="#059669" name="HBO Max" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Platform Insights */}
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Platform Insights & Analysis</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300 text-sm space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-white font-semibold mb-2">Market Leadership</h4>
              <p>Netflix continues to lead with 28% market share, leveraging its first-mover advantage and global content strategy.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">Content Investment</h4>
              <p>Combined industry spending exceeds $58B annually, with Netflix and Amazon leading content production budgets.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">Regional Dynamics</h4>
              <p>Platform success varies significantly by region, with local content preferences driving engagement patterns.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">Genre Strategies</h4>
              <p>Each platform has distinct genre strengths: Disney+ dominates animation, HBO Max leads in drama quality.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">Competitive Analysis</Badge>
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">Market Intelligence</Badge>
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">Strategic Insights</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComparisonDashboard;
