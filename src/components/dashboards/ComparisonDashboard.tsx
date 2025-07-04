
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, ScatterChart, Scatter, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ComposedChart, Area } from 'recharts';
import { useState } from 'react';
import { ZoomIn, ZoomOut, Filter, Search } from 'lucide-react';

const ComparisonDashboard = () => {
  const [selectedView, setSelectedView] = useState('overview');
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedShow, setSelectedShow] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Mock detailed show data
  const showsData = [
    {
      id: 1,
      title: "2 Weeks in Lagos",
      platform: "Netflix",
      type: "Movie",
      genre: "Drama",
      releaseYear: 2021,
      duration: "107 min",
      rating: "TV-PG",
      dateAdded: "July 16, 2021",
      description: "2 Weeks in Lagos is a turbulent and thrilling journey into the lives of Ejikeme and Lola. Their lives collide when Ejikeme, an investment banker, comes home from the United States with Lola's brother Charlie to invest in Nigeria...",
      imdbScore: 6.8,
      director: "Kathryn Fasegha",
      cast: ["Beverly Naya", "Mike Afolarin", "Toyin Abraham"]
    },
    {
      id: 2,
      title: "The Crown",
      platform: "Netflix",
      type: "Series",
      genre: "Drama",
      releaseYear: 2016,
      duration: "4 Seasons",
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
      type: "Series",
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
      type: "Series",
      genre: "Action",
      releaseYear: 2019,
      duration: "3 Seasons",
      rating: "TV-14",
      dateAdded: "November 12, 2019",
      description: "The travels of a lone bounty hunter in the outer reaches of the galaxy, far from the authority of the New Republic.",
      imdbScore: 8.7,
      director: "Jon Favreau",
      cast: ["Pedro Pascal", "Gina Carano", "Carl Weathers"]
    }
  ];

  const platformData = [
    { platform: 'Netflix', totalShows: 13500, movies: 10400, series: 3100, avgRating: 6.49, color: '#E50914' },
    { platform: 'Amazon Prime', totalShows: 9684, movies: 7814, series: 1854, avgRating: 6.8, color: '#00A8E1' },
    { platform: 'Disney+', totalShows: 1450, movies: 1052, series: 398, avgRating: 7.2, color: '#8B5CF6' }
  ];

  const yearlyComparison = [
    { year: 2019, Netflix: 1456, Amazon: 1234, Disney: 145 },
    { year: 2020, Netflix: 1876, Amazon: 1567, Disney: 289 },
    { year: 2021, Netflix: 2134, Amazon: 1789, Disney: 356 },
    { year: 2022, Netflix: 2456, Amazon: 1923, Disney: 412 }
  ];

  const genreComparison = [
    { genre: 'Action', Netflix: 2847, Amazon: 1854, Disney: 98 },
    { genre: 'Comedy', Netflix: 1876, Amazon: 1456, Disney: 145 },
    { genre: 'Drama', Netflix: 2234, Amazon: 1234, Disney: 87 },
    { genre: 'Animation', Netflix: 543, Amazon: 321, Disney: 234 },
    { genre: 'Documentary', Netflix: 1543, Amazon: 987, Disney: 56 }
  ];

  const ratingDistribution = [
    { rating: 'TV-MA', Netflix: 37.93, Amazon: 21.88, Disney: 0.5 },
    { rating: 'TV-14', Netflix: 15.5, Amazon: 20.76, Disney: 4.8 },
    { rating: 'TV-PG', Netflix: 15.18, Amazon: 16.28, Disney: 28.3 },
    { rating: 'G', Netflix: 2.1, Amazon: 0.8, Disney: 45.6 },
    { rating: 'PG-13', Netflix: 8.23, Amazon: 12.83, Disney: 18.7 }
  ];

  const contentQualityData = [
    { platform: 'Netflix', contentVolume: 85, userRating: 65, exclusiveContent: 78, globalReach: 95 },
    { platform: 'Amazon', contentVolume: 70, userRating: 72, exclusiveContent: 65, globalReach: 88 },
    { platform: 'Disney+', contentVolume: 45, userRating: 85, exclusiveContent: 92, globalReach: 75 }
  ];

  const views = ['overview', 'content', 'ratings', 'trends', 'quality'];

  const filteredShows = showsData.filter(show => {
    return (selectedPlatform === 'All' || show.platform === selectedPlatform) &&
           (selectedGenre === 'All' || show.genre === selectedGenre) &&
           (selectedType === 'All' || show.type === selectedType);
  });

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.2, 2));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.2, 0.5));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Filters */}
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
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleZoomOut} className="text-gray-300 border-gray-600">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-gray-300 text-sm">{Math.round(zoomLevel * 100)}%</span>
            <Button variant="outline" size="sm" onClick={handleZoomIn} className="text-gray-300 border-gray-600">
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {views.map((view) => (
              <Button
                key={view}
                variant={selectedView === view ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedView(view)}
                className={selectedView === view ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white" : "text-gray-300 border-gray-600"}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </Button>
            ))}
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-gray-300 text-sm mb-2 block">Platform</label>
              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="All">All Platforms</SelectItem>
                  <SelectItem value="Netflix">Netflix</SelectItem>
                  <SelectItem value="Amazon Prime">Amazon Prime</SelectItem>
                  <SelectItem value="Disney+">Disney+</SelectItem>
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
                  <SelectItem value="All">All Genres</SelectItem>
                  <SelectItem value="Action">Action</SelectItem>
                  <SelectItem value="Drama">Drama</SelectItem>
                  <SelectItem value="Comedy">Comedy</SelectItem>
                  <SelectItem value="Animation">Animation</SelectItem>
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
                  <SelectItem value="All">All Types</SelectItem>
                  <SelectItem value="Movie">Movies</SelectItem>
                  <SelectItem value="Series">TV Series</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-gray-300 text-sm mb-2 block">Show/Movie</label>
              <Select value={selectedShow?.id || ''} onValueChange={(value) => setSelectedShow(filteredShows.find(s => s.id.toString() === value) || null)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select show/movie" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
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
                <span className="text-white font-bold">{platform.totalShows.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Movies</span>
                <span className="text-white font-bold">{platform.movies.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Series</span>
                <span className="text-white font-bold">{platform.series.toLocaleString()}</span>
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}>
        {/* Genre Distribution (Bar Chart without lines) */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Genre Distribution Across Platforms</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        {/* Rating Distribution */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Rating Distribution</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        {/* Platform Quality Radar */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Platform Quality Metrics</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        {/* Content Volume Scatter */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Content Volume vs Quality</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>

      {/* Yearly Trends */}
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm" style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}>
        <CardHeader>
          <CardTitle className="text-white">Yearly Release Trends</CardTitle>
          <div className="flex space-x-6 text-sm">
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
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-red-600/20 to-red-700/20 border-red-500/30">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">24,634</div>
              <div className="text-sm text-gray-400 mt-1">Total Content</div>
              <div className="text-xs text-gray-500 mt-2">Across all platforms</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-600/20 to-blue-700/20 border-blue-500/30">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">6.83</div>
              <div className="text-sm text-gray-400 mt-1">Avg IMDb Rating</div>
              <div className="text-xs text-gray-500 mt-2">Cross-platform average</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-600/20 to-purple-700/20 border-purple-500/30">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">78%</div>
              <div className="text-sm text-gray-400 mt-1">Movies</div>
              <div className="text-xs text-gray-500 mt-2">vs 22% TV Series</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-600/20 to-green-700/20 border-green-500/30">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">142</div>
              <div className="text-sm text-gray-400 mt-1">Unique Genres</div>
              <div className="text-xs text-gray-500 mt-2">Combined catalog</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComparisonDashboard;
