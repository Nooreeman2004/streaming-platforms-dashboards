import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, ScatterChart, Scatter, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { useState } from 'react';
import { Film, Tv, ZoomIn, ZoomOut, Filter } from 'lucide-react';

interface Show {
  id: number;
  title: string;
  type: string;
  genre: string;
  releaseYear: number;
  duration: string;
  rating: string;
  dateAdded: string;
  description: string;
  imdbScore: number;
  director: string;
  cast: string[];
}

interface YearlyStats {
  year: number;
  shows: number;
  movies: number;
  series: number;
}

const NetflixDashboard = () => {
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedShow, setSelectedShow] = useState<Show | null>(null);
  
  // Individual zoom states for each chart
  const [genreZoom, setGenreZoom] = useState(1);
  const [yearlyZoom, setYearlyZoom] = useState(1);
  const [ratingZoom, setRatingZoom] = useState(1);
  const [qualityZoom, setQualityZoom] = useState(1);
  const [durationZoom, setDurationZoom] = useState(1);

  // Mock Netflix shows data
  const netflixShows: Show[] = [
    {
      id: 1,
      title: "Stranger Things",
      type: "TV Show", 
      genre: "Horror",
      releaseYear: 2016,
      duration: "4 Seasons",
      rating: "TV-14",
      dateAdded: "July 15, 2016",
      description: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.",
      imdbScore: 8.7,
      director: "The Duffer Brothers",
      cast: ["Millie Bobby Brown", "Finn Wolfhard", "David Harbour"]
    },
    {
      id: 2,
      title: "The Crown",
      type: "TV Show",
      genre: "Drama", 
      releaseYear: 2016,
      duration: "6 Seasons",
      rating: "TV-MA",
      dateAdded: "November 4, 2016",
      description: "Follows the political rivalries and romance of Queen Elizabeth II's reign and the events that shaped the second half of the 20th century.",
      imdbScore: 8.7,
      director: "Peter Morgan",
      cast: ["Claire Foy", "Olivia Colman", "Imelda Staunton"]
    },
    {
      id: 3,
      title: "Red Notice",
      type: "Movie",
      genre: "Action",
      releaseYear: 2021,
      duration: "118 min",
      rating: "PG-13",
      dateAdded: "November 12, 2021",
      description: "An FBI profiler pursuing the world's most wanted art thief becomes his reluctant partner in crime to catch an elusive crook who's always one step ahead.",
      imdbScore: 6.4,
      director: "Rawson Marshall Thurber",
      cast: ["Dwayne Johnson", "Ryan Reynolds", "Gal Gadot"]
    },
    {
      id: 4,
      title: "Squid Game",
      type: "TV Show",
      genre: "Drama",
      releaseYear: 2021,
      duration: "1 Season",
      rating: "TV-MA",
      dateAdded: "September 17, 2021",
      description: "Hundreds of cash-strapped players accept a strange invitation to compete in children's games for a tempting prize.",
      imdbScore: 8.0,
      director: "Hwang Dong-hyuk",
      cast: ["Lee Jung-jae", "Park Hae-soo", "Wi Ha-jun"]
    },
    {
      id: 5,
      title: "Extraction",
      type: "Movie",
      genre: "Action",
      releaseYear: 2020,
      duration: "116 min",
      rating: "R",
      dateAdded: "April 24, 2020",
      description: "A black-market mercenary who has nothing to lose is hired to rescue the kidnapped son of an imprisoned international crime lord.",
      imdbScore: 6.7,
      director: "Sam Hargrave",
      cast: ["Chris Hemsworth", "Rudhraksh Jaiswal", "Randeep Hooda"]
    },
    {
      id: 6,
      title: "Bridgerton",
      type: "TV Show",
      genre: "Romance",
      releaseYear: 2020,
      duration: "2 Seasons",
      rating: "TV-MA",
      dateAdded: "December 25, 2020",
      description: "Wealth, lust, and betrayal set in the backdrop of Regency era England, seen through the eyes of the powerful Bridgerton family.",
      imdbScore: 7.3,
      director: "Chris Van Dusen",
      cast: ["Nicola Coughlan", "Jonathan Bailey", "Phoebe Dynevor"]
    }
  ];

  // Filter data based on selections
  const filteredShows = netflixShows.filter(show => {
    return (selectedGenre === 'All' || show.genre === selectedGenre) &&
           (selectedYear === 'All' || show.releaseYear.toString() === selectedYear) &&
           (selectedType === 'All' || show.type === selectedType);
  });

  // Dynamic KPI data based on filtered shows
  const kpiData = {
    totalShows: filteredShows.length,
    movies: filteredShows.filter(show => show.type === 'Movie').length,
    series: filteredShows.filter(show => show.type === 'TV Show').length,
    avgRating: filteredShows.length > 0 ? (filteredShows.reduce((sum, show) => sum + show.imdbScore, 0) / filteredShows.length).toFixed(1) : '0',
    moviesPercentage: filteredShows.length > 0 ? Math.round((filteredShows.filter(show => show.type === 'Movie').length / filteredShows.length) * 100) : 0,
    seriesPercentage: filteredShows.length > 0 ? Math.round((filteredShows.filter(show => show.type === 'TV Show').length / filteredShows.length) * 100) : 0
  };

  // Dynamic genre data based on filtered shows
  const genreStats = filteredShows.reduce((acc: Record<string, number>, show) => {
    acc[show.genre] = (acc[show.genre] || 0) + 1;
    return acc;
  }, {});

  const genreData = Object.entries(genreStats).map(([genre, count], index) => ({
    name: genre,
    value: count,
    color: ['#E50914', '#B91C1C', '#DC2626', '#EF4444', '#F87171', '#FCA5A5', '#FECACA'][index % 7]
  }));

  // Dynamic yearly data
  const yearlyStats = filteredShows.reduce((acc: Record<number, YearlyStats>, show) => {
    const year = show.releaseYear;
    if (!acc[year]) acc[year] = { year, shows: 0, movies: 0, series: 0 };
    acc[year].shows++;
    if (show.type === 'Movie') acc[year].movies++;
    else acc[year].series++;
    return acc;
  }, {});

  const yearlyData = Object.values(yearlyStats).sort((a, b) => a.year - b.year);

  // Dynamic rating data
  const ratingStats = filteredShows.reduce((acc: Record<string, number>, show) => {
    acc[show.rating] = (acc[show.rating] || 0) + 1;
    return acc;
  }, {});

  const ratingData = Object.entries(ratingStats).map(([rating, count], index) => ({
    name: rating,
    value: filteredShows.length > 0 ? ((count / filteredShows.length) * 100).toFixed(1) : '0',
    color: ['#E50914', '#B91C1C', '#DC2626', '#EF4444', '#F87171', '#FCA5A5', '#FECACA'][index % 7]
  }));

  const contentQuality = [
    { metric: 'Original Content', value: 85 },
    { metric: 'User Engagement', value: 78 },
    { metric: 'Critical Acclaim', value: 72 },
    { metric: 'Global Reach', value: 95 },
    { metric: 'Content Diversity', value: 88 }
  ];

  const genres = ['All', ...Array.from(new Set(netflixShows.map(show => show.genre)))];
  const years = ['All', ...Array.from(new Set(netflixShows.map(show => show.releaseYear.toString()))).sort().reverse()];
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
            
            <div>
              <label className="text-gray-300 text-sm mb-2 block">Specific Show/Movie</label>
              <Select value={selectedShow?.id?.toString() || 'none'} onValueChange={(value) => setSelectedShow(value === 'none' ? null : filteredShows.find(s => s.id.toString() === value) || null)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select show/movie" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="none">All Shows</SelectItem>
                  {filteredShows.map(show => (
                    <SelectItem key={show.id} value={show.id.toString()}>{show.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Information Panel */}
      {selectedShow && (
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>{selectedShow.title}</span>
              <Badge variant="secondary" className="bg-red-500/20 text-red-400">
                Netflix Original
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Release Year</span>
                  <span className="text-white font-semibold">{selectedShow.releaseYear}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Duration</span>
                  <span className="text-white font-semibold">{selectedShow.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Genre</span>
                  <Badge variant="outline" className="text-gray-300 border-gray-600">{selectedShow.genre}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Rating</span>
                  <Badge variant="outline" className="text-gray-300 border-gray-600">{selectedShow.rating}</Badge>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Date Added</span>
                  <span className="text-white font-semibold">{selectedShow.dateAdded}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">IMDb Score</span>
                  <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">
                    {selectedShow.imdbScore}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Director</span>
                  <span className="text-white font-semibold">{selectedShow.director}</span>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-400 block mb-2">Description</span>
                    <p className="text-gray-300 text-sm leading-relaxed">{selectedShow.description}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-2">Cast</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedShow.cast.map((actor, index) => (
                        <Badge key={index} variant="secondary" className="text-gray-300">
                          {actor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-red-600 to-red-700 border-0 text-white overflow-hidden relative">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Total Shows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{kpiData.totalShows}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 text-white overflow-hidden relative">
          <CardHeader className="pb-2 flex flex-row items-center space-y-0">
            <CardTitle className="text-sm font-medium opacity-90">Movies</CardTitle>
            <Film className="h-4 w-4 ml-auto opacity-70" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-400">{kpiData.movies}</div>
            <div className="text-sm opacity-70">{kpiData.moviesPercentage}%</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 text-white overflow-hidden relative">
          <CardHeader className="pb-2 flex flex-row items-center space-y-0">
            <CardTitle className="text-sm font-medium opacity-90">Series</CardTitle>
            <Tv className="h-4 w-4 ml-auto opacity-70" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-400">{kpiData.series}</div>
            <div className="text-sm opacity-70">{kpiData.seriesPercentage}%</div>
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

      {/* Interactive Charts Grid */}
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

        {/* Yearly Release Trends */}
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

        {/* View Rating Distribution */}
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

      {/* Additional Interactive Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Quality Radar */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Content Quality Metrics</CardTitle>
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
                <RadarChart data={contentQuality}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                  <PolarRadiusAxis angle={0} domain={[0, 100]} tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                  <Radar name="Quality" dataKey="value" stroke="#E50914" fill="#E50914" fillOpacity={0.2} />
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
                  { duration: '< 30 min', percentage: 14.22, count: Math.floor(kpiData.totalShows * 0.1422) },
                  { duration: '30-60 min', percentage: 59.87, count: Math.floor(kpiData.totalShows * 0.5987) },
                  { duration: '60-90 min', percentage: 24.17, count: Math.floor(kpiData.totalShows * 0.2417) },
                  { duration: '> 90 min', percentage: 1.77, count: Math.floor(kpiData.totalShows * 0.0177) }
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
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
