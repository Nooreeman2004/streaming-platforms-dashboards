import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, LineChart, Line, AreaChart, Area, Legend } from 'recharts';
import { useState } from 'react';
import { ZoomIn, ZoomOut, Film, Tv, Filter } from 'lucide-react';

const NetflixDashboard = () => {
  const [zoom, setZoom] = useState(1);
  const [genreZoom, setGenreZoom] = useState(1);
  const [yearlyZoom, setYearlyZoom] = useState(1);
  const [ratingZoom, setRatingZoom] = useState(1);
  const [trendsZoom, setTrendsZoom] = useState(1);
  const [performanceZoom, setPerformanceZoom] = useState(1);
  const [budgetZoom, setBudgetZoom] = useState(1);
  const [durationZoom, setDurationZoom] = useState(1);

  // Filter states
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedShow, setSelectedShow] = useState<string>('none');

  // Sample Netflix shows data
  const netflixShows = [
    { id: '1', title: 'Stranger Things', type: 'TV Show', genre: 'Drama', year: 2016, rating: 'TV-14', imdbScore: 8.7, duration: '51 min', country: 'United States', dateAdded: 'July 15, 2016' },
    { id: '2', title: 'The Crown', type: 'TV Show', genre: 'Drama', year: 2016, rating: 'TV-MA', imdbScore: 8.6, duration: '58 min', country: 'United Kingdom', dateAdded: 'November 4, 2016' },
    { id: '3', title: 'Ozark', type: 'TV Show', genre: 'Drama', year: 2017, rating: 'TV-MA', imdbScore: 8.4, duration: '60 min', country: 'United States', dateAdded: 'July 21, 2017' },
    { id: '4', title: 'Money Heist', type: 'TV Show', genre: 'Action', year: 2017, rating: 'TV-MA', imdbScore: 8.2, duration: '70 min', country: 'Spain', dateAdded: 'December 20, 2017' },
    { id: '5', title: 'Bird Box', type: 'Movie', genre: 'Horror', year: 2018, rating: 'R', imdbScore: 6.6, duration: '124 min', country: 'United States', dateAdded: 'December 21, 2018' },
    { id: '6', title: 'Roma', type: 'Movie', genre: 'Drama', year: 2018, rating: 'R', imdbScore: 7.7, duration: '135 min', country: 'Mexico', dateAdded: 'December 14, 2018' },
    { id: '7', title: 'The Irishman', type: 'Movie', genre: 'Drama', year: 2019, rating: 'R', imdbScore: 7.8, duration: '209 min', country: 'United States', dateAdded: 'November 27, 2019' },
    { id: '8', title: 'Squid Game', type: 'TV Show', genre: 'Thriller', year: 2021, rating: 'TV-MA', imdbScore: 8.0, duration: '60 min', country: 'South Korea', dateAdded: 'September 17, 2021' }
  ];

  const genres = ['All', ...Array.from(new Set(netflixShows.map(show => show.genre)))];
  const years = ['All', ...Array.from(new Set(netflixShows.map(show => show.year.toString()))).sort().reverse()];
  const types = ['All', 'Movie', 'TV Show'];

  // Filter data based on selections
  const filteredShows = netflixShows.filter(show => {
    return (selectedGenre === 'All' || show.genre === selectedGenre) &&
           (selectedYear === 'All' || show.year.toString() === selectedYear) &&
           (selectedType === 'All' || show.type === selectedType);
  });

  const selectedShowData = selectedShow !== 'none' ? filteredShows.find(s => s.id === selectedShow) : null;

  const genreData = [
    { genre: 'Drama', count: 2567, percentage: 28 },
    { genre: 'Comedy', count: 1854, percentage: 20 },
    { genre: 'Action', count: 1456, percentage: 16 },
    { genre: 'Documentary', count: 987, percentage: 11 },
    { genre: 'Horror', count: 765, percentage: 8 },
    { genre: 'Romance', count: 654, percentage: 7 },
    { genre: 'Animation', count: 543, percentage: 6 },
    { genre: 'Thriller', count: 432, percentage: 4 }
  ];

  const yearlyReleases = [
    { year: 2019, Movies: 1200, 'TV Shows': 800, color: '#DC2626' },
    { year: 2020, Movies: 1450, 'TV Shows': 950, color: '#DC2626' },
    { year: 2021, Movies: 1600, 'TV Shows': 1100, color: '#DC2626' },
    { year: 2022, Movies: 1800, 'TV Shows': 1250, color: '#DC2626' },
    { year: 2023, Movies: 2000, 'TV Shows': 1400, color: '#DC2626' }
  ];

  const ratingDistribution = [
    { rating: 'G', count: 450, color: '#DC2626' },
    { rating: 'PG', count: 780, color: '#EF4444' },
    { rating: 'PG-13', count: 2100, color: '#F87171' },
    { rating: 'R', count: 1890, color: '#FCA5A5' },
    { rating: 'TV-MA', count: 3200, color: '#FECACA' },
    { rating: 'TV-14', count: 2800, color: '#FEE2E2' }
  ];

  const viewingTrendsData = [
    { month: 'Jan', Drama: 12000, Comedy: 8500, Action: 9800, Documentary: 4200 },
    { month: 'Feb', Drama: 13200, Comedy: 9100, Action: 10200, Documentary: 4800 },
    { month: 'Mar', Drama: 14500, Comedy: 9800, Action: 11500, Documentary: 5200 },
    { month: 'Apr', Drama: 15800, Comedy: 10500, Action: 12000, Documentary: 5800 },
    { month: 'May', Drama: 16200, Comedy: 11200, Action: 12800, Documentary: 6100 },
    { month: 'Jun', Drama: 17500, Comedy: 12000, Action: 13500, Documentary: 6500 }
  ];

  const contentPerformanceData = [
    { title: 'Stranger Things', views: 95, rating: 8.7, engagement: 92 },
    { title: 'The Crown', views: 78, rating: 8.6, engagement: 85 },
    { title: 'Ozark', views: 82, rating: 8.4, engagement: 88 },
    { title: 'Bridgerton', views: 89, rating: 7.3, engagement: 91 },
    { title: 'Money Heist', views: 91, rating: 8.2, engagement: 89 },
    { title: 'The Witcher', views: 85, rating: 8.2, engagement: 87 }
  ];

  const budgetVsRevenueData = [
    { genre: 'Drama', budget: 45, revenue: 78, roi: 173 },
    { genre: 'Action', budget: 85, revenue: 125, roi: 147 },
    { genre: 'Comedy', budget: 35, revenue: 65, roi: 186 },
    { genre: 'Sci-Fi', budget: 95, revenue: 140, roi: 147 },
    { genre: 'Horror', budget: 25, revenue: 55, roi: 220 },
    { genre: 'Romance', budget: 30, revenue: 52, roi: 173 }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-700 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
            N
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Netflix Analytics Dashboard</h2>
            <p className="text-gray-400">13,500+ titles across 190+ countries</p>
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

      {/* Search & Filter */}
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
              <Badge variant="secondary" className="bg-red-500/20 text-red-400">
                Netflix Original
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div>
                <span className="text-red-400 text-sm font-medium">Release Year</span>
                <p className="text-white font-semibold">{selectedShowData.year}</p>
              </div>
              <div>
                <span className="text-red-400 text-sm font-medium">Duration</span>
                <p className="text-white font-semibold">{selectedShowData.duration}</p>
              </div>
              <div>
                <span className="text-red-400 text-sm font-medium">Genre</span>
                <p className="text-white font-semibold">{selectedShowData.genre}</p>
              </div>
              <div>
                <span className="text-red-400 text-sm font-medium">Rating</span>
                <p className="text-white font-semibold">{selectedShowData.rating}</p>
              </div>
              <div>
                <span className="text-red-400 text-sm font-medium">Date Added</span>
                <p className="text-white font-semibold">{selectedShowData.dateAdded}</p>
              </div>
              <div>
                <span className="text-red-400 text-sm font-medium">IMDb Score</span>
                <p className="text-yellow-400 font-bold">{selectedShowData.imdbScore}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-red-600 to-red-700 border-0 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Total Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">13,500+</div>
            <div className="text-sm opacity-70">Movies & Series</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 text-white">
          <CardHeader className="pb-2 flex flex-row items-center space-y-0">
            <CardTitle className="text-sm font-medium opacity-90">Movies</CardTitle>
            <Film className="h-4 w-4 ml-auto opacity-70" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-400">9,200</div>
            <div className="text-sm opacity-70">68.1%</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 text-white">
          <CardHeader className="pb-2 flex flex-row items-center space-y-0">
            <CardTitle className="text-sm font-medium opacity-90">TV Shows</CardTitle>
            <Tv className="h-4 w-4 ml-auto opacity-70" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-400">4,300</div>
            <div className="text-sm opacity-70">31.9%</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Global Reach</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-400">190+</div>
            <div className="text-sm opacity-70">Countries</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid - Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Genre Distribution - Bar Chart for more than 5 categories */}
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
                <BarChart data={genreData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis type="number" stroke="#9CA3AF" />
                  <YAxis dataKey="genre" type="category" stroke="#9CA3AF" width={80} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }} 
                  />
                  <Bar dataKey="count" fill="#DC2626" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Yearly Releases - Area Chart instead of bar */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Yearly Content Releases</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setYearlyZoom(prev => Math.max(prev - 0.2, 0.5))} className="text-gray-300 border-gray-600">
                <ZoomOut className="h-3 w-3" />
              </Button>
              <span className="text-gray-300 text-xs">{Math.round(yearlyZoom * 100)}%</span>
              <Button variant="outline" size="sm" onClick={() => setYearlyZoom(prev => Math.min(prev + 0.2, 2))} className="text-gray-300 border-gray-600">
                <ZoomIn className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div style={{ transform: `scale(${yearlyZoom})`, transformOrigin: 'center' }}>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={yearlyReleases}>
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
                  <Area type="monotone" dataKey="Movies" stackId="1" stroke="#DC2626" fill="#DC2626" fillOpacity={0.8} />
                  <Area type="monotone" dataKey="TV Shows" stackId="1" stroke="#F472B6" fill="#F472B6" fillOpacity={0.8} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rating Distribution - Line Chart instead of bar */}
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
              <LineChart data={ratingDistribution}>
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
                <Line type="monotone" dataKey="count" stroke="#DC2626" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* New Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Viewing Trends by Genre */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Monthly Viewing Trends by Genre</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setTrendsZoom(prev => Math.max(prev - 0.2, 0.5))} className="text-gray-300 border-gray-600">
                <ZoomOut className="h-3 w-3" />
              </Button>
              <span className="text-gray-300 text-xs">{Math.round(trendsZoom * 100)}%</span>
              <Button variant="outline" size="sm" onClick={() => setTrendsZoom(prev => Math.min(prev + 0.2, 2))} className="text-gray-300 border-gray-600">
                <ZoomIn className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div style={{ transform: `scale(${trendsZoom})`, transformOrigin: 'center' }}>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={viewingTrendsData}>
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
                  <Area type="monotone" dataKey="Drama" stackId="1" stroke="#DC2626" fill="#DC2626" fillOpacity={0.8} />
                  <Area type="monotone" dataKey="Comedy" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.8} />
                  <Area type="monotone" dataKey="Action" stackId="1" stroke="#F87171" fill="#F87171" fillOpacity={0.8} />
                  <Area type="monotone" dataKey="Documentary" stackId="1" stroke="#FCA5A5" fill="#FCA5A5" fillOpacity={0.8} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Content Performance - Fixed with Line Chart */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Top Content Performance</CardTitle>
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
                <LineChart data={contentPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="title" stroke="#9CA3AF" angle={-45} textAnchor="end" height={80} />
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
                  <Line type="monotone" dataKey="views" stroke="#DC2626" strokeWidth={3} name="Views (M)" />
                  <Line type="monotone" dataKey="engagement" stroke="#F87171" strokeWidth={3} name="Engagement %" />
                  <Line type="monotone" dataKey="rating" stroke="#FCA5A5" strokeWidth={3} name="Rating" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget vs Revenue Analysis - Lighter color for revenue */}
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Budget vs Revenue Analysis by Genre</CardTitle>
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
              <BarChart data={budgetVsRevenueData}>
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
                <Bar dataKey="budget" fill="#DC2626" name="Budget ($M)" />
                <Bar dataKey="revenue" fill="#F87171" name="Revenue ($M)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

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
                { duration: '< 30 min', percentage: 10, count: 1350 },
                { duration: '30-60 min', percentage: 70, count: 9450 },
                { duration: '60-90 min', percentage: 15, count: 2025 },
                { duration: '> 90 min', percentage: 5, count: 675 }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-300">{item.duration}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-white text-sm w-12">{item.percentage}%</span>
                    <span className="text-gray-400 text-sm w-16">({item.count})</span>
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
          <CardTitle className="text-white">About Netflix Originals</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300 text-sm space-y-2">
          <p>"Stranger Things" revolutionized Netflix's original content strategy, becoming a global phenomenon with its nostalgic 80s setting and supernatural storyline.</p>
          <p>"The Crown" showcases Netflix's commitment to high-quality historical dramas, earning critical acclaim and multiple awards for its portrayal of the British Royal Family.</p>
          <p>"Squid Game" became Netflix's most-watched series, demonstrating the platform's global reach and the power of international content.</p>
          <Badge variant="secondary" className="mt-2 bg-red-500/20 text-red-400">Netflix Originals</Badge>
        </CardContent>
      </Card>
    </div>
  );
};

export default NetflixDashboard;
