
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { useState } from 'react';

const ComparisonDashboard = () => {
  const [selectedView, setSelectedView] = useState('overview');

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

  const views = ['overview', 'content', 'ratings', 'trends'];

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

      {/* Comparison Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Total Content Comparison */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Total Content by Platform</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={platformData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="platform" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Bar dataKey="totalShows" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Movies vs Series */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Movies vs Series Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={platformData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="platform" stroke="#9CA3AF" />
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
                <Bar dataKey="series" fill="#00A8E1" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Yearly Trends */}
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
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
            <LineChart data={yearlyComparison}>
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
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Genre Comparison */}
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Genre Distribution Across Platforms</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={genreComparison} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis stroke="#9CA3AF" />
              <YAxis dataKey="genre" type="category" stroke="#9CA3AF" width={80} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }} 
              />
              <Bar dataKey="Netflix" fill="#E50914" />
              <Bar dataKey="Amazon" fill="#00A8E1" />
              <Bar dataKey="Disney" fill="#8B5CF6" />
            </BarChart>
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
