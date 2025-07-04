
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useState } from 'react';
import { Film, Tv } from 'lucide-react';

const NetflixDashboard = () => {
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');

  // Mock data - in real implementation, this would come from your CSV files
  const kpiData = {
    totalShows: 13500,
    movies: 10400,
    series: 3100,
    avgRating: 6.49,
    moviesPercentage: 77,
    seriesPercentage: 23
  };

  const genreData = [
    { name: 'Action', value: 2847, color: '#E50914' },
    { name: 'Drama', value: 2234, color: '#B91C1C' },
    { name: 'Comedy', value: 1876, color: '#DC2626' },
    { name: 'Documentary', value: 1543, color: '#EF4444' },
    { name: 'Horror', value: 1234, color: '#F87171' },
    { name: 'Romance', value: 987, color: '#FCA5A5' },
    { name: 'Others', value: 2779, color: '#FECACA' }
  ];

  const yearlyData = [
    { year: 2016, shows: 234, movies: 180, series: 54 },
    { year: 2017, shows: 456, movies: 345, series: 111 },
    { year: 2018, shows: 678, movies: 512, series: 166 },
    { year: 2019, shows: 890, movies: 623, series: 267 },
    { year: 2020, shows: 1234, movies: 876, series: 358 },
    { year: 2021, shows: 1456, movies: 1023, series: 433 },
    { year: 2022, shows: 1678, movies: 1201, series: 477 }
  ];

  const ratingData = [
    { name: 'TV-MA', value: 37.93, color: '#E50914' },
    { name: 'TV-14', value: 15.5, color: '#B91C1C' },
    { name: 'TV-PG', value: 15.18, color: '#DC2626' },
    { name: 'R', value: 9.7, color: '#EF4444' },
    { name: 'PG-13', value: 8.23, color: '#F87171' },
    { name: 'TV-Y7', value: 5.83, color: '#FCA5A5' },
    { name: 'Others', value: 7.83, color: '#FECACA' }
  ];

  const genres = ['All', 'Action', 'Drama', 'Comedy', 'Documentary', 'Horror', 'Romance'];
  const years = ['All', '2022', '2021', '2020', '2019', '2018', '2017', '2016'];

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
        
        {/* Filters */}
        <div className="flex items-center space-x-4">
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <Button
                key={genre}
                variant={selectedGenre === genre ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedGenre(genre)}
                className={selectedGenre === genre ? "bg-red-600 text-white" : "text-gray-300 border-gray-600"}
              >
                {genre}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-red-600 to-red-700 border-0 text-white overflow-hidden relative">
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
            <div className="text-3xl font-bold text-red-400">{kpiData.movies.toLocaleString()}</div>
            <div className="text-sm opacity-70">{kpiData.moviesPercentage}%</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 text-white overflow-hidden relative">
          <CardHeader className="pb-2 flex flex-row items-center space-y-0">
            <CardTitle className="text-sm font-medium opacity-90">Series</CardTitle>
            <Tv className="h-4 w-4 ml-auto opacity-70" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-400">{kpiData.series.toLocaleString()}</div>
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

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Genre Distribution */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Genre Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={genreData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
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
          </CardContent>
        </Card>

        {/* Yearly Release Trends */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Yearly Release</CardTitle>
            <div className="flex space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-gray-300">Movies</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-300">TV Shows</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        {/* View Rating Distribution */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">View Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ratingData}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  dataKey="value"
                  animationBegin={200}
                  animationDuration={800}
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
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Show Duration Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { duration: '< 30 min', percentage: 14.22, count: 1920 },
                { duration: '30-60 min', percentage: 59.87, count: 8084 },
                { duration: '60-90 min', percentage: 24.17, count: 3263 },
                { duration: '> 90 min', percentage: 1.77, count: 239 }
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
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">About Shows</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 text-sm space-y-2">
            <p>"Fauci" reveals the extraordinary life and career of Dr. Anthony Fauci...</p>
            <p>"Limitless with Chris Hemsworth" is coming to Disney+ in 2022.</p>
            <p>"Monsters at Work" tells the story of Tylor Tuskmon and his dream to become a Jokester.</p>
            <Badge variant="secondary" className="mt-2">Latest Updates</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NetflixDashboard;
