
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ContentData {
  id: string;
  title: string;
  platform: string;
  type: 'Movie' | 'TV Show';
  genre: string;
  year: number;
  imdb_rating: number;
  duration: number;
  country: string;
  age_rating: string;
  director: string;
  cast: string;
  awards: number;
}

const InteractiveDashboard = () => {
  const [data, setData] = useState<ContentData[]>([]);
  const [filteredData, setFilteredData] = useState<ContentData[]>([]);
  const [filters, setFilters] = useState({
    platform: 'all',
    genre: 'all',
    year: 'all',
    type: 'all',
    search: ''
  });

  // Generate mock data
  useEffect(() => {
    const platforms = ['Netflix', 'Amazon Prime', 'Disney+'];
    const genres = ['Drama', 'Comedy', 'Action', 'Documentary', 'Horror', 'Romance', 'Sci-Fi', 'Thriller', 'Animation', 'Family'];
    const countries = ['United States', 'United Kingdom', 'India', 'South Korea', 'Japan', 'France', 'Germany', 'Spain', 'Canada', 'Australia'];
    const ageRatings = ['G', 'PG', 'PG-13', 'R', 'TV-MA', 'TV-14', 'TV-PG'];
    const directors = ['Christopher Nolan', 'Steven Spielberg', 'Martin Scorsese', 'Quentin Tarantino', 'David Fincher', 'Ridley Scott'];
    const actors = ['Robert Downey Jr.', 'Scarlett Johansson', 'Leonardo DiCaprio', 'Meryl Streep', 'Tom Hanks', 'Jennifer Lawrence'];

    const mockData: ContentData[] = [];
    for (let i = 0; i < 1000; i++) {
      mockData.push({
        id: `content_${i}`,
        title: `Title ${i + 1}`,
        platform: platforms[Math.floor(Math.random() * platforms.length)],
        type: Math.random() > 0.6 ? 'Movie' : 'TV Show',
        genre: genres[Math.floor(Math.random() * genres.length)],
        year: 2015 + Math.floor(Math.random() * 9),
        imdb_rating: 5 + Math.random() * 4.5,
        duration: Math.random() > 0.6 ? 90 + Math.random() * 90 : 30 + Math.random() * 30,
        country: countries[Math.floor(Math.random() * countries.length)],
        age_rating: ageRatings[Math.floor(Math.random() * ageRatings.length)],
        director: directors[Math.floor(Math.random() * directors.length)],
        cast: actors[Math.floor(Math.random() * actors.length)],
        awards: Math.floor(Math.random() * 5)
      });
    }
    setData(mockData);
    setFilteredData(mockData);
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = data;

    if (filters.platform !== 'all') {
      filtered = filtered.filter(d => d.platform === filters.platform);
    }
    if (filters.genre !== 'all') {
      filtered = filtered.filter(d => d.genre === filters.genre);
    }
    if (filters.year !== 'all') {
      filtered = filtered.filter(d => d.year.toString() === filters.year);
    }
    if (filters.type !== 'all') {
      filtered = filtered.filter(d => d.type === filters.type);
    }
    if (filters.search) {
      filtered = filtered.filter(d => 
        d.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        d.director.toLowerCase().includes(filters.search.toLowerCase()) ||
        d.cast.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredData(filtered);
  }, [data, filters]);

  // Calculate KPIs
  const kpis = {
    totalTitles: filteredData.length,
    movieCount: filteredData.filter(d => d.type === 'Movie').length,
    seriesCount: filteredData.filter(d => d.type === 'TV Show').length,
    avgRating: filteredData.length > 0 ? (filteredData.reduce((sum, d) => sum + d.imdb_rating, 0) / filteredData.length).toFixed(1) : '0',
    topGenre: d3.rollup(filteredData, v => v.length, d => d.genre).size > 0 ? 
      Array.from(d3.rollup(filteredData, v => v.length, d => d.genre)).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A' : 'N/A',
    topAgeRating: d3.rollup(filteredData, v => v.length, d => d.age_rating).size > 0 ?
      Array.from(d3.rollup(filteredData, v => v.length, d => d.age_rating)).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A' : 'N/A',
    topCountry: d3.rollup(filteredData, v => v.length, d => d.country).size > 0 ?
      Array.from(d3.rollup(filteredData, v => v.length, d => d.country)).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A' : 'N/A'
  };

  const resetFilters = () => {
    setFilters({
      platform: 'all',
      genre: 'all',
      year: 'all',
      type: 'all',
      search: ''
    });
  };

  return (
    <div className="p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Interactive Streaming Analytics</h1>
          <p className="text-gray-300">Compare Netflix, Amazon Prime Video, and Disney+ content libraries</p>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-8 bg-slate-800/50 border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Platform</label>
              <Select value={filters.platform} onValueChange={(value) => setFilters({...filters, platform: value})}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="Netflix">Netflix</SelectItem>
                  <SelectItem value="Amazon Prime">Amazon Prime</SelectItem>
                  <SelectItem value="Disney+">Disney+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-gray-300 mb-2 block">Genre</label>
              <Select value={filters.genre} onValueChange={(value) => setFilters({...filters, genre: value})}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="all">All Genres</SelectItem>
                  <SelectItem value="Drama">Drama</SelectItem>
                  <SelectItem value="Comedy">Comedy</SelectItem>
                  <SelectItem value="Action">Action</SelectItem>
                  <SelectItem value="Documentary">Documentary</SelectItem>
                  <SelectItem value="Horror">Horror</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-gray-300 mb-2 block">Year</label>
              <Select value={filters.year} onValueChange={(value) => setFilters({...filters, year: value})}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="all">All Years</SelectItem>
                  {Array.from({length: 9}, (_, i) => 2015 + i).map(year => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-gray-300 mb-2 block">Content Type</label>
              <Select value={filters.type} onValueChange={(value) => setFilters({...filters, type: value})}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Movie">Movies</SelectItem>
                  <SelectItem value="TV Show">TV Shows</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-gray-300 mb-2 block">Search</label>
              <Input
                placeholder="Search titles, directors, actors..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
              />
            </div>

            <div className="flex items-end">
              <Button onClick={resetFilters} variant="outline" className="w-full border-slate-600 text-gray-300 hover:bg-slate-700">
                Reset Filters
              </Button>
            </div>
          </div>
        </Card>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <Card className="p-4 bg-slate-800/50 border-slate-700">
            <div className="text-2xl font-bold text-white">{kpis.totalTitles.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Total Titles</div>
          </Card>
          <Card className="p-4 bg-slate-800/50 border-slate-700">
            <div className="text-2xl font-bold text-blue-400">{kpis.movieCount.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Movies</div>
          </Card>
          <Card className="p-4 bg-slate-800/50 border-slate-700">
            <div className="text-2xl font-bold text-green-400">{kpis.seriesCount.toLocaleString()}</div>
            <div className="text-sm text-gray-400">TV Shows</div>
          </Card>
          <Card className="p-4 bg-slate-800/50 border-slate-700">
            <div className="text-2xl font-bold text-yellow-400">{kpis.avgRating}</div>
            <div className="text-sm text-gray-400">Avg Rating</div>
          </Card>
          <Card className="p-4 bg-slate-800/50 border-slate-700">
            <div className="text-sm font-bold text-purple-400 truncate">{kpis.topGenre}</div>
            <div className="text-xs text-gray-400">Top Genre</div>
          </Card>
          <Card className="p-4 bg-slate-800/50 border-slate-700">
            <div className="text-sm font-bold text-orange-400">{kpis.topAgeRating}</div>
            <div className="text-xs text-gray-400">Top Age Rating</div>
          </Card>
          <Card className="p-4 bg-slate-800/50 border-slate-700">
            <div className="text-xs font-bold text-red-400 truncate">{kpis.topCountry}</div>
            <div className="text-xs text-gray-400">Top Country</div>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <PlatformBarChart data={filteredData} />
          <ContentTypeDonut data={filteredData} />
          <ContentTrendsLine data={filteredData} />
          <RatingBoxPlot data={filteredData} />
          <DurationHistogram data={filteredData} />
          <GenreTreemap data={filteredData} />
          <CountryMap data={filteredData} />
          <AgeRatingStacked data={filteredData} />
          <DirectorWordCloud data={filteredData} />
          <AwardsBubble data={filteredData} />
        </div>
      </div>
    </div>
  );
};

// Individual chart components with D3.js
const PlatformBarChart = ({ data }: { data: ContentData[] }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 100 };
    const width = 400 - margin.left - margin.right;
    const height = 200 - margin.bottom - margin.top;

    const platformCounts = d3.rollup(data, v => v.length, d => d.platform);
    const plotData = Array.from(platformCounts, ([platform, count]) => ({ platform, count }));

    const x = d3.scaleLinear()
      .domain([0, d3.max(plotData, d => d.count) || 0])
      .range([0, width]);

    const y = d3.scaleBand()
      .domain(plotData.map(d => d.platform))
      .range([0, height])
      .padding(0.1);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const colors = d3.scaleOrdinal()
      .domain(['Netflix', 'Amazon Prime', 'Disney+'])
      .range(['#e50914', '#00a8e1', '#113ccf']);

    g.selectAll(".bar")
      .data(plotData)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("y", d => y(d.platform) || 0)
      .attr("height", y.bandwidth())
      .attr("x", 0)
      .attr("width", d => x(d.count))
      .attr("fill", d => colors(d.platform) as string)
      .on("mouseover", function(event, d) {
        d3.select(this).attr("opacity", 0.7);
        // Add tooltip
      })
      .on("mouseout", function() {
        d3.select(this).attr("opacity", 1);
      });

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    g.append("g")
      .call(d3.axisLeft(y));

  }, [data]);

  return (
    <Card className="p-6 bg-slate-800/50 border-slate-700">
      <h3 className="text-lg font-semibold text-white mb-4">Total Content per Platform</h3>
      <svg ref={svgRef} width="400" height="240" className="w-full h-auto"></svg>
    </Card>
  );
};

const ContentTypeDonut = ({ data }: { data: ContentData[] }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 300;
    const height = 200;
    const radius = Math.min(width, height) / 2 - 10;

    const typeCounts = d3.rollup(data, v => v.length, d => d.type);
    const plotData = Array.from(typeCounts, ([type, count]) => ({ type, count }));

    const color = d3.scaleOrdinal()
      .domain(['Movie', 'TV Show'])
      .range(['#3b82f6', '#10b981']);

    const pie = d3.pie<any>()
      .value(d => d.count)
      .sort(null);

    const arc = d3.arc()
      .innerRadius(radius * 0.4)
      .outerRadius(radius);

    const g = svg.append("g")
      .attr("transform", `translate(${width/2},${height/2})`);

    g.selectAll(".arc")
      .data(pie(plotData))
      .enter().append("g")
      .attr("class", "arc")
      .append("path")
      .attr("d", arc as any)
      .attr("fill", d => color(d.data.type) as string)
      .on("mouseover", function() {
        d3.select(this).attr("opacity", 0.7);
      })
      .on("mouseout", function() {
        d3.select(this).attr("opacity", 1);
      });

    // Add labels
    g.selectAll(".label")
      .data(pie(plotData))
      .enter().append("text")
      .attr("class", "label")
      .attr("transform", d => `translate(${arc.centroid(d as any)})`)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", "12px")
      .text(d => d.data.type);

  }, [data]);

  return (
    <Card className="p-6 bg-slate-800/50 border-slate-700">
      <h3 className="text-lg font-semibold text-white mb-4">Movies vs TV Shows</h3>
      <svg ref={svgRef} width="300" height="200" className="w-full h-auto"></svg>
    </Card>
  );
};

const ContentTrendsLine = ({ data }: { data: ContentData[] }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = 400 - margin.left - margin.right;
    const height = 200 - margin.bottom - margin.top;

    // Group data by platform and year
    const yearPlatformData = d3.rollup(data, v => v.length, d => d.platform, d => d.year);
    const years = Array.from(new Set(data.map(d => d.year))).sort();
    const platforms = ['Netflix', 'Amazon Prime', 'Disney+'];

    const plotData = platforms.map(platform => ({
      platform,
      values: years.map(year => ({
        year,
        count: yearPlatformData.get(platform)?.get(year) || 0
      }))
    }));

    const x = d3.scaleLinear()
      .domain(d3.extent(years) as [number, number])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(plotData, d => d3.max(d.values, v => v.count)) || 0])
      .range([height, 0]);

    const colors = d3.scaleOrdinal()
      .domain(platforms)
      .range(['#e50914', '#00a8e1', '#113ccf']);

    const line = d3.line<{year: number, count: number}>()
      .x(d => x(d.year))
      .y(d => y(d.count))
      .curve(d3.curveMonotoneX);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    plotData.forEach(platformData => {
      g.append("path")
        .datum(platformData.values)
        .attr("fill", "none")
        .attr("stroke", colors(platformData.platform) as string)
        .attr("stroke-width", 2)
        .attr("d", line);
    });

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    g.append("g")
      .call(d3.axisLeft(y));

  }, [data]);

  return (
    <Card className="p-6 bg-slate-800/50 border-slate-700">
      <h3 className="text-lg font-semibold text-white mb-4">Content Trends by Year</h3>
      <svg ref={svgRef} width="400" height="240" className="w-full h-auto"></svg>
    </Card>
  );
};

// Placeholder components for remaining charts
const RatingBoxPlot = ({ data }: { data: ContentData[] }) => (
  <Card className="p-6 bg-slate-800/50 border-slate-700">
    <h3 className="text-lg font-semibold text-white mb-4">IMDb Rating Distribution</h3>
    <div className="h-48 flex items-center justify-center text-gray-400">
      Box Plot Visualization
    </div>
  </Card>
);

const DurationHistogram = ({ data }: { data: ContentData[] }) => (
  <Card className="p-6 bg-slate-800/50 border-slate-700">
    <h3 className="text-lg font-semibold text-white mb-4">Content Duration Distribution</h3>
    <div className="h-48 flex items-center justify-center text-gray-400">
      Duration Histogram
    </div>
  </Card>
);

const GenreTreemap = ({ data }: { data: ContentData[] }) => (
  <Card className="p-6 bg-slate-800/50 border-slate-700">
    <h3 className="text-lg font-semibold text-white mb-4">Genre Distribution</h3>
    <div className="h-48 flex items-center justify-center text-gray-400">
      Genre Treemap
    </div>
  </Card>
);

const CountryMap = ({ data }: { data: ContentData[] }) => (
  <Card className="p-6 bg-slate-800/50 border-slate-700">
    <h3 className="text-lg font-semibold text-white mb-4">Content by Country</h3>
    <div className="h-48 flex items-center justify-center text-gray-400">
      World Map Visualization
    </div>
  </Card>
);

const AgeRatingStacked = ({ data }: { data: ContentData[] }) => (
  <Card className="p-6 bg-slate-800/50 border-slate-700">
    <h3 className="text-lg font-semibold text-white mb-4">Age Rating Distribution</h3>
    <div className="h-48 flex items-center justify-center text-gray-400">
      Stacked Age Rating Chart
    </div>
  </Card>
);

const DirectorWordCloud = ({ data }: { data: ContentData[] }) => (
  <Card className="p-6 bg-slate-800/50 border-slate-700">
    <h3 className="text-lg font-semibold text-white mb-4">Top Directors</h3>
    <div className="h-48 flex items-center justify-center text-gray-400">
      Director Word Cloud
    </div>
  </Card>
);

const AwardsBubble = ({ data }: { data: ContentData[] }) => (
  <Card className="p-6 bg-slate-800/50 border-slate-700">
    <h3 className="text-lg font-semibold text-white mb-4">Award-Winning Content</h3>
    <div className="h-48 flex items-center justify-center text-gray-400">
      Awards Bubble Chart
    </div>
  </Card>
);

export default InteractiveDashboard;
