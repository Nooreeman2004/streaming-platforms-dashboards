import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, ScatterChart, Scatter, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ComposedChart, Area } from 'recharts';
import { useState } from 'react';
import { ZoomIn, ZoomOut, Filter } from 'lucide-react';

interface Show {
  id: number;
  title: string;
  platform: string;
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

interface PlatformStats {
  totalShows: number;
  movies: number;
  series: number;
  totalRating: number;
}

interface GenreStats {
  Netflix: number;
  Amazon: number;
  Disney: number;
}

interface YearlyStats {
  Netflix: number;
  Amazon: number;
  Disney: number;
}

const ComparisonDashboard = () => {
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedShow, setSelectedShow] = useState<Show | null>(null);
  
  // Individual zoom states for each chart
  const [genreZoom, setGenreZoom] = useState(1);
  const [ratingZoom, setRatingZoom] = useState(1);
  const [qualityZoom, setQualityZoom] = useState(1);
  const [scatterZoom, setScatterZoom] = useState(1);
  const [yearlyZoom, setYearlyZoom] = useState(1);

  // Mock detailed show data across all platforms
  const showsData: Show[] = [
    {
      id: 1,
      title: "Stranger Things",
      platform: "Netflix",
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
      platform: "Netflix",
      type: "TV Show",
      genre: "Drama",
      releaseYear: 2016,
      duration: "6 Seasons",
      rating: "TV-MA",
      dateAdded: "November 4, 2016",
      description: "Follows the political rivalries and romance of Queen Elizabeth II's reign and the events that shaped the second half of the 20th century.",
      imdbScore: 8.7,
      director: "Peter Morgan",
      cast: ["Claire Foy", "Olivia Colman", "Matt Smith"]
    },
    {
      id: 3,
      title: "The Boys",
      platform: "Amazon Prime",
      type: "TV Show",
      genre: "Action",
      releaseYear: 2019,
      duration: "3 Seasons",
      rating: "TV-MA",
      dateAdded: "July 26, 2019",
      description: "A group of vigilantes set out to take down corrupt superheroes who abuse their superpowers.",
      imdbScore: 8.7,
      director: "Eric Kripke",
      cast: ["Karl Urban", "Jack Quaid", "Antony Starr"]
    },
    {
      id: 4,
      title: "The Mandalorian",
      platform: "Disney+",
      type: "TV Show",
      genre: "Action",
      releaseYear: 2019,
      duration: "3 Seasons",
      rating: "TV-14",
      dateAdded: "November 12, 2019",
      description: "The travels of a lone bounty hunter in the outer reaches of the galaxy, far from the authority of the New Republic.",
      imdbScore: 8.7,
      director: "Jon Favreau",
      cast: ["Pedro Pascal", "Gina Carano", "Carl Weathers"]
    },
    {
      id: 5,
      title: "Red Notice",
      platform: "Netflix",
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
      id: 6,
      title: "The Marvelous Mrs. Maisel",
      platform: "Amazon Prime",
      type: "TV Show",
      genre: "Comedy",
      releaseYear: 2017,
      duration: "5 Seasons",
      rating: "TV-14",
      dateAdded: "March 17, 2017",
      description: "A housewife in 1958 decides to become a stand-up comic.",
      imdbScore: 8.7,
      director: "Amy Sherman-Palladino",
      cast: ["Rachel Brosnahan", "Tony Shalhoub", "Alex Borstein"]
    },
    {
      id: 7,
      title: "Encanto",
      platform: "Disney+",
      type: "Movie",
      genre: "Animation",
      releaseYear: 2021,
      duration: "102 min",
      rating: "PG",
      dateAdded: "December 24, 2021",
      description: "A Colombian teenage girl has to face the frustration of being the only member of her family without magical powers.",
      imdbScore: 7.2,
      director: "Jared Bush",
      cast: ["Stephanie Beatriz", "María Cecilia Botero", "John Leguizamo"]
    }
  ];

  // Filter data based on selections
  const filteredShows = showsData.filter(show => {
    return (selectedPlatform === 'All' || show.platform === selectedPlatform) &&
           (selectedGenre === 'All' || show.genre === selectedGenre) &&
           (selectedType === 'All' || show.type === selectedType) &&
           (selectedYear === 'All' || show.releaseYear.toString() === selectedYear);
  });

  // Dynamic platform data based on filtered shows
  const platformStats = filteredShows.reduce((acc: Record<string, PlatformStats>, show) => {
    if (!acc[show.platform]) {
      acc[show.platform] = { totalShows: 0, movies: 0, series: 0, totalRating: 0 };
    }
    acc[show.platform].totalShows++;
    if (show.type === 'Movie') acc[show.platform].movies++;
    else acc[show.platform].series++;
    acc[show.platform].totalRating += show.imdbScore;
    return acc;
  }, {});

  const platformData = Object.entries(platformStats).map(([platform, stats]) => ({
    platform,
    totalShows: stats.totalShows,
    movies: stats.movies,
    series: stats.series,
    avgRating: (stats.totalRating / stats.totalShows).toFixed(1),
    color: platform === 'Netflix' ? '#E50914' : platform === 'Amazon Prime' ? '#00A8E1' : '#8B5CF6'
  }));

  // Dynamic genre comparison
  const genreStats: Record<string, GenreStats> = {};
  filteredShows.forEach(show => {
    if (!genreStats[show.genre]) {
      genreStats[show.genre] = { Netflix: 0, Amazon: 0, Disney: 0 };
    }
    if (show.platform === 'Netflix') genreStats[show.genre].Netflix++;
    else if (show.platform === 'Amazon Prime') genreStats[show.genre].Amazon++;
    else if (show.platform === 'Disney+') genreStats[show.genre].Disney++;
  });

  const genreComparison = Object.entries(genreStats).map(([genre, counts]) => ({
    genre,
    Netflix: counts.Netflix,
    Amazon: counts.Amazon,
    Disney: counts.Disney
  }));

  // Dynamic rating distribution
  const ratingStats: Record<string, GenreStats> = {};
  filteredShows.forEach(show => {
    if (!ratingStats[show.rating]) {
      ratingStats[show.rating] = { Netflix: 0, Amazon: 0, Disney: 0 };
    }
    if (show.platform === 'Netflix') ratingStats[show.rating].Netflix++;
    else if (show.platform === 'Amazon Prime') ratingStats[show.rating].Amazon++;
    else if (show.platform === 'Disney+') ratingStats[show.rating].Disney++;
  });

  const ratingDistribution = Object.entries(ratingStats).map(([rating, counts]) => {
    const total = Object.values(counts).reduce((sum: number, count: number) => sum + count, 0);
    return {
      rating,
      Netflix: total > 0 ? ((counts.Netflix / total) * 100).toFixed(1) : '0',
      Amazon: total > 0 ? ((counts.Amazon / total) * 100).toFixed(1) : '0',
      Disney: total > 0 ? ((counts.Disney / total) * 100).toFixed(1) : '0'
    };
  });

  // Dynamic yearly comparison
  const yearlyStats: Record<number, YearlyStats> = {};
  filteredShows.forEach(show => {
    if (!yearlyStats[show.releaseYear]) {
      yearlyStats[show.releaseYear] = { Netflix: 0, Amazon: 0, Disney: 0 };
    }
    if (show.platform === 'Netflix') yearlyStats[show.releaseYear].Netflix++;
    else if (show.platform === 'Amazon Prime') yearlyStats[show.releaseYear].Amazon++;
    else if (show.platform === 'Disney+') yearlyStats[show.releaseYear].Disney++;
  });

  const yearlyComparison = Object.entries(yearlyStats)
    .map(([year, counts]) => ({ 
      year: parseInt(year), 
      Netflix: counts.Netflix,
      Amazon: counts.Amazon,
      Disney: counts.Disney
    }))
    .sort((a, b) => a.year - b.year);

  const contentQualityData = [
    { platform: 'Netflix', contentVolume: 85, userRating: 65, exclusiveContent: 78, globalReach: 95 },
    { platform: 'Amazon', contentVolume: 70, userRating: 72, exclusiveContent: 65, globalReach: 88 },
    { platform: 'Disney+', contentVolume: 45, userRating: 85, exclusiveContent: 92, globalReach: 75 }
  ];

  const platforms = ['All', 'Netflix', 'Amazon Prime', 'Disney+'];
  const genres = ['All', ...Array.from(new Set(showsData.map(show => show.genre)))];
  const types = ['All', 'Movie', 'TV Show'];
  const years = ['All', ...Array.from(new Set(showsData.map(show => show.releaseYear.toString()))).sort().reverse()];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 via-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
            ALL
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Platform Comparison</h2>
            <p className="text-gray-400">Cross-Platform Analytics & Insights</p>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Advanced Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="text-gray-300 text-sm mb-2 block">Platform</label>
              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {platforms.map(platform => (
                    <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
              <Select value={selectedShow?.id?.toString() || ''} onValueChange={(value) => setSelectedShow(filteredShows.find(s => s.id.toString() === value) || null)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select show/movie" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="">All Shows</SelectItem>
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
              <Badge variant="secondary" className={`${
                selectedShow.platform === 'Netflix' ? 'bg-red-500/20 text-red-400' :
                selectedShow.platform === 'Amazon Prime' ? 'bg-blue-500/20 text-blue-400' :
                'bg-purple-500/20 text-purple-400'
              }`}>
                {selectedShow.platform}
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

      {/* Platform Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {platformData.map((platform, index) => (
          <Card key={index} className="bg-gray-800/50 border-gray-700 backdrop-blur-sm overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-lg">{platform.platform}</CardTitle>
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: platform.color }}
                ></div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Total Shows</span>
                <span className="text-white font-bold">{platform.totalShows}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Movies</span>
                <span className="text-white font-bold">{platform.movies}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Series</span>
                <span className="text-white font-bold">{platform.series}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Avg Rating</span>
                <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">
                  {platform.avgRating}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Interactive Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Genre Distribution */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Genre Distribution Across Platforms</CardTitle>
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

        {/* Rating Distribution */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Rating Distribution</CardTitle>
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
                    formatter={(value) => [`${value}%`, 'Percentage']}
                  />
                  <Bar dataKey="Netflix" fill="#E50914" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="Amazon" fill="#00A8E1" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="Disney" fill="#8B5CF6" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Platform Quality Radar */}
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
                <RadarChart data={contentQualityData}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis dataKey="platform" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                  <PolarRadiusAxis angle={0} domain={[0, 100]} tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                  <Radar name="Content Volume" dataKey="contentVolume" stroke="#E50914" fill="#E50914" fillOpacity={0.1} />
                  <Radar name="User Rating" dataKey="userRating" stroke="#00A8E1" fill="#00A8E1" fillOpacity={0.1} />
                  <Radar name="Exclusive Content" dataKey="exclusiveContent" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.1} />
                  <Radar name="Global Reach" dataKey="globalReach" stroke="#10B981" fill="#10B981" fillOpacity={0.1} />
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
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Volume Scatter */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Content Volume vs Quality</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setScatterZoom(prev => Math.max(prev - 0.2, 0.5))} className="text-gray-300 border-gray-600">
                <ZoomOut className="h-3 w-3" />
              </Button>
              <span className="text-gray-300 text-xs">{Math.round(scatterZoom * 100)}%</span>
              <Button variant="outline" size="sm" onClick={() => setScatterZoom(prev => Math.min(prev + 0.2, 2))} className="text-gray-300 border-gray-600">
                <ZoomIn className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div style={{ transform: `scale(${scatterZoom})`, transformOrigin: 'center' }}>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis type="number" dataKey="totalShows" name="Total Shows" stroke="#9CA3AF" />
                  <YAxis type="number" dataKey="avgRating" name="Avg Rating" stroke="#9CA3AF" />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }} 
                  />
                  <Scatter name="Platforms" data={platformData} fill="#8B5CF6" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Show Duration Distribution */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Show Duration Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { duration: '< 30 min', percentage: 14.22, count: Math.floor(filteredShows.length * 0.1422) },
                { duration: '30-60 min', percentage: 59.87, count: Math.floor(filteredShows.length * 0.5987) },
                { duration: '60-90 min', percentage: 24.17, count: Math.floor(filteredShows.length * 0.2417) },
                { duration: '> 90 min', percentage: 1.77, count: Math.floor(filteredShows.length * 0.0177) }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-300">{item.duration}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-red-500 via-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-white text-sm w-12">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Yearly Trends */}
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-white">Yearly Release Trends</CardTitle>
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
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={yearlyComparison}>
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
                <Area type="monotone" dataKey="Netflix" stackId="1" stroke="#E50914" fill="#E50914" fillOpacity={0.3} />
                <Area type="monotone" dataKey="Amazon" stackId="1" stroke="#00A8E1" fill="#00A8E1" fillOpacity={0.3} />
                <Area type="monotone" dataKey="Disney" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
                <Line 
                  type="monotone" 
                  dataKey="Netflix" 
                  stroke="#E50914" 
                  strokeWidth={3}
                  dot={{ r: 6 }}
                  activeDot={{ r: 8 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Amazon" 
                  stroke="#00A8E1" 
                  strokeWidth={3}
                  dot={{ r: 6 }}
                  activeDot={{ r: 8 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Disney" 
                  stroke="#8B5CF6" 
                  strokeWidth={3}
                  dot={{ r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-red-600/20 to-red-700/20 border-red-500/30">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{filteredShows.length}</div>
              <div className="text-sm text-gray-400 mt-1">Total Content</div>
              <div className="text-xs text-gray-500 mt-2">Filtered results</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-600/20 to-blue-700/20 border-blue-500/30">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {filteredShows.length > 0 ? (filteredShows.reduce((sum, show) => sum + show.imdbScore, 0) / filteredShows.length).toFixed(1) : '0'}
              </div>
              <div className="text-sm text-gray-400 mt-1">Avg IMDb Rating</div>
              <div className="text-xs text-gray-500 mt-2">Cross-platform average</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-600/20 to-purple-700/20 border-purple-500/30">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {filteredShows.length > 0 ? Math.round((filteredShows.filter(show => show.type === 'Movie').length / filteredShows.length) * 100) : 0}%
              </div>
              <div className="text-sm text-gray-400 mt-1">Movies</div>
              <div className="text-xs text-gray-500 mt-2">vs TV Series</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-600/20 to-green-700/20 border-green-500/30">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{Array.from(new Set(filteredShows.map(show => show.genre))).length}</div>
              <div className="text-sm text-gray-400 mt-1">Unique Genres</div>
              <div className="text-xs text-gray-500 mt-2">Combined catalog</div>
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
          <p>"The Boys" offers a dark take on superhero genre, exclusively available on Amazon Prime Video.</p>
          <p>"The Mandalorian" showcases Disney+'s commitment to high-quality original content in the Star Wars universe.</p>
          <Badge variant="secondary" className="mt-2">Latest Updates</Badge>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComparisonDashboard;
