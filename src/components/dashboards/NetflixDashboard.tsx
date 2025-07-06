
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, LineChart, Line } from 'recharts';
import { useState } from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';

const NetflixDashboard = () => {
  const [zoom, setZoom] = useState(1);
  const [genreZoom, setGenreZoom] = useState(1);
  const [yearlyZoom, setYearlyZoom] = useState(1);
  const [ratingZoom, setRatingZoom] = useState(1);

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

      {/* Filters and KPI cards */}

      {/* Charts Grid - Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Genre Distribution */}
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
                    outerRadius={120}
                    paddingAngle={0}
                    dataKey="count"
                  >
                    {genreData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(${360 - index * 45}, 75%, ${60 - index * 3}%)`} stroke="none" />
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
            <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
              {genreData.map((genre, index) => (
                <div key={genre.genre} className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: `hsl(${360 - index * 45}, 75%, ${60 - index * 3}%)` }}></div>
                  <span className="text-gray-300">{genre.genre}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Yearly Releases */}
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
                <BarChart data={yearlyReleases}>
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
                  <Bar dataKey="Movies" fill="#DC2626" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="TV Shows" fill="#F472B6" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-4 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-600"></div>
                <span className="text-gray-300 text-sm">Movies</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-pink-400"></div>
                <span className="text-gray-300 text-sm">TV Shows</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
                    color: '#fff'
                  }} 
                />
                <Bar dataKey="count" fill="#DC2626" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NetflixDashboard;
