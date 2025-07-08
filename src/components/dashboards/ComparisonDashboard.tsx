import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, ScatterChart, Scatter, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, AreaChart, Area, ComposedChart } from 'recharts';
import { useState, useEffect } from 'react';
import { ZoomIn, ZoomOut, TrendingUp, Target, Users, Award, Filter, Globe, DollarSign, Clock, Star } from 'lucide-react';
import Papa from 'papaparse';

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
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  const [selectedContentType, setSelectedContentType] = useState('all');

  // Dynamic data states
  const [platformData, setPlatformData] = useState([]);
  const [genreComparison, setGenreComparison] = useState([]);
  const [marketShare, setMarketShare] = useState([]);
  const [yearlyGrowth, setYearlyGrowth] = useState([]);
  const [contentQuality, setContentQuality] = useState([]);
  const [userEngagement, setUserEngagement] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [demographicsData, setDemographicsData] = useState([]);
  const [platformRatingsByCountry, setPlatformRatingsByCountry] = useState([]);
  const [contentProductionCost, setContentProductionCost] = useState([]);
  const [contentReleaseSchedule, setContentReleaseSchedule] = useState([]);
  const [avgWatchTimeByGenre, setAvgWatchTimeByGenre] = useState([]);

  // Fetch and process CSV data
  useEffect(() => {
    fetch('/data/streamingdata.csv')
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: ({ data }) => {
            // Process data
            const platforms = ['Netflix', 'Amazon Prime', 'Disney+'];
            const colors = { Netflix: '#DC2626', 'Amazon Prime': '#2563EB', 'Disney+': '#8B5CF6' };

            // platformData
            const aggregatedPlatformData = platforms.map(platform => {
              const platformRows = data.filter(row => row.platform === platform);
              const avg = (key) => {
                const values = platformRows.map(row => parseFloat(row[key])).filter(v => !isNaN(v));
                return values.length ? (values.reduce((sum, v) => sum + v, 0) / values.length).toFixed(2) : 0;
              };
              return {
                platform,
                totalShows: parseInt(avg('totalShows')),
                movies: parseInt(avg('movies')),
                series: parseInt(avg('series')),
                subscribers: parseFloat(avg('subscribers_mil')),
                revenue: parseFloat(avg('revenue_bil')),
                color: colors[platform],
              };
            });
            setPlatformData(aggregatedPlatformData);

            // genreComparison
            const genres = [...new Set(data.map(row => row.genre))];
            const genreData = genres.map(genre => ({
              genre,
              Netflix: parseInt(data.find(row => row.platform === 'Netflix' && row.genre === genre)?.genre_count || 0),
              Amazon: parseInt(data.find(row => row.platform === 'Amazon Prime' && row.genre === genre)?.genre_count || 0),
              Disney: parseInt(data.find(row => row.platform === 'Disney+' && row.genre === genre)?.genre_count || 0),
            }));
            setGenreComparison(genreData);

            // marketShare
            const marketShareData = platforms.map(platform => {
              const platformRows = data.filter(row => row.platform === platform);
              const avgMarketShare = platformRows.map(row => parseFloat(row.market_share_pct)).filter(v => !isNaN(v)).reduce((sum, v) => sum + v, 0) / platformRows.length;
              return { name: platform, value: parseFloat(avgMarketShare.toFixed(2)), color: colors[platform] };
            });
            const totalMarketShare = marketShareData.reduce((sum, d) => sum + d.value, 0);
            const normalizedMarketShare = marketShareData.map(d => ({
              ...d,
              value: parseFloat(((d.value / totalMarketShare) * 100).toFixed(2)),
            }));
            setMarketShare(normalizedMarketShare);

            // yearlyGrowth (assuming 2023 for yearly_growth_count)
            const yearlyGrowthData = [
              { year: 2019, Netflix: 8500, Amazon: 6500, Disney: 500 },
              { year: 2020, Netflix: 11000, Amazon: 8000, Disney: 900 },
              { year: 2021, Netflix: 13500, Amazon: 9684, Disney: 1450 },
              { year: 2022, Netflix: 15000, Amazon: 11000, Disney: 1800 },
              {
                year: 2023,
                Netflix: parseInt(data.filter(row => row.platform === 'Netflix').reduce((sum, row) => sum + parseFloat(row.yearly_growth_count || 0), 0) / data.filter(row => row.platform === 'Netflix').length),
                Amazon: parseInt(data.filter(row => row.platform === 'Amazon Prime').reduce((sum, row) => sum + parseFloat(row.yearly_growth_count || 0), 0) / data.filter(row => row.platform === 'Amazon Prime').length),
                Disney: parseInt(data.filter(row => row.platform === 'Disney+').reduce((sum, row) => sum + parseFloat(row.yearly_growth_count || 0), 0) / data.filter(row => row.platform === 'Disney+').length),
              },
            ];
            setYearlyGrowth(yearlyGrowthData);

            // contentQuality
            const contentQualityData = platforms.map(platform => {
              const platformRows = data.filter(row => row.platform === platform);
              const avg = (key) => {
                const values = platformRows.map(row => parseFloat(row[key])).filter(v => !isNaN(v));
                return values.length ? (values.reduce((sum, v) => sum + v, 0) / values.length).toFixed(2) : 0;
              };
              return {
                platform,
                originalContent: parseFloat(avg('originalContent_pct')),
                userRating: parseFloat(avg('userRating')),
                criticalAcclaim: parseFloat(avg('criticalAcclaim_pct')),
                globalReach: parseFloat(avg('globalReach_pct')),
                contentDiversity: parseFloat(avg('contentDiversity_pct')),
              };
            });
            setContentQuality(contentQualityData);

            // userEngagement
            const userEngagementData = platforms.map(platform => {
              const platformRows = data.filter(row => row.platform === platform);
              const avg = (key) => {
                const values = platformRows.map(row => parseFloat(row[key])).filter(v => !isNaN(v));
                return values.length ? (values.reduce((sum, v) => sum + v, 0) / values.length).toFixed(2) : 0;
              };
              return {
                platform,
                dailyActiveUsers: parseFloat(avg('dailyActiveUsers_mil')),
                avgWatchTime: parseFloat(avg('avgWatchTime_hrs')),
                retention: parseFloat(avg('retention_pct')),
                satisfaction: parseFloat(avg('satisfaction_rating')),
              };
            });
            setUserEngagement(userEngagementData);

            // revenueData (assuming 2023 for revenue_bil)
            const revenueData = [
              { year: 2019, Netflix: 20.2, Amazon: 14.5, Disney: 0 },
              { year: 2020, Netflix: 25.0, Amazon: 19.2, Disney: 2.8 },
              { year: 2021, Netflix: 29.7, Amazon: 22.1, Disney: 5.5 },
              { year: 2022, Netflix: 31.6, Amazon: 25.0, Disney: 7.4 },
              {
                year: 2023,
                Netflix: parseFloat(data.filter(row => row.platform === 'Netflix').reduce((sum, row) => sum + parseFloat(row.revenue_bil || 0), 0) / data.filter(row => row.platform === 'Netflix').length).toFixed(2),
                Amazon: parseFloat(data.filter(row => row.platform === 'Amazon Prime').reduce((sum, row) => sum + parseFloat(row.revenue_bil || 0), 0) / data.filter(row => row.platform === 'Amazon Prime').length).toFixed(2),
                Disney: parseFloat(data.filter(row => row.platform === 'Disney+').reduce((sum, row) => sum + parseFloat(row.revenue_bil || 0), 0) / data.filter(row => row.platform === 'Disney+').length).toFixed(2),
              },
            ];
            setRevenueData(revenueData);

            // demographicsData
            const ageGroups = [...new Set(data.map(row => row.ageGroup))];
            const demographicsData = ageGroups.map(ageGroup => ({
              ageGroup,
              Netflix: parseFloat(data.find(row => row.platform === 'Netflix' && row.ageGroup === ageGroup)?.ageGroup_pct || 0),
              Amazon: parseFloat(data.find(row => row.platform === 'Amazon Prime' && row.ageGroup === ageGroup)?.ageGroup_pct || 0),
              Disney: parseFloat(data.find(row => row.platform === 'Disney+' && row.ageGroup === ageGroup)?.ageGroup_pct || 0),
            }));
            setDemographicsData(demographicsData);

            // platformRatingsByCountry
            const countries = [...new Set(data.map(row => row.country))];
            const ratingsByCountry = countries.map(country => ({
              country,
              Netflix: parseFloat(data.find(row => row.platform === 'Netflix' && row.country === country)?.country_rating || 0),
              Amazon: parseFloat(data.find(row => row.platform === 'Amazon Prime' && row.country === country)?.country_rating || 0),
              Disney: parseFloat(data.find(row => row.platform === 'Disney+' && row.country === country)?.country_rating || 0),
              subscribers: parseInt(data.find(row => row.country === country)?.country_subscribers || 0),
            }));
            setPlatformRatingsByCountry(ratingsByCountry);

            // contentProductionCost
            const productionCostData = platforms.map(platform => {
              const platformRows = data.filter(row => row.platform === platform);
              const avg = (key) => {
                const values = platformRows.map(row => parseFloat(row[key])).filter(v => !isNaN(v));
                return values.length ? (values.reduce((sum, v) => sum + v, 0) / values.length).toFixed(2) : 0;
              };
              return {
                platform,
                avgBudget: parseFloat(avg('avgBudget_mil')),
                originalBudget: parseFloat(avg('originalBudget_mil')),
                totalSpend: parseFloat(avg('totalSpend_bil')),
              };
            });
            setContentProductionCost(productionCostData);

            // contentReleaseSchedule
            const months = [...new Set(data.map(row => row.month))];
            const releaseSchedule = months.map(month => ({
              month,
              Netflix: parseInt(data.find(row => row.platform === 'Netflix' && row.month === month)?.monthly_releases || 0),
              Amazon: parseInt(data.find(row => row.platform === 'Amazon Prime' && row.month === month)?.monthly_releases || 0),
              Disney: parseInt(data.find(row => row.platform === 'Disney+' && row.month === month)?.monthly_releases || 0),
            }));
            setContentReleaseSchedule(releaseSchedule);

            // avgWatchTimeByGenre
            const watchTimeByGenre = genres.map(genre => ({
              genre,
              Netflix: parseFloat(data.find(row => row.platform === 'Netflix' && row.genre === genre)?.avgWatchTimeByGenre_mins || 0),
              Amazon: parseFloat(data.find(row => row.platform === 'Amazon Prime' && row.genre === genre)?.avgWatchTimeByGenre_mins || 0),
              Disney: parseFloat(data.find(row => row.platform === 'Disney+' && row.genre === genre)?.avgWatchTimeByGenre_mins || 0),
            }));
            setAvgWatchTimeByGenre(watchTimeByGenre);
          },
          error: (error) => {
            console.error('Error parsing CSV:', error);
          },
        });
      })
      .catch(error => {
        console.error('Error fetching CSV:', error);
      });
  }, []);

  // Filter data based on selections
  const getFilteredData = () => {
    let filteredGenreData = genreComparison;
    if (selectedGenre !== 'all') {
      filteredGenreData = genreComparison.filter(item => item.genre.toLowerCase() === selectedGenre);
    }
    return filteredGenreData;
  };

  // Rest of the JSX remains the same, using the dynamic state variables
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

      {/* Enhanced Filters */}
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Advanced Filters & Analytics Controls</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Genre Filter</label>
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="All Genres" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="all">All Genres</SelectItem>
                  {[...new Set(genreComparison.map(item => item.genre))].map(genre => (
                    <SelectItem key={genre} value={genre.toLowerCase()}>{genre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Other filter controls remain the same */}
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
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Region</label>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="All Regions" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="north-america">North America</SelectItem>
                  <SelectItem value="europe">Europe</SelectItem>
                  <SelectItem value="asia">Asia</SelectItem>
                  <SelectItem value="latin-america">Latin America</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Content Rating</label>
              <Select value={selectedRating} onValueChange={setSelectedRating}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="All Ratings" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="g">G</SelectItem>
                  <SelectItem value="pg">PG</SelectItem>
                  <SelectItem value="pg-13">PG-13</SelectItem>
                  <SelectItem value="r">R</SelectItem>
                  <SelectItem value="tv-ma">TV-MA</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Content Type</label>
              <Select value={selectedContentType} onValueChange={setSelectedContentType}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="movies">Movies Only</SelectItem>
                  <SelectItem value="series">Series Only</SelectItem>
                  <SelectItem value="originals">Originals Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <Button 
              onClick={() => {
                setSelectedGenre('all');
                setSelectedYear('all');
                setSelectedMetric('content');
                setSelectedRegion('all');
                setSelectedRating('all');
                setSelectedContentType('all');
              }}
              className="bg-gradient-to-r from-red-500 via-blue-500 to-purple-500 text-white"
            >
              Reset All Filters
            </Button>
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
        {/* Market Share */}
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
                  <Area type="monotone" dataKey="Netflix" stackId="1" stroke="#DC2626" fill="#DC2626" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="Amazon" stackId="1" stroke="#2563EB" fill="#2563EB" fillOpacity={0.6} />
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
              <BarChart data={platformRatingsByCountry} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                <Bar dataKey="Netflix" fill="#DC2626" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Amazon" fill="#2563EB" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Disney" fill="#8B5CF6" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-600"></div>
              <span className="text-gray-300 text-sm">Netflix Rating</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-blue-600"></div>
              <span className="text-gray-300 text-sm">Amazon Rating</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span className="text-gray-300 text-sm">Disney+ Rating</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Production Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Production Budget */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>Content Production Budget (Billions $)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={contentProductionCost}>
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
                <Bar dataKey="avgBudget" fill="#4B5563" name="Avg Budget" />
                <Bar dataKey="originalBudget" fill="#6B7280" name="Original Content" />
                <Bar dataKey="totalSpend" fill="#9CA3AF" name="Total Annual Spend" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Release Schedule */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Monthly Content Release Pattern</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={contentReleaseSchedule}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Line type="monotone" dataKey="Netflix" stroke="#DC2626" strokeWidth={3} />
                <Line type="monotone" dataKey="Amazon" stroke="#2563EB" strokeWidth={3} />
                <Line type="monotone" dataKey="Disney" stroke="#8B5CF6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Average Watch Time by Genre */}
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Star className="h-5 w-5" />
            <span>Average Watch Time by Genre (minutes)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={avgWatchTimeByGenre}>
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
              <Bar dataKey="Netflix" fill="#DC2626" />
              <Bar dataKey="Amazon" fill="#2563EB" />
              <Bar dataKey="Disney" fill="#8B5CF6" />
              <Line type="monotone" dataKey="Netflix" stroke="#EF4444" strokeWidth={2} />
              <Line type="monotone" dataKey="Amazon" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="Disney" stroke="#A855F7" strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Revenue and Demographics */}
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
                  <Line type="monotone" dataKey="Netflix" stroke="#DC2626" strokeWidth={3} />
                  <Line type="monotone" dataKey="Amazon" stroke="#2563EB" strokeWidth={3} />
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
                  <Bar dataKey="Netflix" fill="#DC2626" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="Amazon" fill="#2563EB" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="Disney" fill="#8B5CF6" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Genre Comparison */}
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
                <Bar dataKey="Netflix" fill="#DC2626" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Amazon" fill="#2563EB" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Disney" fill="#8B5CF6" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-600"></div>
              <span className="text-gray-300 text-sm">Netflix</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-blue-600"></div>
              <span className="text-gray-300 text-sm">Amazon Prime</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span className="text-gray-300 text-sm">Disney+</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Quality and Engagement */}
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
                <RadarChart data={contentQuality.map(item => ({
                  metric: 'Original Content', Netflix: contentQuality.find(p => p.platform === 'Netflix')?.originalContent || 0, Amazon: contentQuality.find(p => p.platform === 'Amazon Prime')?.originalContent || 0, Disney: contentQuality.find(p => p.platform === 'Disney+')?.originalContent || 0
                })).concat(
                  contentQuality.map(item => ({
                    metric: 'User Rating', Netflix: contentQuality.find(p => p.platform === 'Netflix')?.userRating || 0, Amazon: contentQuality.find(p => p.platform === 'Amazon Prime')?.userRating || 0, Disney: contentQuality.find(p => p.platform === 'Disney+')?.userRating || 0
                  }),
                  contentQuality.map(item => ({
                    metric: 'Critical Acclaim', Netflix: contentQuality.find(p => p.platform === 'Netflix')?.criticalAcclaim || 0, Amazon: contentQuality.find(p => p.platform === 'Amazon Prime')?.criticalAcclaim || 0, Disney: contentQuality.find(p => p.platform === 'Disney+')?.criticalAcclaim || 0
                  }),
                  contentQuality.map(item => ({
                    metric: 'Global Reach', Netflix: contentQuality.find(p => p.platform === 'Netflix')?.globalReach || 0, Amazon: contentQuality.find(p => p.platform === 'Amazon Prime')?.globalReach || 0, Disney: contentQuality.find(p => p.platform === 'Disney+')?.globalReach || 0
                  }),
                  contentQuality.map(item => ({
                    metric: 'Content Diversity', Netflix: contentQuality.find(p => p.platform === 'Netflix')?.contentDiversity || 0, Amazon: contentQuality.find(p => p.platform === 'Amazon Prime')?.contentDiversity || 0, Disney: contentQuality.find(p => p.platform === 'Disney+')?.contentDiversity || 0
                  }))
                )}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                  <PolarRadiusAxis angle={0} domain={[0, 100]} tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                  <Radar name="Netflix" dataKey="Netflix" stroke="#DC2626" fill="#DC2626" fillOpacity={0.2} />
                  <Radar name="Amazon" dataKey="Amazon" stroke="#2563EB" fill="#2563EB" fillOpacity={0.2} />
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
                  {userEngagement.map((entry, index) => (
                    <Scatter key={index} name={entry.platform} data={[{
                      dailyActiveUsers: entry.dailyActiveUsers,
                      satisfaction: entry.satisfaction,
                      platform: entry.platform,
                    }]} fill={colors[entry.platform]} />
                  ))}
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