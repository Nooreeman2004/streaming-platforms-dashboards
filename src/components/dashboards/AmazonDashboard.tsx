import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { useState } from 'react';
import { Film, Tv, ZoomIn, ZoomOut, Filter, Play } from 'lucide-react';

const AmazonDashboard = () => {
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedShow, setSelectedShow] = useState<string>('none');
  
  // Individual zoom states for each chart
  const [genreZoom, setGenreZoom] = useState(1);
  const [yearlyZoom, setYearlyZoom] = useState(1);
  const [ratingZoom, setRatingZoom] = useState(1);
  const [regionZoom, setRegionZoom] = useState(1);
  const [durationZoom, setDurationZoom] = useState(1);
  const [qualityZoom, setQualityZoom] = useState(1);
  const [seasonalZoom, setSeasonalZoom] = useState(1);

  // Amazon Prime shows data
  const amazonShows = [
    { id: '1', title: 'The Boys', type: 'TV Show', genre: 'Action', year: 2019, rating: 'TV-MA', imdbScore: 8.7, duration: '60 min', country: 'United States', dateAdded: 'July 26, 2019' },
    { id: '2', title: 'The Marvelous Mrs. Maisel', type: 'TV Show', genre: 'Comedy', year: 2017, rating: 'TV-14', imdbScore: 8.7, duration: '47 min', country: 'United States', dateAdded: 'March 17, 2017' },
    { id: '3', title: 'Jack Ryan', type: 'TV Show', genre: 'Action', year: 2018, rating: 'TV-14', imdbScore: 8.0, duration: '51 min', country: 'United States', dateAdded: 'August 31, 2018' },
    { id: '4', title: 'The Expanse', type: 'TV Show', genre: 'Sci-Fi', year: 2015, rating: 'TV-14', imdbScore: 8.5, duration: '43 min', country: 'United States', dateAdded: 'December 14, 2015' },
    { id: '5', title: 'Borat Subsequent Moviefilm', type: 'Movie', genre: 'Comedy', year: 2020, rating: 'R', imdbScore: 6.6, duration: '95 min', country: 'United States', dateAdded: 'October 23, 2020' },
    { id: '6', title: 'Sound of Metal', type: 'Movie', genre: 'Drama', year: 2019, rating: 'R', imdbScore: 7.7, duration: '120 min', country: 'United States', dateAdded: 'December 4, 2020' },
    { id: '7', title: 'The Tomorrow War', type: 'Movie', genre: 'Action', year: 2021, rating: 'PG-13', imdbScore: 6.5, duration: '138 min', country: 'United States', dateAdded: 'July 2, 2021' },
    { id: '8', title: 'Invincible', type: 'TV Show', genre: 'Animation', year: 2021, rating: 'TV-MA', imdbScore: 8.7, duration: '47 min', country: 'United States', dateAdded: 'March 25, 2021' },
    { id: '9', title: 'Upload', type: 'TV Show', genre: 'Comedy', year: 2020, rating: 'TV-14', imdbScore: 7.9, duration: '30 min', country: 'United States', dateAdded: 'May 1, 2020' },
    { id: '10', title: 'The Wheel of Time', type: 'TV Show', genre: 'Fantasy', year: 2021, rating: 'TV-14', imdbScore: 7.1, duration: '60 min', country: 'United States', dateAdded: 'November 19, 2021' }
  ];

  // Filter data based on selections
  const filteredShows = amazonShows.filter(show => {
    return (selectedGenre === 'All' || show.genre === selectedGenre) &&
           (selectedYear === 'All' || show.year.toString() === selectedYear) &&
           (selectedType === 'All' || show.type === selectedType);
  });

  const selectedShowData = selectedShow !== 'none' ? filteredShows.find(s => s.id === selectedShow) : null;

  // KPI data
  const kpiData = {
    totalShows: filteredShows.length,
    movies: filteredShows.filter(show => show.type === 'Movie').length,
    series: filteredShows.filter(show => show.type === 'TV Show').length,
    avgRating: filteredShows.length > 0 ? (filteredShows.reduce((sum, show) => sum + show.imdbScore, 0) / filteredShows.length).toFixed(2) : '0'
  };

  // Genre distribution data
  const genreStats = filteredShows.reduce((acc: Record<string, number>, show) => {
    acc[show.genre] = (acc[show.genre] || 0) + 1;
    return acc;
  }, {});

  // Yearly release data
  const yearlyStats = filteredShows.reduce((acc: Record<number, { year: number; movies: number; series: number }>, show) => {
    const year = show.year;
    if (!acc[year]) acc[year] = { year, movies: 0, series: 0 };
    if (show.type === 'Movie') acc[year].movies++;
    else acc[year].series++;
    return acc;
  }, {});

  const yearlyData = Object.values(yearlyStats).sort((a, b) => a.year - b.year);

  // View rating data
  const ratingStats = filteredShows.reduce((acc: Record<string, number>, show) => {
    acc[show.rating] = (acc[show.rating] || 0) + 1;
    return acc;
  }, {});

  // Region data - Custom visualization
  const regionStats = filteredShows.reduce((acc: Record<string, number>, show) => {
    acc[show.country] = (acc[show.country] || 0) + 1;
    return acc;
  }, {});

  const regionData = Object.entries(regionStats).map(([country, count]) => ({
    name: country,
    value: count,
    year: 2021
  }));

  // Area chart data for content over time
  const areaData = [
    { year: '2015', movies: 0, series: 1, total: 1 },
    { year: '2017', movies: 0, series: 2, total: 2 },
    { year: '2018', movies: 0, series: 3, total: 3 },
    { year: '2019', movies: 1, series: 4, total: 5 },
    { year: '2020', movies: 2, series: 6, total: 8 },
    { year: '2021', movies: 3, series: 7, total: 10 }
  ];

  const genres = ['All', ...Array.from(new Set(amazonShows.map(show => show.genre)))];
  const years = ['All', ...Array.from(new Set(amazonShows.map(show => show.year.toString()))).sort().reverse()];
  const types = ['All', 'Movie', 'TV Show'];

  // Updated chart data with blue colors
  const genreData = [
    { genre: 'Action', count: 1654, percentage: 22, color: '#2563EB' },
    { genre: 'Drama', count: 1434, percentage: 19, color: '#3B82F6' },
    { genre: 'Comedy', count: 1256, percentage: 17, color: '#60A5FA' },
    { genre: 'Documentary', count: 1287, percentage: 17, color: '#93C5FD' },
    { genre: 'Thriller', count: 876, percentage: 12, color: '#BFDBFE' },
    { genre: 'Horror', count: 567, percentage: 8, color: '#DBEAFE' },
    { genre: 'Romance', count: 454, percentage: 6, color: '#EFF6FF' }
  ];

  const ratingDistribution = [
    { rating: 'G', count: 380, color: '#1E40AF' },
    { rating: 'PG', count: 620, color: '#2563EB' },
    { rating: 'PG-13', count: 1890, color: '#3B82F6' },
    { rating: 'R', count: 1654, color: '#60A5FA' },
    { rating: 'TV-MA', count: 2800, color: '#93C5FD' },
    { rating: 'TV-14', count: 2340, color: '#BFDBFE' }
  ];

  // New charts data
  const contentQualityData = [
    { genre: 'Drama', avgRating: 8.2, criticScore: 85, audienceScore: 78, viewerHours: 45000 },
    { genre: 'Action', avgRating: 7.8, criticScore: 76, audienceScore: 84, viewerHours: 52000 },
    { genre: 'Comedy', avgRating: 7.5, criticScore: 72, audienceScore: 81, viewerHours: 38000 },
    { genre: 'Sci-Fi', avgRating: 8.1, criticScore: 82, audienceScore: 86, viewerHours: 41000 },
    { genre: 'Fantasy', avgRating: 7.9, criticScore: 79, audienceScore: 82, viewerHours: 39000 }
  ];

  const seasonalTrendsData = [
    { month: 'Jan', drama: 12000, action: 15000, comedy: 9000, scifi: 8500 },
    { month: 'Feb', drama: 11500, action: 14200, comedy: 8800, scifi: 8200 },
    { month: 'Mar', drama: 13000, action: 16500, comedy: 10200, scifi: 9100 },
    { month: 'Apr', drama: 14500, action: 17800, comedy: 11000, scifi: 9800 },
    { month: 'May', drama: 15200, action: 18500, comedy: 11800, scifi: 10200 },
    { month: 'Jun', drama: 16000, action: 19200, comedy: 12500, scifi: 10800 }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
            P
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Amazon Prime Video Analytics</h2>
            <p className="text-gray-400">9,684+ titles across 240+ countries</p>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Search & Filter</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-gray-300 text-sm mb-2 block">Content Type</label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {types.map(type => (
                    <SelectItem key={type} value={type} className="text-white hover:bg-gray-600">{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-gray-300 text-sm mb-2 block">Genre</label>
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {genres.map(genre => (
                    <SelectItem key={genre} value={genre} className="text-white hover:bg-gray-600">{genre}</SelectItem>
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
            
            <div>
              <label className="text-gray-300 text-sm mb-2 block">Specific Show/Movie</label>
              <Select value={selectedShow} onValueChange={setSelectedShow}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select show/movie" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="none" className="text-white hover:bg-gray-600">All Shows</SelectItem>
                  {filteredShows.map(show => (
                    <SelectItem key={show.id} value={show.id} className="text-white hover:bg-gray-600">{show.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Show Details */}
      {selectedShowData && (
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>{selectedShowData.title}</span>
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                Prime Original
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div>
                <span className="text-blue-400 text-sm font-medium">Release Year</span>
                <p className="text-white font-semibold">{selectedShowData.year}</p>
              </div>
              <div>
                <span className="text-blue-400 text-sm font-medium">Duration</span>
                <p className="text-white font-semibold">{selectedShowData.duration}</p>
              </div>
              <div>
                <span className="text-blue-400 text-sm font-medium">Genre</span>
                <p className="text-white font-semibold">{selectedShowData.genre}</p>
              </div>
              <div>
                <span className="text-blue-400 text-sm font-medium">Rating</span>
                <p className="text-white font-semibold">{selectedShowData.rating}</p>
              </div>
              <div>
                <span className="text-blue-400 text-sm font-medium">Date Added</span>
                <p className="text-white font-semibold">{selectedShowData.dateAdded}</p>
              </div>
              <div>
                <span className="text-blue-400 text-sm font-medium">IMDb Score</span>
                <p className="text-yellow-400 font-bold">{selectedShowData.imdbScore}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-0 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Total Shows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{kpiData.totalShows.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 text-white">
          <CardHeader className="pb-2 flex flex-row items-center space-y-0">
            <CardTitle className="text-sm font-medium opacity-90">Movies</CardTitle>
            <Film className="h-4 w-4 ml-auto opacity-70" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-400">{kpiData.movies}</div>
            <div className="text-sm opacity-70">{kpiData.totalShows > 0 ? Math.round((kpiData.movies / kpiData.totalShows) * 100) : 0}%</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 text-white">
          <CardHeader className="pb-2 flex flex-row items-center space-y-0">
            <CardTitle className="text-sm font-medium opacity-90">Series</CardTitle>
            <Tv className="h-4 w-4 ml-auto opacity-70" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-400">{kpiData.series}</div>
            <div className="text-sm opacity-70">{kpiData.totalShows > 0 ? Math.round((kpiData.series / kpiData.totalShows) * 100) : 0}%</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">IMDb Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-400">{kpiData.avgRating}</div>
            <div className="text-sm opacity-70">Average Rating</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Genre Distribution - Donut Chart */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Content by Genre</CardTitle>
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
                <PieChart>
                  <Pie
                    data={genreData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={0}
                    dataKey="count"
                  >
                    {genreData.map((entry, index) => (
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
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
              {genreData.map((genre, index) => (
                <div key={genre.genre} className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: genre.color }}></div>
                  <span className="text-gray-300">{genre.genre}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Rating Distribution */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">View Ratings Distribution</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setRatingZoom(prev => Math.max(prev - 0.2, 0.5))} className="text-gray-300 border-gray-600">
                <ZoomOut className="h-3 w-3" />
              </Button>
              <span className="text-gray-300 text-xs">{Math.round(ratingZoom * 100)}%</span>
              <Button variant="outline" size="sm" onClick={() => setRatingZoom(prev => Math.min(prev + 0.2, 2))} className="text-gray-300 border-gray-600">
                <ZoomIn className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div style={{ transform: `scale(${ratingZoom})`, transformOrigin: 'center' }}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ratingDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="rating" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }} 
                  />
                  <Bar dataKey="count" fill="#2563EB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Area Chart Only - Content by Region Removed */}
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Content Growth Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={areaData}>
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
              <Area 
                type="monotone" 
                dataKey="total" 
                stackId="1" 
                stroke="#2563EB" 
                fill="#2563EB" 
                fillOpacity={0.6}
                name="Total Content"
              />
              <Area 
                type="monotone" 
                dataKey="series" 
                stackId="2" 
                stroke="#3B82F6" 
                fill="#3B82F6" 
                fillOpacity={0.6}
                name="TV Shows"
              />
              <Area 
                type="monotone" 
                dataKey="movies" 
                stackId="3" 
                stroke="#60A5FA" 
                fill="#60A5FA" 
                fillOpacity={0.6}
                name="Movies"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* New Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Quality Analysis - Radar Chart */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Content Quality by Genre</CardTitle>
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
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={contentQualityData}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis dataKey="genre" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                  <PolarRadiusAxis tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                  <Radar
                    name="Average Rating"
                    dataKey="avgRating"
                    stroke="#2563EB"
                    fill="#2563EB"
                    fillOpacity={0.6}
                    strokeWidth={2}
                  />
                  <Radar
                    name="Critic Score"
                    dataKey="criticScore"
                    stroke="#60A5FA"
                    fill="#60A5FA"
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

        {/* Seasonal Trends */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Seasonal Viewing Trends</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setSeasonalZoom(prev => Math.max(prev - 0.2, 0.5))} className="text-gray-300 border-gray-600">
                <ZoomOut className="h-3 w-3" />
              </Button>
              <span className="text-gray-300 text-xs">{Math.round(seasonalZoom * 100)}%</span>
              <Button variant="outline" size="sm" onClick={() => setSeasonalZoom(prev => Math.min(prev + 0.2, 2))} className="text-gray-300 border-gray-600">
                <ZoomIn className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div style={{ transform: `scale(${seasonalZoom})`, transformOrigin: 'center' }}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={seasonalTrendsData}>
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
                  <Legend />
                  <Line type="monotone" dataKey="drama" stroke="#2563EB" strokeWidth={2} name="Drama" />
                  <Line type="monotone" dataKey="action" stroke="#3B82F6" strokeWidth={2} name="Action" />
                  <Line type="monotone" dataKey="comedy" stroke="#60A5FA" strokeWidth={2} name="Comedy" />
                  <Line type="monotone" dataKey="scifi" stroke="#93C5FD" strokeWidth={2} name="Sci-Fi" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Show Duration Distribution */}
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Show Duration Distribution</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => setDurationZoom(prev => Math.max(prev - 0.2, 0.5))} className="text-gray-300 border-gray-600">
              <ZoomOut className="h-3 w-3" />
            </Button>
            <span className="text-gray-300 text-xs">{Math.round(durationZoom * 100)}%</span>
            <Button variant="outline" size="sm" onClick={() => setDurationZoom(prev => Math.min(prev + 0.2, 2))} className="text-gray-300 border-gray-600">
              <ZoomIn className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div style={{ transform: `scale(${durationZoom})`, transformOrigin: 'center' }}>
            <div className="space-y-4">
              {[
                { duration: '< 30 min', percentage: 10, count: Math.floor(kpiData.totalShows * 0.1) },
                { duration: '30-60 min', percentage: 70, count: Math.floor(kpiData.totalShows * 0.7) },
                { duration: '60-90 min', percentage: 15, count: Math.floor(kpiData.totalShows * 0.15) },
                { duration: '> 90 min', percentage: 5, count: Math.floor(kpiData.totalShows * 0.05) }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-300">{item.duration}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-white text-sm w-12">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About Shows */}
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">About Amazon Prime Originals</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300 text-sm space-y-2">
          <p>"The Boys" offers a dark and satirical take on the superhero genre, featuring complex characters and social commentary.</p>
          <p>"The Marvelous Mrs. Maisel" showcases brilliant writing and performances in this period comedy-drama series.</p>
          <p>"Jack Ryan" brings Tom Clancy's beloved character to life with intense action and political intrigue.</p>
          <Badge variant="secondary" className="mt-2 bg-blue-500/20 text-blue-400">Prime Originals</Badge>
        </CardContent>
      </Card>
    </div>
  );
};

export default AmazonDashboard;
