import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, ScatterChart, Scatter, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, AreaChart, Area, ComposedChart } from 'recharts';
import { useState } from 'react';
import { ZoomIn, ZoomOut, TrendingUp, Target, Users, Award, Filter, Globe } from 'lucide-react';

const ComparisonDashboard = () => {
  const [zoom, setZoom] = useState(1);
  const [marketZoom, setMarketZoom] = useState(1);
  const [growthZoom, setGrowthZoom] = useState(1);
  const [genreZoom, setGenreZoom] = useState(1);
  const [qualityZoom, setQualityZoom] = useState(1);
  const [engagementZoom, setEngagementZoom] = useState(1);
  const [revenueZoom, setRevenueZoom] = useState(1);
  const [demographicsZoom, setDemographicsZoom] = useState(1);
  const [ratingMapZoom, setRatingMapZoom] = useState(1);

  // Filter states
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedMetric, setSelectedMetric] = useState('content');

  const platformData = [
    { platform: 'Netflix', totalShows: 13500, movies: 10400, series: 3100, color: '#E50914', subscribers: 230, revenue: 31.6 },
    { platform: 'Amazon Prime', totalShows: 9684, movies: 7814, series: 1854, color: '#00A8E1', subscribers: 200, revenue: 25.0 },
    { platform: 'Disney+', totalShows: 1450, movies: 1052, series: 398, color: '#8B5CF6', subscribers: 118, revenue: 7.4 }
  ];

  const genreComparison = [
    { genre: 'Action', Netflix: 1854, Amazon: 1654, Disney: 298 },
    { genre: 'Comedy', Netflix: 1456, Amazon: 1256, Disney: 145 },
    { genre: 'Drama', Netflix: 1234, Amazon: 1134, Disney: 167 },
    { genre: 'Animation', Netflix: 765, Amazon: 565, Disney: 434 },
    { genre: 'Documentary', Netflix: 987, Amazon: 1287, Disney: 123 },
    { genre: 'Horror', Netflix: 456, Amazon: 356, Disney: 23 },
    { genre: 'Romance', Netflix: 654, Amazon: 454, Disney: 87 }
  ];

  const marketShare = [
    { name: 'Netflix', value: 54.8, color: '#E50914' },
    { name: 'Amazon Prime', value: 39.3, color: '#FF9500' },
    { name: 'Disney+', value: 5.9, color: '#00D4FF' }
  ];

  const yearlyGrowth = [
    { year: 2019, Netflix: 8500, Amazon: 6500, Disney: 500 },
    { year: 2020, Netflix: 11000, Amazon: 8000, Disney: 900 },
    { year: 2021, Netflix: 13500, Amazon: 9684, Disney: 1450 },
    { year: 2022, Netflix: 15000, Amazon: 11000, Disney: 1800 },
    { year: 2023, Netflix: 16500, Amazon: 12500, Disney: 2200 }
  ];

  const contentQuality = [
    { platform: 'Netflix', originalContent: 85, userRating: 8.2, criticalAcclaim: 72, globalReach: 95, contentDiversity: 88 },
    { platform: 'Amazon Prime', originalContent: 78, userRating: 7.8, criticalAcclaim: 75, globalReach: 87, contentDiversity: 92 },
    { platform: 'Disney+', originalContent: 92, userRating: 8.5, criticalAcclaim: 85, globalReach: 82, contentDiversity: 65 }
  ];

  const userEngagement = [
    { platform: 'Netflix', dailyActiveUsers: 85, avgWatchTime: 3.2, retention: 92, satisfaction: 4.2 },
    { platform: 'Amazon Prime', dailyActiveUsers: 67, avgWatchTime: 2.8, retention: 88, satisfaction: 4.0 },
    { platform: 'Disney+', dailyActiveUsers: 78, avgWatchTime: 2.5, retention: 95, satisfaction: 4.5 }
  ];

  const revenueData = [
    { year: 2019, Netflix: 20.2, Amazon: 14.5, Disney: 0 },
    { year: 2020, Netflix: 25.0, Amazon: 19.2, Disney: 2.8 },
    { year: 2021, Netflix: 29.7, Amazon: 22.1, Disney: 5.5 },
    { year: 2022, Netflix: 31.6, Amazon: 25.0, Disney: 7.4 },
    { year: 2023, Netflix: 33.7, Amazon: 27.8, Disney: 8.9 }
  ];

  const demographicsData = [
    { ageGroup: '18-24', Netflix: 23, Amazon: 18, Disney: 15 },
    { ageGroup: '25-34', Netflix: 32, Amazon: 28, Disney: 25 },
    { ageGroup: '35-44', Netflix: 28, Amazon: 31, Disney: 35 },
    { ageGroup: '45-54', Netflix: 12, Amazon: 16, Disney: 18 },
    { ageGroup: '55+', Netflix: 5, Amazon: 7, Disney: 7 }
  ];

  // Platform ratings by country for map visualization
  const platformRatingsByCountry = [
    { country: 'United States', Netflix: 8.5, Amazon: 8.2, Disney: 8.7, subscribers: 75000000 },
    { country: 'United Kingdom', Netflix: 8.3, Amazon: 8.0, Disney: 8.6, subscribers: 15000000 },
    { country: 'Canada', Netflix: 8.4, Amazon: 7.9, Disney: 8.5, subscribers: 8000000 },
    { country: 'Germany', Netflix: 8.1, Amazon: 8.1, Disney: 8.3, subscribers: 12000000 },
    { country: 'France', Netflix: 7.9, Amazon: 7.8, Disney: 8.4, subscribers: 9000000 },
    { country: 'Japan', Netflix: 8.0, Amazon: 7.7, Disney: 8.8, subscribers: 6000000 },
    { country: 'Australia', Netflix: 8.2, Amazon: 7.8, Disney: 8.2, subscribers: 4000000 },
    { country: 'Brazil', Netflix: 8.3, Amazon: 7.6, Disney: 8.1, subscribers: 18000000 },
    { country: 'India', Netflix: 7.8, Amazon: 8.3, Disney: 7.9, subscribers: 25000000 },
    { country: 'South Korea', Netflix: 8.6, Amazon: 7.5, Disney: 8.0, subscribers: 3000000 }
  ];

  // Filter data based on selections
  const getFilteredData = () => {
    let filteredGenreData = genreComparison;
    if (selectedGenre !== 'all') {
      filteredGenreData = genreComparison.filter(item => item.genre.toLowerCase() === selectedGenre);
    }
    return filteredGenreData;
  };

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

      {/* Filters */}
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters & Analytics Controls</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Genre Filter</label>
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="All Genres" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="all">All Genres</SelectItem>
                  <SelectItem value="action">Action</SelectItem>
                  <SelectItem value="comedy">Comedy</SelectItem>
                  <SelectItem value="drama">Drama</SelectItem>
                  <SelectItem value="animation">Animation</SelectItem>
                  <SelectItem value="documentary">Documentary</SelectItem>
                  <SelectItem value="horror">Horror</SelectItem>
                  <SelectItem value="romance">Romance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Year Filter</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="All Years" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="all">All Years</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="2021">2021</SelectItem>
                  <SelectItem value="2020">2020</SelectItem>
                  <SelectItem value="2019">2019</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-2 block">Primary Metric</label>
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Content Volume" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="content">Content Volume</SelectItem>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="subscribers">Subscribers</SelectItem>
                  <SelectItem value="engagement">User Engagement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                onClick={() => {
                  setSelectedGenre('all');
                  setSelectedYear('all');
                  setSelectedMetric('content');
                }}
                className="w-full bg-gradient-to-r from-red-500 via-blue-500 to-purple-500 text-white"
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

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
                <span className="text-gray-400">Subscribers (M)</span>
                <Badge variant="secondary" style={{ backgroundColor: `${platform.color}20`, color: platform.color }}>
                  {platform.subscribers}M
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid - Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Market Share - Fixed colors and removed gaps */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Market Share by Content Volume</CardTitle>
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
                    data={marketShare}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    paddingAngle={0}
                    dataKey="value"
                  >
                    {marketShare.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
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
            <div className="flex justify-center space-x-4 mt-4">
              {marketShare.map((entry, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                  <span className="text-gray-300 text-sm">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Content Growth Over Time */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Content Growth (2019-2023)</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setGrowthZoom(prev => Math.max(prev - 0.2, 0.5))} className="text-gray-300 border-gray-600">
                <ZoomOut className="h-3 w-3" />
              </Button>
              <span className="text-gray-300 text-xs">{Math.round(growthZoom * 100)}%</span>
              <Button variant="outline" size="sm" onClick={() => setGrowthZoom(prev => Math.min(prev + 0.2, 2))} className="text-gray-300 border-gray-600">
                <ZoomIn className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div style={{ transform: `scale(${growthZoom})`, transformOrigin: 'center' }}>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={yearlyGrowth}>
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
                  <Area type="monotone" dataKey="Netflix" stackId="1" stroke="#E50914" fill="#E50914" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="Amazon" stackId="1" stroke="#00A8E1" fill="#00A8E1" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="Disney" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Global Platform Ratings Map */}
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>Platform Ratings by Country</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => setRatingMapZoom(prev => Math.max(prev - 0.2, 0.5))} className="text-gray-300 border-gray-600">
              <ZoomOut className="h-3 w-3" />
            </Button>
            <span className="text-gray-300 text-xs">{Math.round(ratingMapZoom * 100)}%</span>
            <Button variant="outline" size="sm" onClick={() => setRatingMapZoom(prev => Math.min(prev + 0.2, 2))} className="text-gray-300 border-gray-600">
              <ZoomIn className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div style={{ transform: `scale(${ratingMapZoom})`, transformOrigin: 'center' }}>
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={platformRatingsByCountry} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="country" 
                  stroke="#9CA3AF" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={10}
                />
                <YAxis stroke="#9CA3AF" domain={[7, 9]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Bar dataKey="Netflix" fill="#E50914" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Amazon" fill="#FF9500" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Disney" fill="#00D4FF" radius={[2, 2, 0, 0]} />
                <Line type="monotone" dataKey="Netflix" stroke="#E50914" strokeWidth={2} />
                <Line type="monotone" dataKey="Amazon" stroke="#FF9500" strokeWidth={2} />
                <Line type="monotone" dataKey="Disney" stroke="#00D4FF" strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-gray-300 text-sm">Netflix Rating</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span className="text-gray-300 text-sm">Amazon Rating</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
              <span className="text-gray-300 text-sm">Disney+ Rating</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Grid - Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Comparison */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white flex items-center space-x-2">
              <Award className="h-5 w-5" />
              <span>Revenue Growth (Billions $)</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setRevenueZoom(prev => Math.max(prev - 0.2, 0.5))} className="text-gray-300 border-gray-600">
                <ZoomOut className="h-3 w-3" />
              </Button>
              <span className="text-gray-300 text-xs">{Math.round(revenueZoom * 100)}%</span>
              <Button variant="outline" size="sm" onClick={() => setRevenueZoom(prev => Math.min(prev + 0.2, 2))} className="text-gray-300 border-gray-600">
                <ZoomIn className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div style={{ transform: `scale(${revenueZoom})`, transformOrigin: 'center' }}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
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

        {/* User Demographics */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>User Demographics by Age</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setDemographicsZoom(prev => Math.max(prev - 0.2, 0.5))} className="text-gray-300 border-gray-600">
                <ZoomOut className="h-3 w-3" />
              </Button>
              <span className="text-gray-300 text-xs">{Math.round(demographicsZoom * 100)}%</span>
              <Button variant="outline" size="sm" onClick={() => setDemographicsZoom(prev => Math.min(prev + 0.2, 2))} className="text-gray-300 border-gray-600">
                <ZoomIn className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div style={{ transform: `scale(${demographicsZoom})`, transformOrigin: 'center' }}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={demographicsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="ageGroup" stroke="#9CA3AF" />
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
      </div>

      {/* Genre Comparison - Apply filters */}
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">
            Genre Distribution Comparison 
            {selectedGenre !== 'all' && (
              <Badge className="ml-2 bg-blue-500/20 text-blue-400">
                {selectedGenre.charAt(0).toUpperCase() + selectedGenre.slice(1)}
              </Badge>
            )}
          </CardTitle>
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
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={getFilteredData()}>
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
                <Bar dataKey="Amazon" fill="#FF9500" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Disney" fill="#00D4FF" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-gray-300 text-sm">Netflix</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span className="text-gray-300 text-sm">Amazon Prime</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
              <span className="text-gray-300 text-sm">Disney+</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Grid - Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Quality Radar */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Content Quality Metrics</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setQualityZoom(prev => Math.max(prev - 0.2, 0.5))} className="text-gray-300 border-gray-600">
                <ZoomOut className="h-3 w-3" />
              </Button>
              <span className="text-gray-300 text-xs">{Math.round(qualityZoom * 100)}%</span>
              <Button variant="outline" size="sm" onClick={() => setQualityZoom(prev => Math.min(prev + 0.2, 2))} className="text-gray-300 border-gray-600">
                <ZoomIn className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div style={{ transform: `scale(${qualityZoom})`, transformOrigin: 'center' }}>
              <ResponsiveContainer width="100%" height={350}>
                <RadarChart data={[
                  { metric: 'Original Content', Netflix: 85, Amazon: 78, Disney: 92 },
                  { metric: 'User Rating', Netflix: 82, Amazon: 78, Disney: 85 },
                  { metric: 'Critical Acclaim', Netflix: 72, Amazon: 75, Disney: 85 },
                  { metric: 'Global Reach', Netflix: 95, Amazon: 87, Disney: 82 },
                  { metric: 'Content Diversity', Netflix: 88, Amazon: 92, Disney: 65 }
                ]}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                  <PolarRadiusAxis angle={0} domain={[0, 100]} tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                  <Radar name="Netflix" dataKey="Netflix" stroke="#E50914" fill="#E50914" fillOpacity={0.2} />
                  <Radar name="Amazon" dataKey="Amazon" stroke="#00A8E1" fill="#00A8E1" fillOpacity={0.2} />
                  <Radar name="Disney" dataKey="Disney" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.2} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }} 
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* User Engagement Scatter */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">User Engagement vs Satisfaction</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setEngagementZoom(prev => Math.max(prev - 0.2, 0.5))} className="text-gray-300 border-gray-600">
                <ZoomOut className="h-3 w-3" />
              </Button>
              <span className="text-gray-300 text-xs">{Math.round(engagementZoom * 100)}%</span>
              <Button variant="outline" size="sm" onClick={() => setEngagementZoom(prev => Math.min(prev + 0.2, 2))} className="text-gray-300 border-gray-600">
                <ZoomIn className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div style={{ transform: `scale(${engagementZoom})`, transformOrigin: 'center' }}>
              <ResponsiveContainer width="100%" height={350}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis type="number" dataKey="dailyActiveUsers" name="Daily Active Users %" stroke="#9CA3AF" />
                  <YAxis type="number" dataKey="satisfaction" name="Satisfaction" domain={[0, 5]} stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }} 
                    cursor={{ strokeDasharray: '3 3' }}
                  />
                  <Scatter name="Netflix" data={[{ dailyActiveUsers: 85, satisfaction: 4.2, platform: 'Netflix' }]} fill="#E50914" />
                  <Scatter name="Amazon" data={[{ dailyActiveUsers: 67, satisfaction: 4.0, platform: 'Amazon Prime' }]} fill="#00A8E1" />
                  <Scatter name="Disney" data={[{ dailyActiveUsers: 78, satisfaction: 4.5, platform: 'Disney+' }]} fill="#8B5CF6" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

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
            <div className="flex items-center justify-between">
              <span>Highest Revenue</span>
              <Badge className="bg-red-500/20 text-red-400">Netflix</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Platform Strengths</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 text-sm space-y-2">
            <p><strong className="text-red-400">Netflix:</strong> Dominates with original series and global content variety. Highest subscriber base and revenue.</p>
            <p><strong className="text-blue-400">Amazon Prime:</strong> Strong in movies and documentaries with diverse catalog. Excellent content diversity.</p>
            <p><strong className="text-purple-400">Disney+:</strong> Excellence in family content and premium animated features. Highest user satisfaction and retention.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComparisonDashboard;
