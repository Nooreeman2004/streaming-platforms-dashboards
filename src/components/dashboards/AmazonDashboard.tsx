
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from 'react';
import { Film, Tv, ZoomIn, ZoomOut, Filter } from 'lucide-react';

const AmazonDashboard = () => {
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  
  // Individual zoom states for each chart
  const [genreZoom, setGenreZoom] = useState(1);
  const [durationZoom, setDurationZoom] = useState(1);
  const [ratingZoom, setRatingZoom] = useState(1);

  const kpiData = {
    totalShows: 9684,
    movies: 7814,
    series: 1854,
    moviesPercentage: 81,
    seriesPercentage: 19
  };

  const genreData = [
    { name: 'Action', value: 1854, color: '#00A8E1' },
    { name: 'Adventure', value: 1672, color: '#0073AA' },
    { name: 'Comedy', value: 1456, color: '#005577' },
    { name: 'Drama', value: 1234, color: '#4A90A4' },
    { name: 'Documentary', value: 987, color: '#87CEEB' },
    { name: 'Animation', value: 765, color: '#B0E0E6' },
    { name: 'Others', value: 1716, color: '#E0F6FF' }
  ];

  const durationData = [
    { name: '0 min', value: 0, color: '#00A8E1' },
    { name: '1 min', value: 234, color: '#0073AA' },
    { name: '1 Season', value: 1456, color: '#005577' },
    { name: '10 min', value: 876, color: '#4A90A4' },
    { name: '10 Seasons', value: 543, color: '#87CEEB' },
    { name: '100 min', value: 321, color: '#B0E0E6' }
  ];

  const ratingData = [
    { name: '13+', value: 21.88, color: '#00A8E1' },
    { name: '16+', value: 20.76, color: '#0073AA' },
    { name: '18+', value: 16.28, color: '#005577' },
    { name: 'TV-G', value: 15.47, color: '#4A90A4' },
    { name: 'TV-PG', value: 12.83, color: '#87CEEB' },
    { name: '7+', value: 9.03, color: '#B0E0E6' },
    { name: 'Others', value: 3.75, color: '#E0F6FF' }
  ];

  const yearlyData = [
    { year: 2019, shows: 345 },
    { year: 2020, shows: 1234 },
    { year: 2021, shows: 1876 }
  ];

  const genres = ['All', 'Action', 'Adventure', 'Comedy', 'Drama', 'Documentary', 'Animation'];
  const years = ['All', '2019', '2020', '2021'];
  const types = ['All', 'Movie', 'TV Show'];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg">
            prime
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Amazon Prime Dashboard</h2>
            <p className="text-gray-400">Full Insights & Analytics</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-gray-300 text-sm mb-2 block">Content Type</label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {types.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
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
                    <SelectItem key={genre} value={genre}>{genre}</SelectItem>
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
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-600 to-cyan-500 border-0 text-white overflow-hidden relative">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Total Shows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{kpiData.totalShows.toLocaleString()}</div>
          </CardContent>
          <div className="absolute -right-4 -bottom-4 opacity-20">
            <div className="w-20 h-20 rounded-full bg-white/20"></div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 text-white overflow-hidden relative">
          <CardHeader className="pb-2 flex flex-row items-center space-y-0">
            <CardTitle className="text-sm font-medium opacity-90">Movies</CardTitle>
            <Film className="h-4 w-4 ml-auto opacity-70" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-400">{kpiData.movies.toLocaleString()}</div>
            <div className="text-sm opacity-70">{kpiData.moviesPercentage}%</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 text-white overflow-hidden relative">
          <CardHeader className="pb-2 flex flex-row items-center space-y-0">
            <CardTitle className="text-sm font-medium opacity-90">Series</CardTitle>
            <Tv className="h-4 w-4 ml-auto opacity-70" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-400">{kpiData.series.toLocaleString()}</div>
            <div className="text-sm opacity-70">{kpiData.seriesPercentage}%</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Genre Count</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-cyan-400">27</div>
            <div className="text-sm opacity-70">Categories</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Genre Distribution */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Genre</CardTitle>
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
              <div className="space-y-3">
                {genreData.slice(0, 6).map((genre, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">{genre.name}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 bg-gray-700 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${(genre.value / Math.max(...genreData.map(g => g.value))) * 100}%`,
                            backgroundColor: genre.color
                          }}
                        ></div>
                      </div>
                      <span className="text-white text-sm w-12">{genre.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Duration */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Duration</CardTitle>
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
              <div className="space-y-3">
                {durationData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">{item.name}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 bg-gray-700 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${(item.value / Math.max(...durationData.map(d => d.value))) * 100}%`,
                            backgroundColor: item.color
                          }}
                        ></div>
                      </div>
                      <span className="text-white text-sm w-12">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
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
                    formatter={(value) => [`${value}%`, 'Percentage']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">List of Directors</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 text-sm space-y-2">
            <div className="space-y-2">
              <p>Often matters: Ash has a destined encounter with Eiji Okumura...</p>
              <p>The college's diving club...</p>
              <p>Antonio Margheriti</p>
              <p>Raoul Walsh, Maria Baxa</p>
              <p>20th Century Fox</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">About Shows</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 text-sm space-y-2">
            <p>A high school boy back from that it doesn't disappoint. They make sure everyone is always before they start working...</p>
            <p>Spanning multiple criminal aspect in the community, this property examines topics inside.</p>
            <Badge variant="secondary" className="mt-2">Prime Originals</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AmazonDashboard;
