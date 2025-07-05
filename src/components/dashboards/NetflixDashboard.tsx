
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useState } from 'react';
import { Film, Tv, ZoomIn, ZoomOut, Filter } from 'lucide-react';

const NetflixDashboard = () => {
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedShow, setSelectedShow] = useState<string>('none');
  
  // Individual zoom states for each chart
  const [genreZoom, setGenreZoom] = useState(1);
  const [yearlyZoom, setYearlyZoom] = useState(1);
  const [ratingZoom, setRatingZoom] = useState(1);
  const [durationZoom, setDurationZoom] = useState(1);

  // Netflix shows data
  const netflixShows = [
    { id: '1', title: 'Stranger Things', type: 'TV Show', genre: 'Horror', year: 2016, rating: 'TV-14', imdbScore: 8.7 },
    { id: '2', title: 'The Crown', type: 'TV Show', genre: 'Drama', year: 2016, rating: 'TV-MA', imdbScore: 8.7 },
    { id: '3', title: 'Red Notice', type: 'Movie', genre: 'Action', year: 2021, rating: 'PG-13', imdbScore: 6.4 },
    { id: '4', title: 'Squid Game', type: 'TV Show', genre: 'Drama', year: 2021, rating: 'TV-MA', imdbScore: 8.0 },
    { id: '5', title: 'Extraction', type: 'Movie', genre: 'Action', year: 2020, rating: 'R', imdbScore: 6.7 },
    { id: '6', title: 'Bridgerton', type: 'TV Show', genre: 'Romance', year: 2020, rating: 'TV-MA', imdbScore: 7.3 },
    { id: '7', title: 'The Witcher', type: 'TV Show', genre: 'Fantasy', year: 2019, rating: 'TV-MA', imdbScore: 8.2 },
    { id: '8', title: 'Money Heist', type: 'TV Show', genre: 'Crime', year: 2017, rating: 'TV-MA', imdbScore: 8.3 },
    { id: '9', title: 'Ozark', type: 'TV Show', genre: 'Crime', year: 2017, rating: 'TV-MA', imdbScore: 8.4 },
    { id: '10', title: 'The Umbrella Academy', type: 'TV Show', genre: 'Superhero', year: 2019, rating: 'TV-14', imdbScore: 7.9 }
  ];

  // Filter data based on selections
  const filteredShows = netflixShows.filter(show => {
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

  const genreData = Object.entries(genreStats).map(([genre, count], index) => ({
    name: genre,
    value: count,
    color: ['#E50914', '#B91C1C', '#DC2626', '#EF4444', '#F87171', '#FCA5A5', '#FECACA'][index % 7]
  }));

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

  const ratingData = Object.entries(ratingStats).map(([rating, count], index) => ({
    name: rating,
    value: count,
    percentage: filteredShows.length > 0 ? ((count / filteredShows.length) * 100).toFixed(1) : '0',
    color: ['#E50914', '#B91C1C', '#DC2626', '#EF4444', '#F87171'][index % 5]
  }));

  // Show duration data
  const durationData = [
    { duration: '< 30 min', percentage: 14.22, count: Math.floor(kpiData.totalShows * 0.1422) },
    { duration: '30-60 min', percentage: 59.87, count: Math.floor(kpiData.totalShows * 0.5987) },
    { duration: '60-90 min', percentage: 24.17, count: Math.floor(kpiData.totalShows * 0.2417) },
    { duration: '> 90 min', percentage: 1.77, count: Math.floor(kpiData.totalShows * 0.0177) }
  ];

  const genres = ['All', ...Array.from(new Set(netflixShows.map(show => show.genre)))];
  const years = ['All', ...Array.from(new Set(netflixShows.map(show => show.year.toString()))).sort().reverse()];
  const types = ['All', 'Movie', 'TV Show'];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-red-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
            N
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Netflix Dashboard</h2>
            <p className="text-gray-400">Full Insights & Analytics</p>
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
              <Badge variant="secondary" className="bg-red-500/20 text-red-400">
                Netflix Original
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <span className="text-gray-400 text-sm">Type</span>
                <p className="text-white font-semibold">{selectedShowData.type}</p>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Genre</span>
                <p className="text-white font-semibold">{selectedShowData.genre}</p>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Year</span>
                <p className="text-white font-semibold">{selectedShowData.year}</p>
              </div>
              <div>
                <span className="text-gray-400 text-sm">IMDb Score</span>
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
            <div className="text-3xl font-bold text-red-400">{kpiData.movies}</div>
            <div className="text-sm opacity-70">{kpiData.totalShows > 0 ? Math.round((kpiData.movies / kpiData.totalShows) * 100) : 0}%</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 text-white">
          <CardHeader className="pb-2 flex flex-row items-center space-y-0">
            <CardTitle className="text-sm font-medium opacity-90">Series</CardTitle>
            <Tv className="h-4 w-4 ml-auto opacity-70" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-400">{kpiData.series}</div>
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Genre Distribution */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Genre Distribution</CardTitle>
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
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {genreData.map((entry, index) => (
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
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Yearly Release */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-white">Yearly Release</CardTitle>
              <div className="flex space-x-4 text-sm mt-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-gray-300">Movies</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-300">TV Shows</span>
                </div>
              </div>
            </div>
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
                <BarChart data={yearlyData}>
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
                  <Bar dataKey="movies" fill="#E50914" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="series" fill="#3B82F6" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* View Rating */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">View Rating</CardTitle>
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
                <PieChart>
                  <Pie
                    data={ratingData}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {ratingData.map((entry, index) => (
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
                    formatter={(value, name) => [value, name]}
                  />
                </PieChart>
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
              {durationData.map((item, index) => (
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
          <CardTitle className="text-white">About Shows</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300 text-sm space-y-2">
          <p>"Stranger Things" has become one of Netflix's most popular original series, combining 80s nostalgia with supernatural horror elements.</p>
          <p>"The Crown" offers an intimate look at the British Royal Family, featuring award-winning performances and historical accuracy.</p>
          <p>"Squid Game" became a global phenomenon, showcasing Korean culture and addressing social inequality themes.</p>
          <Badge variant="secondary" className="mt-2">Latest Updates</Badge>
        </CardContent>
      </Card>
    </div>
  );
};

export default NetflixDashboard;
