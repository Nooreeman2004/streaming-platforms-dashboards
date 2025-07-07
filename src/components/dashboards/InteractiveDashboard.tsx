
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
  budget: number;
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
        awards: Math.floor(Math.random() * 5),
        budget: Math.random() * 200 + 50 // Budget in millions
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

  // Platform Statistics
  const platformStats = ['Netflix', 'Amazon Prime', 'Disney+'].map(platform => {
    const platformData = filteredData.filter(d => d.platform === platform);
    return {
      platform,
      totalTitles: platformData.length,
      movies: platformData.filter(d => d.type === 'Movie').length,
      series: platformData.filter(d => d.type === 'TV Show').length,
      avgRating: platformData.length > 0 ? (platformData.reduce((sum, d) => sum + d.imdb_rating, 0) / platformData.length).toFixed(1) : '0',
      topGenre: d3.rollup(platformData, v => v.length, d => d.genre).size > 0 ? 
        Array.from(d3.rollup(platformData, v => v.length, d => d.genre)).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A' : 'N/A'
    };
  });

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
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
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
          <GenrePopularityChart data={filteredData} />
          <BudgetChart data={filteredData} />
        </div>

        {/* Platform Comparison Cards */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Platform Comparison</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {platformStats.map((stat) => (
              <Card key={stat.platform} className="p-6 bg-slate-800/50 border-slate-700">
                <h3 className="text-xl font-bold text-white mb-4">{stat.platform}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Titles:</span>
                    <span className="text-white font-semibold">{stat.totalTitles}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Movies:</span>
                    <span className="text-blue-400 font-semibold">{stat.movies}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">TV Shows:</span>
                    <span className="text-green-400 font-semibold">{stat.series}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Avg Rating:</span>
                    <span className="text-yellow-400 font-semibold">{stat.avgRating}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Top Genre:</span>
                    <span className="text-purple-400 font-semibold">{stat.topGenre}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Platform Insights & Analysis */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-white mb-6">Platform Insights & Analysis</h2>
          
          <NetflixInsights data={filteredData} />
          <AmazonPrimeInsights data={filteredData} />
          <DisneyPlusInsights data={filteredData} />
        </div>
      </div>
    </div>
  );
};

// Enhanced chart components with D3.js
const PlatformBarChart = ({ data }: { data: ContentData[] }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 40, right: 30, bottom: 60, left: 120 };
    const width = 400 - margin.left - margin.right;
    const height = 250 - margin.bottom - margin.top;

    const platformCounts = d3.rollup(data, v => v.length, d => d.platform);
    const plotData = Array.from(platformCounts, ([platform, count]) => ({ platform, count }));

    const x = d3.scaleLinear()
      .domain([0, d3.max(plotData, d => d.count) || 0])
      .range([0, width]);

    const y = d3.scaleBand()
      .domain(plotData.map(d => d.platform))
      .range([0, height])
      .padding(0.2);

    const colors = d3.scaleOrdinal()
      .domain(['Netflix', 'Amazon Prime', 'Disney+'])
      .range(['#e50914', '#00a8e1', '#113ccf']);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

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
        d3.select(this).attr("opacity", 0.8);
        
        const tooltip = d3.select("body").append("div")
          .attr("class", "tooltip")
          .style("opacity", 0)
          .style("position", "absolute")
          .style("background", "rgba(0, 0, 0, 0.8)")
          .style("color", "white")
          .style("padding", "8px")
          .style("border-radius", "4px")
          .style("font-size", "12px");

        tooltip.transition().duration(200).style("opacity", 1);
        tooltip.html(`${d.platform}: ${d.count} titles`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function() {
        d3.select(this).attr("opacity", 1);
        d3.selectAll(".tooltip").remove();
      });

    // Add value labels
    g.selectAll(".label")
      .data(plotData)
      .enter().append("text")
      .attr("class", "label")
      .attr("x", d => x(d.count) + 5)
      .attr("y", d => (y(d.platform) || 0) + y.bandwidth() / 2)
      .attr("dy", "0.35em")
      .style("fill", "white")
      .style("font-size", "12px")
      .text(d => d.count);

    // Axes with white text
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("fill", "white");

    g.append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("fill", "white");

    // Title
    svg.append("text")
      .attr("x", width / 2 + margin.left)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text("Total Content per Platform");

  }, [data]);

  return (
    <Card className="p-6 bg-slate-800/50 border-slate-700">
      <svg ref={svgRef} width="400" height="280" className="w-full h-auto"></svg>
    </Card>
  );
};

const ContentTypeDonut = ({ data }: { data: ContentData[] }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 350;
    const height = 280;
    const radius = Math.min(width, height) / 2 - 40;

    const typeCounts = d3.rollup(data, v => v.length, d => d.type);
    const plotData = Array.from(typeCounts, ([type, count]) => ({ type, count }));

    const color = d3.scaleOrdinal()
      .domain(['Movie', 'TV Show'])
      .range(['#3b82f6', '#10b981']);

    const pie = d3.pie<any>()
      .value(d => d.count)
      .sort(null);

    const arc = d3.arc()
      .innerRadius(radius * 0.5)
      .outerRadius(radius);

    const g = svg.append("g")
      .attr("transform", `translate(${width/2},${height/2})`);

    const arcs = g.selectAll(".arc")
      .data(pie(plotData))
      .enter().append("g")
      .attr("class", "arc");

    arcs.append("path")
      .attr("d", arc as any)
      .attr("fill", d => color(d.data.type) as string)
      .on("mouseover", function(event, d) {
        d3.select(this).attr("opacity", 0.8);
        
        const tooltip = d3.select("body").append("div")
          .attr("class", "tooltip")
          .style("opacity", 0)
          .style("position", "absolute")
          .style("background", "rgba(0, 0, 0, 0.8)")
          .style("color", "white")
          .style("padding", "8px")
          .style("border-radius", "4px")
          .style("font-size", "12px");

        tooltip.transition().duration(200).style("opacity", 1);
        tooltip.html(`${d.data.type}: ${d.data.count} (${((d.data.count / data.length) * 100).toFixed(1)}%)`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function() {
        d3.select(this).attr("opacity", 1);
        d3.selectAll(".tooltip").remove();
      });

    // Add labels
    arcs.append("text")
      .attr("transform", d => `translate(${arc.centroid(d as any)})`)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .text(d => d.data.type);

    // Title
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text("Movies vs TV Shows");

  }, [data]);

  return (
    <Card className="p-6 bg-slate-800/50 border-slate-700">
      <svg ref={svgRef} width="350" height="280" className="w-full h-auto"></svg>
    </Card>
  );
};

const ContentTrendsLine = ({ data }: { data: ContentData[] }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 40, right: 80, bottom: 60, left: 60 };
    const width = 400 - margin.left - margin.right;
    const height = 280 - margin.bottom - margin.top;

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

    // Add zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on("zoom", (event) => {
        const { transform } = event;
        g.attr("transform", `translate(${margin.left},${margin.top}) ${transform}`);
      });

    svg.call(zoom as any);

    plotData.forEach(platformData => {
      g.append("path")
        .datum(platformData.values)
        .attr("fill", "none")
        .attr("stroke", colors(platformData.platform) as string)
        .attr("stroke-width", 2)
        .attr("d", line);

      // Add points
      g.selectAll(`.point-${platformData.platform}`)
        .data(platformData.values)
        .enter().append("circle")
        .attr("class", `point-${platformData.platform}`)
        .attr("cx", d => x(d.year))
        .attr("cy", d => y(d.count))
        .attr("r", 3)
        .attr("fill", colors(platformData.platform) as string)
        .on("mouseover", function(event, d) {
          const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("position", "absolute")
            .style("background", "rgba(0, 0, 0, 0.8)")
            .style("color", "white")
            .style("padding", "8px")
            .style("border-radius", "4px")
            .style("font-size", "12px");

          tooltip.transition().duration(200).style("opacity", 1);
          tooltip.html(`${platformData.platform} ${d.year}: ${d.count} titles`)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
          d3.selectAll(".tooltip").remove();
        });
    });

    // Axes with white text
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat(d3.format("d")))
      .selectAll("text")
      .style("fill", "white");

    g.append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("fill", "white");

    // Title
    svg.append("text")
      .attr("x", width / 2 + margin.left)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text("Content Trends by Year (Zoom & Pan)");

  }, [data]);

  return (
    <Card className="p-6 bg-slate-800/50 border-slate-700">
      <svg ref={svgRef} width="400" height="280" className="w-full h-auto"></svg>
    </Card>
  );
};

// Implement remaining charts with full D3.js functionality
const RatingBoxPlot = ({ data }: { data: ContentData[] }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 40, right: 30, bottom: 60, left: 80 };
    const width = 400 - margin.left - margin.right;
    const height = 280 - margin.bottom - margin.top;

    const platforms = ['Netflix', 'Amazon Prime', 'Disney+'];
    const boxData = platforms.map(platform => {
      const platformRatings = data.filter(d => d.platform === platform).map(d => d.imdb_rating).sort(d3.ascending);
      const q1 = d3.quantile(platformRatings, 0.25) || 0;
      const median = d3.quantile(platformRatings, 0.5) || 0;
      const q3 = d3.quantile(platformRatings, 0.75) || 0;
      const min = d3.min(platformRatings) || 0;
      const max = d3.max(platformRatings) || 0;
      
      return { platform, q1, median, q3, min, max, ratings: platformRatings };
    });

    const x = d3.scaleBand()
      .domain(platforms)
      .range([0, width])
      .padding(0.3);

    const y = d3.scaleLinear()
      .domain([0, 10])
      .range([height, 0]);

    const colors = d3.scaleOrdinal()
      .domain(platforms)
      .range(['#e50914', '#00a8e1', '#113ccf']);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    boxData.forEach(d => {
      const xPos = x(d.platform) || 0;
      const boxWidth = x.bandwidth();

      // Box
      g.append("rect")
        .attr("x", xPos)
        .attr("y", y(d.q3))
        .attr("width", boxWidth)
        .attr("height", y(d.q1) - y(d.q3))
        .attr("fill", colors(d.platform) as string)
        .attr("opacity", 0.7)
        .attr("stroke", "white")
        .attr("stroke-width", 1);

      // Median line
      g.append("line")
        .attr("x1", xPos)
        .attr("x2", xPos + boxWidth)
        .attr("y1", y(d.median))
        .attr("y2", y(d.median))
        .attr("stroke", "white")
        .attr("stroke-width", 2);

      // Whiskers
      g.append("line")
        .attr("x1", xPos + boxWidth/2)
        .attr("x2", xPos + boxWidth/2)
        .attr("y1", y(d.min))
        .attr("y2", y(d.q1))
        .attr("stroke", "white")
        .attr("stroke-width", 1);

      g.append("line")
        .attr("x1", xPos + boxWidth/2)
        .attr("x2", xPos + boxWidth/2)
        .attr("y1", y(d.q3))
        .attr("y2", y(d.max))
        .attr("stroke", "white")
        .attr("stroke-width", 1);
    });

    // Axes
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("fill", "white");

    g.append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("fill", "white");

    // Title
    svg.append("text")
      .attr("x", width / 2 + margin.left)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text("IMDb Rating Distribution");

  }, [data]);

  return (
    <Card className="p-6 bg-slate-800/50 border-slate-700">
      <svg ref={svgRef} width="400" height="280" className="w-full h-auto"></svg>
    </Card>
  );
};

const DurationHistogram = ({ data }: { data: ContentData[] }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 40, right: 30, bottom: 60, left: 60 };
    const width = 400 - margin.left - margin.right;
    const height = 280 - margin.bottom - margin.top;

    const durations = data.map(d => d.duration);
    const histogram = d3.histogram()
      .domain(d3.extent(durations) as [number, number])
      .thresholds(15);

    const bins = histogram(durations);

    const x = d3.scaleLinear()
      .domain(d3.extent(durations) as [number, number])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(bins, d => d.length) || 0])
      .range([height, 0]);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add brush for zoom/selection
    const brush = d3.brushX()
      .extent([[0, 0], [width, height]])
      .on("brush end", (event) => {
        if (event.selection) {
          const [x0, x1] = event.selection.map(x.invert);
          console.log(`Selected duration range: ${x0.toFixed(0)} - ${x1.toFixed(0)} minutes`);
        }
      });

    g.selectAll(".bar")
      .data(bins)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.x0 || 0))
      .attr("y", d => y(d.length))
      .attr("width", d => x(d.x1 || 0) - x(d.x0 || 0) - 1)
      .attr("height", d => height - y(d.length))
      .attr("fill", "#3b82f6")
      .attr("opacity", 0.7)
      .on("mouseover", function(event, d) {
        d3.select(this).attr("opacity", 1);
        
        const tooltip = d3.select("body").append("div")
          .attr("class", "tooltip")
          .style("opacity", 0)
          .style("position", "absolute")
          .style("background", "rgba(0, 0, 0, 0.8)")
          .style("color", "white")
          .style("padding", "8px")
          .style("border-radius", "4px")
          .style("font-size", "12px");

        tooltip.transition().duration(200).style("opacity", 1);
        tooltip.html(`${d.x0?.toFixed(0)}-${d.x1?.toFixed(0)} min: ${d.length} titles`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function() {
        d3.select(this).attr("opacity", 0.7);
        d3.selectAll(".tooltip").remove();
      });

    g.append("g").call(brush);

    // Axes
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("fill", "white");

    g.append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("fill", "white");

    // Title
    svg.append("text")
      .attr("x", width / 2 + margin.left)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text("Content Duration Distribution");

  }, [data]);

  return (
    <Card className="p-6 bg-slate-800/50 border-slate-700">
      <svg ref={svgRef} width="400" height="280" className="w-full h-auto"></svg>
    </Card>
  );
};

const GenreTreemap = ({ data }: { data: ContentData[] }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 400;
    const height = 280;

    const genreCounts = d3.rollup(data, v => v.length, d => d.genre);
    const treeData = {
      name: "genres",
      children: Array.from(genreCounts, ([genre, count]) => ({ name: genre, value: count }))
    };

    const root = d3.hierarchy(treeData)
      .sum(d => d.value || 0)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    d3.treemap()
      .size([width, height])
      .padding(2)
      (root);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const g = svg.append("g");

    const leaf = g.selectAll("g")
      .data(root.leaves())
      .enter().append("g")
      .attr("transform", d => `translate(${d.x0},${d.y0})`);

    leaf.append("rect")
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0)
      .attr("fill", d => color(d.data.name))
      .attr("opacity", 0.7)
      .attr("stroke", "white")
      .attr("stroke-width", 1)
      .on("mouseover", function(event, d) {
        d3.select(this).attr("opacity", 1);
        
        const tooltip = d3.select("body").append("div")
          .attr("class", "tooltip")
          .style("opacity", 0)
          .style("position", "absolute")
          .style("background", "rgba(0, 0, 0, 0.8)")
          .style("color", "white")
          .style("padding", "8px")
          .style("border-radius", "4px")
          .style("font-size", "12px");

        tooltip.transition().duration(200).style("opacity", 1);
        tooltip.html(`${d.data.name}: ${d.data.value} titles`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function() {
        d3.select(this).attr("opacity", 0.7);
        d3.selectAll(".tooltip").remove();
      });

    leaf.append("text")
      .selectAll("tspan")
      .data(d => [d.data.name, d.data.value])
      .enter().append("tspan")
      .attr("x", 4)
      .attr("y", (d, i) => 13 + i * 10)
      .text((d, i) => i === 0 ? d : `(${d})`)
      .style("fill", "white")
      .style("font-size", "10px")
      .style("font-weight", "bold");

    // Title
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text("Genre Distribution Treemap");

  }, [data]);

  return (
    <Card className="p-6 bg-slate-800/50 border-slate-700">
      <svg ref={svgRef} width="400" height="280" className="w-full h-auto"></svg>
    </Card>
  );
};

const CountryMap = ({ data }: { data: ContentData[] }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 400;
    const height = 280;
    const margin = { top: 40, right: 20, bottom: 40, left: 60 };

    const countryCounts = d3.rollup(data, v => v.length, d => d.country);
    const countryData = Array.from(countryCounts, ([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 countries

    const x = d3.scaleBand()
      .domain(countryData.map(d => d.country))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(countryData, d => d.count) || 0])
      .range([height - margin.bottom, margin.top]);

    const color = d3.scaleSequential(d3.interpolateBlues)
      .domain([0, d3.max(countryData, d => d.count) || 0]);

    const g = svg.append("g");

    g.selectAll(".bar")
      .data(countryData)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.country) || 0)
      .attr("y", d => y(d.count))
      .attr("width", x.bandwidth())
      .attr("height", d => height - margin.bottom - y(d.count))
      .attr("fill", d => color(d.count))
      .on("mouseover", function(event, d) {
        d3.select(this).attr("opacity", 0.8);
        
        const tooltip = d3.select("body").append("div")
          .attr("class", "tooltip")
          .style("opacity", 0)
          .style("position", "absolute")
          .style("background", "rgba(0, 0, 0, 0.8)")
          .style("color", "white")
          .style("padding", "8px")
          .style("border-radius", "4px")
          .style("font-size", "12px");

        tooltip.transition().duration(200).style("opacity", 1);
        tooltip.html(`${d.country}: ${d.count} titles`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function() {
        d3.select(this).attr("opacity", 1);
        d3.selectAll(".tooltip").remove();
      });

    // Axes
    g.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("fill", "white")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    g.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("fill", "white");

    // Title
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 25)
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text("Top Countries by Content");

  }, [data]);

  return (
    <Card className="p-6 bg-slate-800/50 border-slate-700">
      <svg ref={svgRef} width="400" height="280" className="w-full h-auto"></svg>
    </Card>
  );
};

const AgeRatingStacked = ({ data }: { data: ContentData[] }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 40, right: 80, bottom: 60, left: 60 };
    const width = 400 - margin.left - margin.right;
    const height = 280 - margin.bottom - margin.top;

    const platforms = ['Netflix', 'Amazon Prime', 'Disney+'];
    const ageRatings = ['G', 'PG', 'PG-13', 'R', 'TV-MA', 'TV-14', 'TV-PG'];

    const stackData = platforms.map(platform => {
      const platformData = data.filter(d => d.platform === platform);
      const ageRatingCounts = d3.rollup(platformData, v => v.length, d => d.age_rating);
      
      return {
        platform,
        ...Object.fromEntries(ageRatings.map(rating => [rating, ageRatingCounts.get(rating) || 0]))
      };
    });

    const stack = d3.stack()
      .keys(ageRatings)
      .order(d3.stackOrderNone)
      .offset(d3.stackOffsetNone);

    const series = stack(stackData as any);

    const x = d3.scaleBand()
      .domain(platforms)
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(series, d => d3.max(d, d => d[1])) || 0])
      .range([height, 0]);

    const color = d3.scaleOrdinal(d3.schemeCategory10)
      .domain(ageRatings);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    g.selectAll("g")
      .data(series)
      .enter().append("g")
      .attr("fill", d => color(d.key))
      .selectAll("rect")
      .data(d => d)
      .enter().append("rect")
      .attr("x", (d, i) => x(platforms[i]) || 0)
      .attr("y", d => y(d[1]))
      .attr("height", d => y(d[0]) - y(d[1]))
      .attr("width", x.bandwidth())
      .on("mouseover", function(event, d) {
        const tooltip = d3.select("body").append("div")
          .attr("class", "tooltip")
          .style("opacity", 0)
          .style("position", "absolute")
          .style("background", "rgba(0, 0, 0, 0.8)")
          .style("color", "white")
          .style("padding", "8px")
          .style("border-radius", "4px")
          .style("font-size", "12px");

        tooltip.transition().duration(200).style("opacity", 1);
        tooltip.html(`Count: ${d[1] - d[0]}`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function() {
        d3.selectAll(".tooltip").remove();
      });

    // Axes
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("fill", "white");

    g.append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("fill", "white");

    // Legend
    const legend = g.append("g")
      .attr("transform", `translate(${width + 10}, 20)`);

    ageRatings.forEach((rating, i) => {
      const legendRow = legend.append("g")
        .attr("transform", `translate(0, ${i * 20})`);

      legendRow.append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", color(rating));

      legendRow.append("text")
        .attr("x", 20)
        .attr("y", 12)
        .style("fill", "white")
        .style("font-size", "12px")
        .text(rating);
    });

    // Title
    svg.append("text")
      .attr("x", width / 2 + margin.left)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text("Age Rating Distribution");

  }, [data]);

  return (
    <Card className="p-6 bg-slate-800/50 border-slate-700">
      <svg ref={svgRef} width="480" height="280" className="w-full h-auto"></svg>
    </Card>
  );
};

const DirectorWordCloud = ({ data }: { data: ContentData[] }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 400;
    const height = 280;
    const margin = { top: 40, right: 20, bottom: 40, left: 60 };

    const directorCounts = d3.rollup(data, v => v.length, d => d.director);
    const directorData = Array.from(directorCounts, ([director, count]) => ({ director, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const x = d3.scaleBand()
      .domain(directorData.map(d => d.director))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(directorData, d => d.count) || 0])
      .range([height - margin.bottom, margin.top]);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const g = svg.append("g");

    g.selectAll(".bar")
      .data(directorData)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.director) || 0)
      .attr("y", d => y(d.count))
      .attr("width", x.bandwidth())
      .attr("height", d => height - margin.bottom - y(d.count))
      .attr("fill", (d, i) => color(i.toString()))
      .on("mouseover", function(event, d) {
        d3.select(this).attr("opacity", 0.8);
        
        const tooltip = d3.select("body").append("div")
          .attr("class", "tooltip")
          .style("opacity", 0)
          .style("position", "absolute")
          .style("background", "rgba(0, 0, 0, 0.8)")
          .style("color", "white")
          .style("padding", "8px")
          .style("border-radius", "4px")
          .style("font-size", "12px");

        tooltip.transition().duration(200).style("opacity", 1);
        tooltip.html(`${d.director}: ${d.count} titles`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function() {
        d3.select(this).attr("opacity", 1);
        d3.selectAll(".tooltip").remove();
      });

    // Axes
    g.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("fill", "white")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    g.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("fill", "white");

    // Title
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 25)
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text("Top Directors");

  }, [data]);

  return (
    <Card className="p-6 bg-slate-800/50 border-slate-700">
      <svg ref={svgRef} width="400" height="280" className="w-full h-auto"></svg>
    </Card>
  );
};

const AwardsBubble = ({ data }: { data: ContentData[] }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 400;
    const height = 280;
    const margin = { top: 40, right: 30, bottom: 40, left: 30 };

    const awardData = data.filter(d => d.awards > 0);
    
    const x = d3.scaleLinear()
      .domain(d3.extent(awardData, d => d.imdb_rating) as [number, number])
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain(d3.extent(awardData, d => d.budget) as [number, number])
      .range([height - margin.bottom, margin.top]);

    const radius = d3.scaleSqrt()
      .domain([0, d3.max(awardData, d => d.awards) || 0])
      .range([2, 15]);

    const color = d3.scaleOrdinal()
      .domain(['Netflix', 'Amazon Prime', 'Disney+'])
      .range(['#e50914', '#00a8e1', '#113ccf']);

    const g = svg.append("g");

    // Add zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on("zoom", (event) => {
        const { transform } = event;
        g.attr("transform", transform);
      });

    svg.call(zoom as any);

    g.selectAll(".bubble")
      .data(awardData)
      .enter().append("circle")
      .attr("class", "bubble")
      .attr("cx", d => x(d.imdb_rating))
      .attr("cy", d => y(d.budget))
      .attr("r", d => radius(d.awards))
      .attr("fill", d => color(d.platform) as string)
      .attr("opacity", 0.7)
      .attr("stroke", "white")
      .attr("stroke-width", 1)
      .on("mouseover", function(event, d) {
        d3.select(this).attr("opacity", 1);
        
        const tooltip = d3.select("body").append("div")
          .attr("class", "tooltip")
          .style("opacity", 0)
          .style("position", "absolute")
          .style("background", "rgba(0, 0, 0, 0.8)")
          .style("color", "white")
          .style("padding", "8px")
          .style("border-radius", "4px")
          .style("font-size", "12px");

        tooltip.transition().duration(200).style("opacity", 1);
        tooltip.html(`${d.title}<br/>Rating: ${d.imdb_rating}<br/>Budget: $${d.budget}M<br/>Awards: ${d.awards}`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function() {
        d3.select(this).attr("opacity", 0.7);
        d3.selectAll(".tooltip").remove();
      });

    // Axes
    g.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("fill", "white");

    g.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("fill", "white");

    // Title
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 25)
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text("Award-Winning Content (Zoom enabled)");

  }, [data]);

  return (
    <Card className="p-6 bg-slate-800/50 border-slate-700">
      <svg ref={svgRef} width="400" height="280" className="w-full h-auto"></svg>
    </Card>
  );
};

// New charts requested
const GenrePopularityChart = ({ data }: { data: ContentData[] }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 40, right: 80, bottom: 60, left: 80 };
    const width = 400 - margin.left - margin.right;
    const height = 280 - margin.bottom - margin.top;

    const platforms = ['Netflix', 'Amazon Prime', 'Disney+'];
    const genres = Array.from(new Set(data.map(d => d.genre)));

    const genrePlatformData = d3.rollup(data, v => v.length, d => d.genre, d => d.platform);
    
    const chartData = genres.map(genre => {
      const genreData = { genre };
      platforms.forEach(platform => {
        genreData[platform] = genrePlatformData.get(genre)?.get(platform) || 0;
      });
      return genreData;
    }).sort((a, b) => d3.sum(platforms.map(p => b[p])) - d3.sum(platforms.map(p => a[p])));

    const x0 = d3.scaleBand()
      .domain(chartData.map(d => d.genre))
      .range([0, width])
      .padding(0.1);

    const x1 = d3.scaleBand()
      .domain(platforms)
      .range([0, x0.bandwidth()])
      .padding(0.05);

    const y = d3.scaleLinear()
      .domain([0, d3.max(chartData, d => d3.max(platforms.map(p => d[p]))) || 0])
      .range([height, 0]);

    const color = d3.scaleOrdinal()
      .domain(platforms)
      .range(['#e50914', '#00a8e1', '#113ccf']);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    chartData.forEach(d => {
      const genreGroup = g.append("g")
        .attr("transform", `translate(${x0(d.genre)},0)`);

      platforms.forEach(platform => {
        genreGroup.append("rect")
          .attr("x", x1(platform) || 0)
          .attr("y", y(d[platform]))
          .attr("width", x1.bandwidth())
          .attr("height", height - y(d[platform]))
          .attr("fill", color(platform) as string)
          .on("mouseover", function(event) {
            const tooltip = d3.select("body").append("div")
              .attr("class", "tooltip")
              .style("opacity", 0)
              .style("position", "absolute")
              .style("background", "rgba(0, 0, 0, 0.8)")
              .style("color", "white")
              .style("padding", "8px")
              .style("border-radius", "4px")
              .style("font-size", "12px");

            tooltip.transition().duration(200).style("opacity", 1);
            tooltip.html(`${platform}<br/>${d.genre}: ${d[platform]} titles`)
              .style("left", (event.pageX + 10) + "px")
              .style("top", (event.pageY - 28) + "px");
          })
          .on("mouseout", function() {
            d3.selectAll(".tooltip").remove();
          });
      });
    });

    // Axes
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x0))
      .selectAll("text")
      .style("fill", "white")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    g.append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("fill", "white");

    // Legend
    const legend = g.append("g")
      .attr("transform", `translate(${width + 10}, 20)`);

    platforms.forEach((platform, i) => {
      const legendRow = legend.append("g")
        .attr("transform", `translate(0, ${i * 20})`);

      legendRow.append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", color(platform));

      legendRow.append("text")
        .attr("x", 20)
        .attr("y", 12)
        .style("fill", "white")
        .style("font-size", "12px")
        .text(platform);
    });

    // Title
    svg.append("text")
      .attr("x", width / 2 + margin.left)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text("Genre Popularity by Platform");

  }, [data]);

  return (
    <Card className="p-6 bg-slate-800/50 border-slate-700">
      <svg ref={svgRef} width="480" height="280" className="w-full h-auto"></svg>
    </Card>
  );
};

const BudgetChart = ({ data }: { data: ContentData[] }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 40, right: 30, bottom: 60, left: 80 };
    const width = 400 - margin.left - margin.right;
    const height = 280 - margin.bottom - margin.top;

    const platforms = ['Netflix', 'Amazon Prime', 'Disney+'];
    const budgetData = platforms.map(platform => {
      const platformData = data.filter(d => d.platform === platform);
      const totalBudget = d3.sum(platformData, d => d.budget) / 1000; // Convert to billions
      return { platform, budget: totalBudget };
    });

    const x = d3.scaleBand()
      .domain(platforms)
      .range([0, width])
      .padding(0.3);

    const y = d3.scaleLinear()
      .domain([0, d3.max(budgetData, d => d.budget) || 0])
      .range([height, 0]);

    const color = d3.scaleOrdinal()
      .domain(platforms)
      .range(['#e50914', '#00a8e1', '#113ccf']);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    g.selectAll(".bar")
      .data(budgetData)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.platform) || 0)
      .attr("y", d => y(d.budget))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d.budget))
      .attr("fill", d => color(d.platform) as string)
      .on("mouseover", function(event, d) {
        d3.select(this).attr("opacity", 0.8);
        
        const tooltip = d3.select("body").append("div")
          .attr("class", "tooltip")
          .style("opacity", 0)
          .style("position", "absolute")
          .style("background", "rgba(0, 0, 0, 0.8)")
          .style("color", "white")
          .style("padding", "8px")
          .style("border-radius", "4px")
          .style("font-size", "12px");

        tooltip.transition().duration(200).style("opacity", 1);
        tooltip.html(`${d.platform}: $${d.budget.toFixed(1)}B`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function() {
        d3.select(this).attr("opacity", 1);
        d3.selectAll(".tooltip").remove();
      });

    // Value labels
    g.selectAll(".label")
      .data(budgetData)
      .enter().append("text")
      .attr("class", "label")
      .attr("x", d => (x(d.platform) || 0) + x.bandwidth() / 2)
      .attr("y", d => y(d.budget) - 5)
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "12px")
      .text(d => `$${d.budget.toFixed(1)}B`);

    // Axes
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("fill", "white");

    g.append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("fill", "white");

    // Title
    svg.append("text")
      .attr("x", width / 2 + margin.left)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text("Content Production Budget (Billions $)");

  }, [data]);

  return (
    <Card className="p-6 bg-slate-800/50 border-slate-700">
      <svg ref={svgRef} width="400" height="280" className="w-full h-auto"></svg>
    </Card>
  );
};

// Platform Insights Components
const NetflixInsights = ({ data }: { data: ContentData[] }) => {
  const netflixData = data.filter(d => d.platform === 'Netflix');
  const totalTitles = netflixData.length;
  const movies = netflixData.filter(d => d.type === 'Movie').length;
  const series = netflixData.filter(d => d.type === 'TV Show').length;
  const avgRating = totalTitles > 0 ? (netflixData.reduce((sum, d) => sum + d.imdb_rating, 0) / totalTitles).toFixed(1) : '0';

  return (
    <Card className="p-6 bg-gradient-to-r from-red-900/30 to-red-800/30 border-red-700">
      <h3 className="text-2xl font-bold text-red-400 mb-4 flex items-center">
        <span className="w-4 h-4 bg-red-500 rounded-full mr-3"></span>
        Netflix Insights & Analysis
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-white">{totalTitles}</div>
          <div className="text-red-300">Total Titles</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-400">{movies}</div>
          <div className="text-red-300">Movies</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-green-400">{series}</div>
          <div className="text-red-300">TV Shows</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-yellow-400">{avgRating}</div>
          <div className="text-red-300">Avg Rating</div>
        </div>
      </div>
      <div className="text-gray-300">
        <p className="mb-2"><strong>Key Strengths:</strong> Dominant in original content production with strong focus on international markets and diverse genres.</p>
        <p className="mb-2"><strong>Content Strategy:</strong> Heavy investment in original series and movies, particularly in drama and documentary genres.</p>
        <p><strong>Market Position:</strong> Global leader in streaming with extensive content library across multiple languages and regions.</p>
      </div>
    </Card>
  );
};

const AmazonPrimeInsights = ({ data }: { data: ContentData[] }) => {
  const amazonData = data.filter(d => d.platform === 'Amazon Prime');
  const totalTitles = amazonData.length;
  const movies = amazonData.filter(d => d.type === 'Movie').length;
  const series = amazonData.filter(d => d.type === 'TV Show').length;
  const avgRating = totalTitles > 0 ? (amazonData.reduce((sum, d) => sum + d.imdb_rating, 0) / totalTitles).toFixed(1) : '0';

  return (
    <Card className="p-6 bg-gradient-to-r from-blue-900/30 to-blue-800/30 border-blue-700">
      <h3 className="text-2xl font-bold text-blue-400 mb-4 flex items-center">
        <span className="w-4 h-4 bg-blue-500 rounded-full mr-3"></span>
        Amazon Prime Video Insights & Analysis
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-white">{totalTitles}</div>
          <div className="text-blue-300">Total Titles</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-400">{movies}</div>
          <div className="text-blue-300">Movies</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-green-400">{series}</div>
          <div className="text-blue-300">TV Shows</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-yellow-400">{avgRating}</div>
          <div className="text-blue-300">Avg Rating</div>
        </div>
      </div>
      <div className="text-gray-300">
        <p className="mb-2"><strong>Key Strengths:</strong> Strong in premium content with high production values and award-winning originals.</p>
        <p className="mb-2"><strong>Content Strategy:</strong> Focus on quality over quantity with significant investments in blockbuster series and films.</p>
        <p><strong>Market Position:</strong> Leverages Amazon's ecosystem integration and competes through exclusive content and technological innovation.</p>
      </div>
    </Card>
  );
};

const DisneyPlusInsights = ({ data }: { data: ContentData[] }) => {
  const disneyData = data.filter(d => d.platform === 'Disney+');
  const totalTitles = disneyData.length;
  const movies = disneyData.filter(d => d.type === 'Movie').length;
  const series = disneyData.filter(d => d.type === 'TV Show').length;
  const avgRating = totalTitles > 0 ? (disneyData.reduce((sum, d) => sum + d.imdb_rating, 0) / totalTitles).toFixed(1) : '0';

  return (
    <Card className="p-6 bg-gradient-to-r from-purple-900/30 to-purple-800/30 border-purple-700">
      <h3 className="text-2xl font-bold text-purple-400 mb-4 flex items-center">
        <span className="w-4 h-4 bg-purple-500 rounded-full mr-3"></span>
        Disney+ Insights & Analysis
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-white">{totalTitles}</div>
          <div className="text-purple-300">Total Titles</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-400">{movies}</div>
          <div className="text-purple-300">Movies</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-green-400">{series}</div>
          <div className="text-purple-300">TV Shows</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-yellow-400">{avgRating}</div>
          <div className="text-purple-300">Avg Rating</div>
        </div>
      </div>
      <div className="text-gray-300">
        <p className="mb-2"><strong>Key Strengths:</strong> Unmatched family-friendly content with strong brand recognition and franchise power.</p>
        <p className="mb-2"><strong>Content Strategy:</strong> Leverages Disney's vast IP portfolio including Marvel, Star Wars, and Pixar franchises.</p>
        <p><strong>Market Position:</strong> Dominant in family entertainment segment with expanding adult content through Star and Hulu integration.</p>
      </div>
    </Card>
  );
};

export default InteractiveDashboard;
