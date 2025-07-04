
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from 'react';
import { Film, Tv } from 'lucide-react';

const DisneyDashboard = () => {
  const [selectedGenre, setSelectedGenre] = useState('All');

  const kpiData = {
    totalShows: 1450,
    movies: 1052,
    series: 398,
    moviesPercentage: 73,
    seriesPercentage: 27
  };

  const genreData = [
    { name: 'Animation', value: 234, color: '#8B5CF6' },
    { name: 'Adventure', value: 198, color: '#7C3AED' },
    { name: 'Family', value: 167, color: '#6D28D9' },
    { name: 'Comedy', value: 145, color: '#5B21B6' },
    { name: 'Fantasy', value: 123, color: '#9333EA' },
    { name: 'Action', value: 98, color: '#A855F7' },
    { name: 'Others', value: 485, color: '#C084FC' }
  ];

  const yearlyData = [
    { year: 2019, shows: 145, movies: 98, series: 47 },
    { year: 2020, shows: 289, movies: 198, series: 91 },
    { year: 2021, shows: 356, movies: 245, series: 111 }
  ];

  const ratingData = [
    { name: 'G', value: 45.6, color: '#8B5CF6' },
    { name: 'PG', value: 28.3, color: '#7C3AED' },
    { name: 'PG-13', value: 18.7, color: '#6D28D9' },
    { name: 'TV-Y', value: 4.8, color: '#5B21B6' },
    { name: 'TV-Y7', value: 2.1, color: '#9333EA' },
    { name: 'Others', value: 0.5, color: '#A855F7' }
  ];

  const durationData = [
    { duration: '< 60 min', percentage: 42, count: 609 },
    { duration: '60-90 min', percentage: 31, count: 449 },
    { duration: '90-120 min', percentage: 18, count: 261 },
    { duration: '> 120 min', percentage: 9, count: 131 }
  ];

  const genres = ['All', 'Animation', 'Adventure', 'Family', 'Comedy', 'Fantasy', 'Action'];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
            D+
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Disney+ Hotstar Dashboard</h2>
            <p className="text-gray-400">Full Insights & Analytics</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <Button
              key={genre}
              variant={selectedGenre === genre ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedGenre(genre)}
              className={selectedGenre === genre ? "bg-purple-600 text-white" : "text-gray-300 border-gray-600"}
            >
              {genre}
            </Button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-purple-600 to-indigo-600 border-0 text-white overflow-hidden relative">
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
            <div className="text-3xl font-bold text-purple-400">{kpiData.movies.toLocaleString()}</div>
            <div className="text-sm opacity-70">{kpiData.moviesPercentage}%</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 text-white overflow-hidden relative">
          <CardHeader className="pb-2 flex flex-row items-center space-y-0">
            <CardTitle className="text-sm font-medium opacity-90">Series</CardTitle>
            <Tv className="h-4 w-4 ml-auto opacity-70" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-400">{kpiData.series.toLocaleString()}</div>
            <div className="text-sm opacity-70">{kpiData.seriesPercentage}%</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Family Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-400">89%</div>
            <div className="text-sm opacity-70">G & PG Rated</div>
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

        {/* Yearly Release */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Yearly Release</CardTitle>
            <div className="flex space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-gray-300">Movies</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
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
                <Bar dataKey="movies" fill="#8B5CF6" radius={[2, 2, 0, 0]} />
                <Bar dataKey="series" fill="#6366F1" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* View Rating */}
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

      {/* Additional Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Duration Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {durationData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-300">{item.duration}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full transition-all duration-500"
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
            <Badge variant="secondary" className="mt-2">Disney Originals</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DisneyDashboard;
