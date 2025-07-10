import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { useState, useEffect, useMemo } from 'react';
import { Film, Tv, ZoomIn, ZoomOut, Filter } from 'lucide-react';
import * as d3 from 'd3';

interface AmazonShow {
  id: string;
  type: 'Movie' | 'TV Show' | 'Unknown';
  title: string;
  genre: string;
  year: number;
  rating: string;
  duration: string;
  country: string;
  dateAdded: string;
}

const AmazonDashboard: React.FC = () => {
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedShow, setSelectedShow] = useState<string>('none');
  const [amazonShows, setAmazonShows] = useState<AmazonShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Individual zoom states for each chart
  const [genreZoom, setGenreZoom] = useState(1);
  const [yearlyZoom, setYearlyZoom] = useState(1);
  const [ratingZoom, setRatingZoom] = useState(1);
  const [regionZoom, setRegionZoom] = useState(1);
  const [durationZoom, setDurationZoom] = useState(1);
  const [qualityZoom, setQualityZoom] = useState(1);
  const [seasonalZoom, setSeasonalZoom] = useState(1);

  // Fetch CSV data
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching CSV from /data/amazon_prime_titles.csv...');
        const response = await fetch('/data/amazon_prime_titles.csv');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} - Check if the file exists at /data/amazon_titles.csv`);
        }
        const csvText = await response.text();
        console.log('Raw CSV text:', csvText.substring(0, 200) + '...'); // Log first 200 chars
        const parsedData = d3.csvParse(csvText, (d: any): AmazonShow => {
          const parsedShow = {
            id: d.show_id || `s${Math.random().toString(36).slice(2)}`,
            type: (d.type || 'Unknown') as 'Movie' | 'TV Show' | 'Unknown',
            title: d.title || 'Untitled',
            genre: d.listed_in ? d.listed_in.split(', ')[0] || 'Unknown' : 'Unknown',
            year: parseInt(d.release_year) || 0,
            rating: d.rating || 'Not Rated',
            duration: d.duration || 'Unknown',
            country: d.country || 'Unknown',
            dateAdded: d.date_added || 'Unknown',
          };
          console.log('Parsed row:', parsedShow); // Log each parsed row
          return parsedShow;
        });
    
    
      
      } catch (err) {
        console.error('Error fetching or parsing CSV:', err);
        setError(`Failed to load data: ${err.message}. Ensure the CSV is in /data/amazon_prime_titles.csv and has the correct format.`);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Memoized filter data
  const filteredShows = useMemo(() => {
    const filtered = amazonShows.filter(show =>
      (selectedGenre === 'All' || show.genre === selectedGenre) &&
      (selectedYear === 'All' || show.year.toString() === selectedYear) &&
      (selectedType === 'All' || show.type === selectedType)
    );
    console.log('Filtered shows length:', filtered.length);
    return filtered;
  }, [amazonShows, selectedGenre, selectedYear, selectedType]);

  const selectedShowData = selectedShow !== 'none' ? filteredShows.find(s => s.id === selectedShow) : null;

  // Memoized filter options
  const genres = useMemo(() => ['All', ...Array.from(new Set(amazonShows.map(show => show.genre))).sort()], [amazonShows]);
  const years = useMemo(() => ['All', ...Array.from(new Set(amazonShows.map(show => show.year.toString()))).sort().reverse()], [amazonShows]);
  const types = ['All', 'Movie', 'TV Show'];

  // KPI data
  const kpiData = useMemo(() => ({
    totalShows: filteredShows.length,
    movies: filteredShows.filter(show => show.type === 'Movie').length,
    series: filteredShows.filter(show => show.type === 'TV Show').length,
    avgRating: 'N/A', // Removed imdbScore, so no average rating
  }), [filteredShows]);

  // Genre distribution data (dynamic)
  const genreData = useMemo(() => {
    const genreStats = filteredShows.reduce((acc: Record<string, number>, show) => {
      acc[show.genre] = (acc[show.genre] || 0) + 1;
      return acc;
    }, {});
    const colors = ['#2563EB', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', '#DBEAFE', '#EFF6FF'];
    const data = Object.entries(genreStats)
      .map(([genre, count], index) => ({
        genre,
        count,
        percentage: filteredShows.length ? ((count / filteredShows.length) * 100).toFixed(1) : 0,
        color: colors[index % colors.length],
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 7);
    console.log('Genre data:', data);
    return data;
  }, [filteredShows]);

  // Rating distribution data (dynamic)
  const ratingDistribution = useMemo(() => {
    const ratingStats = filteredShows.reduce((acc: Record<string, number>, show) => {
      acc[show.rating] = (acc[show.rating] || 0) + 1;
      return acc;
    }, {});
    const colors = ['#1E40AF', '#2563EB', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE'];
    const data = Object.entries(ratingStats)
      .map(([rating, count], index) => ({
        rating,
        count,
        color: colors[index % colors.length],
      }))
      .sort((a, b) => b.count - a.count);
    console.log('Rating distribution:', data);
    return data;
  }, [filteredShows]);

  // Content growth over time (dynamic)
  const areaData = useMemo(() => {
    const yearlyStats = filteredShows.reduce((acc: Record<number, { year: number; movies: number; series: number; total: number }>, show) => {
      const year = show.year;
      if (!acc[year]) acc[year] = { year, movies: 0, series: 0, total: 0 };
      if (show.type === 'Movie') acc[year].movies++;
      else if (show.type === 'TV Show') acc[year].series++;
      acc[year].total++;
      return acc;
    }, {});
    const data = Object.values(yearlyStats).sort((a, b) => a.year - b.year);
    console.log('Area data:', data);
    return data;
  }, [filteredShows]);

  // Region distribution data for Pie Chart (dynamic)
  const regionData = useMemo(() => {
    const regionStats = filteredShows.reduce((acc: Record<string, number>, show) => {
      acc[show.country] = (acc[show.country] || 0) + 1;
      return acc;
    }, {});
    const colors = ['#2563EB', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', '#DBEAFE', '#EFF6FF'];
    const data = Object.entries(regionStats)
      .map(([country, count], index) => ({
        name: country,
        value: count,
        percentage: filteredShows.length ? ((count / filteredShows.length) * 100).toFixed(1) : 0,
        color: colors[index % colors.length],
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 7);
    console.log('Region data:', data);
    return data;
  }, [filteredShows]);

  // Show Duration Distribution (dynamic)
  const durationData = useMemo(() => {
    const durationCounts = filteredShows.reduce(
      (acc: Record<string, number>, show) => {
        const durationNum = parseInt(show.duration.replace(' min', '').replace(' Season', '').replace(' Seasons', '')) || 0;
        if (durationNum < 30) acc['< 30 min']++;
        else if (durationNum <= 60) acc['30-60 min']++;
        else if (durationNum <= 90) acc['60-90 min']++;
        else acc['> 90 min']++;
        return acc;
      },
      { '< 30 min': 0, '30-60 min': 0, '60-90 min': 0, '> 90 min': 0 }
    );
    const data = Object.entries(durationCounts).map(([duration, count]) => ({
      duration,
      count,
      percentage: filteredShows.length ? ((count / filteredShows.length) * 100).toFixed(1) : 0,
    }));
    console.log('Duration data:', data);
    return data;
  }, [filteredShows]);

  // Static data for Content Quality and Seasonal Trends
  const contentQualityData = [
    { genre: 'Drama', avgRating: 8.2, criticScore: 85, audienceScore: 78, viewerHours: 45000 },
    { genre: 'Action', avgRating: 7.8, criticScore: 76, audienceScore: 84, viewerHours: 52000 },
    { genre: 'Comedy', avgRating: 7.5, criticScore: 72, audienceScore: 81, viewerHours: 38000 },
    { genre: 'Sci-Fi', avgRating: 8.1, criticScore: 82, audienceScore: 86, viewerHours: 41000 },
    { genre: 'Fantasy', avgRating: 7.9, criticScore: 79, audienceScore: 82, viewerHours: 39000 },
  ];

  const seasonalTrendsData = [
    { month: 'Jan', drama: 12000, action: 15000, comedy: 9000, scifi: 8500 },
    { month: 'Feb', drama: 11500, action: 14200, comedy: 8800, scifi: 8200 },
    { month: 'Mar', drama: 13000, action: 16500, comedy: 10200, scifi: 9100 },
    { month: 'Apr', drama: 14500, action: 17800, comedy: 11000, scifi: 9800 },
    { month: 'May', drama: 15200, action: 18500, comedy: 11800, scifi: 10200 },
    { month: 'Jun', drama: 16000, action: 19200, comedy: 12500, scifi: 10800 },
  ];

  if (loading) return <div className="text-white">Loading data...</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <div className="space-y-6 animate-fade-in p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
            P
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Amazon Prime Video Analytics</h2>
            <p className="text-gray-400">{amazonShows.length.toLocaleString()}+ titles across {Array.from(new Set(amazonShows.map(show => show.country))).length}+ countries</p>
          </div>
        </div>
      </div>

      {/* Debug Data Display */}
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Debug Data</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-gray-300 text-sm overflow-x-auto max-h-40">
            {JSON.stringify(amazonShows.slice(0, 5), null, 2)}...
          </pre>
        </CardContent>
      </Card>

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
                <p className="text-yellow-400 font-bold">N/A</p> {/* Removed imdbScore */}
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
            <div className="text-3xl font-bold text-yellow-400">N/A</div>
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
                      color: '#fff',
                    }}
                    formatter={(value, name, props) => [`${value} (${props.payload.percentage}%)`, props.payload.genre]}
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
                      color: '#fff',
                    }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {ratingDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Area Chart and Region Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Growth Area Chart */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Content Growth Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ transform: `scale(${yearlyZoom})`, transformOrigin: 'center' }}>
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
                      color: '#fff',
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
            </div>
          </CardContent>
        </Card>

        {/* Content by Region - Pie Chart */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Content by Region</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setRegionZoom(prev => Math.max(prev - 0.2, 0.5))} className="text-gray-300 border-gray-600">
                <ZoomOut className="h-3 w-3" />
              </Button>
              <span className="text-gray-300 text-xs">{Math.round(regionZoom * 100)}%</span>
              <Button variant="outline" size="sm" onClick={() => setRegionZoom(prev => Math.min(prev + 0.2, 2))} className="text-gray-300 border-gray-600">
                <ZoomIn className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div style={{ transform: `scale(${regionZoom})`, transformOrigin: 'center' }}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={regionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={0}
                    dataKey="value"
                  >
                    {regionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                    formatter={(value, name, props) => [`${value} (${props.payload.percentage}%)`, props.payload.name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
              {regionData.map((region, index) => (
                <div key={region.name} className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: region.color }}></div>
                  <span className="text-gray-300">{region.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Quality and Seasonal Trends */}
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
                      color: '#fff',
                    }}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Seasonal Viewing Trends */}
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
                      color: '#fff',
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
              {durationData.map((item, index) => (
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
