import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect, useRef, useMemo } from 'react';
import { ZoomIn, ZoomOut, Film, Tv, Filter } from 'lucide-react';
import * as d3 from 'd3';

interface NetflixShow {
  id: string;
  type: 'Movie' | 'TV Show' | 'Unknown';
  title: string;
  genre: string;
  year: number;
  rating: string;
  duration: number;
  country: string;
  dateAdded: string;
  description: string;
}

interface ChartProps {
  data: NetflixShow[];
  title: string;
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  zoom: number;
  drawFn: (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, data: NetflixShow[], width: number, height: number, margin: { top: number; right: number; bottom: number; left: number }) => void;
}

const Chart: React.FC<ChartProps> = ({ data, title, width = 600, height = 400, margin = { top: 50, right: 50, bottom: 50, left: 50 }, zoom, drawFn }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!data.length || !ref.current) return;

    const svg = d3.select(ref.current)
      .selectAll('svg')
      .data([null])
      .join('svg')
      .attr('width', width)
      .attr('height', height);

    const g = svg.select('g')
      .data([null])
      .join('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    drawFn(svg, data, width - margin.left - margin.right, height - margin.top - margin.bottom, margin);

    const zoomHandler = d3.zoom()
      .scaleExtent([0.5, 5])
      .on('zoom', (event) => {
        g.attr('transform', `translate(${event.transform.x + margin.left},${event.transform.y + margin.top}) scale(${event.transform.k})`);
      });

    svg.call(zoomHandler.transform, d3.zoomIdentity.scale(zoom));
    svg.call(zoomHandler);

    // Screenshot functionality
    svg.select('.screenshot')
      .data([null])
      .join('text')
      .attr('transform', `translate(${width - margin.right - 40},10)`)
      .attr('class', 'screenshot')
      .text('📷')
      .attr('fill', 'white')
      .attr('cursor', 'pointer')
      .on('click', () => {
        const serializer = new XMLSerializer();
        const svgStr = serializer.serializeToString(svg.node()!);
        const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title.toLowerCase().replace(/\s+/g, '_')}.svg`;
        a.click();
        URL.revokeObjectURL(url);
      });

    // Reset zoom
    svg.select('.reset-zoom')
      .data([null])
      .join('text')
      .attr('transform', `translate(${width - margin.right - 20},10)`)
      .attr('class', 'reset-zoom')
      .text('↻')
      .attr('fill', 'white')
      .attr('cursor', 'pointer')
      .on('click', () => svg.call(zoomHandler.transform, d3.zoomIdentity.scale(zoom)));

    return () => {
      d3.select(ref.current).selectAll('svg').remove();
    };
  }, [data, title, width, height, margin, drawFn, zoom]);

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={ref} style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }} />
      </CardContent>
    </Card>
  );
};

const NetflixDashboard: React.FC = () => {
  const [zoom, setZoom] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedShow, setSelectedShow] = useState<string>('none');
  const [netflixShows, setNetflixShows] = useState<NetflixShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchData = async (attempt = 0) => {
    const maxRetries = 3;
    try {
      const response = await fetch('/data/netflix_titles.csv');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const csvText = await response.text();
      const parsedData = d3.csvParse(csvText, (d: any): NetflixShow => ({
        id: d.show_id || `s${Math.random().toString(36).slice(2)}`,
        type: (d.type || 'Unknown') as 'Movie' | 'TV Show' | 'Unknown',
        title: d.title || 'Untitled',
        genre: d.listed_in?.split(', ')[0] || 'Unknown',
        year: parseInt(d.release_year) || 0,
        rating: d.rating || 'Not Rated',
        duration: (() => {
          const durationStr = d.duration || '';
          if (durationStr.includes('min')) return parseInt(durationStr.replace(' min', '')) || 0;
          if (durationStr.includes('Season') || durationStr.includes('Seasons')) return parseInt(durationStr.replace(' Season', '').replace(' Seasons', '')) || 0;
          return 0;
        })(),
        country: d.country || 'Unknown',
        dateAdded: d.date_added || 'Unknown',
        description: d.description || '',
      }));
      setNetflixShows(parsedData);
      setLoading(false);
      setError(null);
    } catch (err) {
      if (attempt < maxRetries) {
        setTimeout(() => fetchData(attempt + 1), 2000 * (attempt + 1));
        setRetryCount(attempt + 1);
      } else {
        setError(`Failed to load data after ${maxRetries} attempts. Please check your network or CSV file.`);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const genres = useMemo(() => ['All', ...Array.from(new Set(netflixShows.map(show => show.genre))).sort()], [netflixShows]);
  const years = useMemo(() => ['All', ...Array.from(new Set(netflixShows.map(show => show.year.toString()))).sort().reverse()], [netflixShows]);
  const types = ['All', 'Movie', 'TV Show'];

  const filteredShows = useMemo(() => {
    return netflixShows.filter(show =>
      (selectedGenre === 'All' || show.genre === selectedGenre) &&
      (selectedYear === 'All' || show.year.toString() === selectedYear) &&
      (selectedType === 'All' || show.type === selectedType)
    );
  }, [netflixShows, selectedGenre, selectedYear, selectedType]);

  const selectedShowData = selectedShow !== 'none' ? filteredShows.find(s => s.id === selectedShow) : null;

  const drawGenreDistribution = (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, data: NetflixShow[], width: number, height: number, margin: { top: number; right: number; bottom: number; left: number }) => {
    const genreCounts = d3.rollup(data, v => v.length, d => d.genre);
    const genreData = Array.from(genreCounts, ([genre, count]) => ({ genre, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
    const x = d3.scaleLinear().domain([0, d3.max(genreData, d => d.count)!]).range([0, width]);
    const y = d3.scaleBand().domain(genreData.map(d => d.genre)).range([0, height]).padding(0.1);

    g.selectAll('rect')
      .data(genreData)
      .join('rect')
      .attr('x', 0)
      .attr('y', d => y(d.genre)!)
      .attr('width', d => x(d.count))
      .attr('height', y.bandwidth())
      .attr('fill', '#DC2626')
      .on('mouseover', function (event, d) {
        d3.select(this).attr('fill', '#F472B6');
        d3.select('body').append('div')
          .attr('class', 'tooltip')
          .style('position', 'absolute')
          .style('background', '#1f2937')
          .style('border', '1px solid #374151')
          .style('border-radius', '4px')
          .style('padding', '5px')
          .style('color', 'white')
          .html(`Genre: ${d.genre}<br>Count: ${d.count}`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 20) + 'px');
      })
      .on('mouseout', () => d3.select('.tooltip').remove());

    g.selectAll('text')
      .data(genreData)
      .join('text')
      .attr('x', d => x(d.count) + 5)
      .attr('y', d => y(d.genre)! + y.bandwidth() / 2)
      .attr('dy', '0.35em')
      .text(d => `${d.genre} (${d.count})`)
      .attr('fill', 'white')
      .attr('font-size', '12px');

    svg.append('g').attr('transform', `translate(${margin.left},${height + margin.top})`)
      .call(d3.axisBottom(x).tickFormat(d3.format('.2s')))
      .selectAll('text').attr('fill', 'white');
    svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)
      .call(d3.axisLeft(y))
      .selectAll('text').attr('fill', 'white');
    svg.append('text')
      .attr('x', width / 2 + margin.left)
      .attr('y', margin.top / 2)
      .attr('text-anchor', 'middle')
      .text('Genre Distribution')
      .attr('fill', 'white')
      .attr('font-size', '16px');
  };

  const drawYearlyContentTypes = (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, data: NetflixShow[], width: number, height: number, margin: { top: number; right: number; bottom: number; left: number }) => {
    const yearlyData = d3.rollup(data, v => ({
      Movies: v.filter(d => d.type === 'Movie').length,
      'TV Shows': v.filter(d => d.type === 'TV Show').length
    }), d => d.year);
    const years = Array.from(yearlyData.keys()).sort((a, b) => a - b);
    const stackedData = years.map(year => ({
      year,
      Movies: yearlyData.get(year)?.Movies || 0,
      'TV Shows': yearlyData.get(year)?.['TV Shows'] || 0
    }));

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
    const x = d3.scaleLinear().domain([d3.min(years)!, d3.max(years)!]).range([0, width]);
    const y = d3.scaleLinear().domain([0, d3.max(stackedData, d => d.Movies + d['TV Shows'])!]).range([height, 0]);
    const stack = d3.stack().keys(['Movies', 'TV Shows']).order(d3.stackOrderNone).offset(d3.stackOffsetNone);
    const series = stack(stackedData as any);

    g.selectAll('path')
      .data(series)
      .join('path')
      .attr('fill', (d, i) => i === 0 ? '#DC2626' : '#F472B6')
      .attr('d', d3.area().x(d => x(d.data.year)).y0(d => y(d[0])).y1(d => y(d[1])))
      .on('mouseover', function (event, d) {
        d3.select(this).attr('opacity', 0.8);
        d3.select('body').append('div')
          .attr('class', 'tooltip')
          .style('position', 'absolute')
          .style('background', '#1f2937')
          .style('border', '1px solid #374151')
          .style('border-radius', '4px')
          .style('padding', '5px')
          .style('color', 'white')
          .html(`Type: ${d.key}<br>Year: ${d[0].data.year}<br>Count: ${d[0].data[d.key]}`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 20) + 'px');
      })
      .on('mouseout', () => d3.select('.tooltip').remove());

    svg.append('g').attr('transform', `translate(${margin.left},${height + margin.top})`)
      .call(d3.axisBottom(x).tickFormat(d3.format('d')))
      .selectAll('text').attr('fill', 'white');
    svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)
      .call(d3.axisLeft(y))
      .selectAll('text').attr('fill', 'white');
    svg.append('text')
      .attr('x', width / 2 + margin.left)
      .attr('y', margin.top / 2)
      .attr('text-anchor', 'middle')
      .text('Yearly Content Types')
      .attr('fill', 'white')
      .attr('font-size', '16px');
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2 - margin.top)
      .attr('y', margin.left - 40)
      .attr('text-anchor', 'middle')
      .text('Count')
      .attr('fill', 'white')
      .attr('font-size', '12px');
  };

  const drawAverageDurationTrend = (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, data: NetflixShow[], width: number, height: number, margin: { top: number; right: number; bottom: number; left: number }) => {
    const yearlyDuration = d3.rollup(data, v => d3.mean(v, d => d.duration) || 0, d => d.year);
    const durationData = Array.from(yearlyDuration).sort((a, b) => a[0] - b[0]);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
    const x = d3.scaleLinear().domain([d3.min(durationData, d => d[0])!, d3.max(durationData, d => d[0])!]).range([0, width]);
    const y = d3.scaleLinear().domain([0, d3.max(durationData, d => d[1])!]).range([height, 0]);
    const line = d3.line().x(d => x(d[0])).y(d => y(d[1]));

    g.append('path')
      .datum(durationData)
      .attr('fill', 'none')
      .attr('stroke', '#DC2626')
      .attr('stroke-width', 2)
      .attr('d', line)
      .on('mouseover', () => d3.select(this).attr('stroke', '#F472B6'))
      .on('mouseout', () => d3.select(this).attr('stroke', '#DC2626'));

    svg.append('g').attr('transform', `translate(${margin.left},${height + margin.top})`)
      .call(d3.axisBottom(x).tickFormat(d3.format('d')))
      .selectAll('text').attr('fill', 'white');
    svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)
      .call(d3.axisLeft(y))
      .selectAll('text').attr('fill', 'white');
    svg.append('text')
      .attr('x', width / 2 + margin.left)
      .attr('y', margin.top / 2)
      .attr('text-anchor', 'middle')
      .text('Average Duration Trend')
      .attr('fill', 'white')
      .attr('font-size', '16px');
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2 - margin.top)
      .attr('y', margin.left - 40)
      .attr('text-anchor', 'middle')
      .text('Duration (min)')
      .attr('fill', 'white')
      .attr('font-size', '12px');
  };

  const drawContentTypeProportion = (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, data: NetflixShow[], width: number, height: number, margin: { top: number; right: number; bottom: number; left: number }) => {
    const typeCounts = d3.rollup(data, v => v.length, d => d.type);
    const typeData = Array.from(typeCounts, ([type, count]) => ({ type, count }))
      .filter(d => d.type !== 'Unknown');

    const g = svg.append('g').attr('transform', `translate(${width / 2 + margin.left},${height / 2 + margin.top})`);
    const radius = Math.min(width, height) / 2;
    const pie = d3.pie<{ type: string; count: number }>().value(d => d.count);
    const arc = d3.arc().innerRadius(0).outerRadius(radius);
    const color = d3.scaleOrdinal<string>()
      .domain(typeData.map(d => d.type))
      .range(['#DC2626', '#F472B6']);

    g.selectAll('path')
      .data(pie(typeData))
      .join('path')
      .attr('d', arc as any)
      .attr('fill', d => color(d.data.type))
      .on('mouseover', function (event, d) {
        d3.select(this).attr('opacity', 0.8);
        d3.select('body').append('div')
          .attr('class', 'tooltip')
          .style('position', 'absolute')
          .style('background', '#1f2937')
          .style('border', '1px solid #374151')
          .style('border-radius', '4px')
          .style('padding', '5px')
          .style('color', 'white')
          .html(`Type: ${d.data.type}<br>Count: ${d.data.count}<br>Percentage: ${((d.data.count / d3.sum(typeData, t => t.count)) * 100).toFixed(1)}%`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 20) + 'px');
      })
      .on('mouseout', () => d3.select('.tooltip').remove());

    g.selectAll('text')
      .data(pie(typeData))
      .join('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .text(d => `${d.data.type} (${((d.data.count / d3.sum(typeData, t => t.count)) * 100).toFixed(1)}%)`)
      .attr('fill', 'white')
      .attr('font-size', '12px');

    svg.append('text')
      .attr('x', width / 2 + margin.left)
      .attr('y', margin.top / 2)
      .attr('text-anchor', 'middle')
      .text('Content Type Proportion')
      .attr('fill', 'white')
      .attr('font-size', '16px');
  };

  const drawCountryDistribution = (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, data: NetflixShow[], width: number, height: number, margin: { top: number; right: number; bottom: number; left: number }) => {
    const countryCounts = d3.rollup(data, v => v.length, d => d.country);
    const countryData = Array.from(countryCounts, ([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
    const x = d3.scaleLinear().domain([0, d3.max(countryData, d => d.count)!]).range([0, width]);
    const y = d3.scaleBand().domain(countryData.map(d => d.country)).range([0, height]).padding(0.1);

    g.selectAll('rect')
      .data(countryData)
      .join('rect')
      .attr('x', 0)
      .attr('y', d => y(d.country)!)
      .attr('width', d => x(d.count))
      .attr('height', y.bandwidth())
      .attr('fill', '#DC2626')
      .on('mouseover', function (event, d) {
        d3.select(this).attr('fill', '#F472B6');
        d3.select('body').append('div')
          .attr('class', 'tooltip')
          .style('position', 'absolute')
          .style('background', '#1f2937')
          .style('border', '1px solid #374151')
          .style('border-radius', '4px')
          .style('padding', '5px')
          .style('color', 'white')
          .html(`Country: ${d.country}<br>Count: ${d.count}`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 20) + 'px');
      })
      .on('mouseout', () => d3.select('.tooltip').remove());

    g.selectAll('text')
      .data(countryData)
      .join('text')
      .attr('x', d => x(d.count) + 5)
      .attr('y', d => y(d.country)! + y.bandwidth() / 2)
      .attr('dy', '0.35em')
      .text(d => `${d.country} (${d.count})`)
      .attr('fill', 'white')
      .attr('font-size', '12px');

    svg.append('g').attr('transform', `translate(${margin.left},${height + margin.top})`)
      .call(d3.axisBottom(x).tickFormat(d3.format('.2s')))
      .selectAll('text').attr('fill', 'white');
    svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)
      .call(d3.axisLeft(y))
      .selectAll('text').attr('fill', 'white');
    svg.append('text')
      .attr('x', width / 2 + margin.left)
      .attr('y', margin.top / 2)
      .attr('text-anchor', 'middle')
      .text('Country Distribution')
      .attr('fill', 'white')
      .attr('font-size', '16px');
  };

  const drawRatingByContentType = (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, data: NetflixShow[], width: number, height: number, margin: { top: number; right: number; bottom: number; left: number }) => {
    const ratingTypeCounts = d3.rollup(data, v => v.length, d => d.rating, d => d.type);
    const ratings = Array.from(new Set(data.map(d => d.rating))).sort();
    const ratingTypeData = ratings.map(rating => ({
      rating,
      Movie: ratingTypeCounts.get(rating)?.get('Movie') || 0,
      'TV Show': ratingTypeCounts.get(rating)?.get('TV Show') || 0
    }));

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
    const x0 = d3.scaleBand().domain(ratings).range([0, width]).padding(0.2);
    const x1 = d3.scaleBand().domain(['Movie', 'TV Show']).range([0, x0.bandwidth()]).padding(0.05);
    const y = d3.scaleLinear().domain([0, d3.max(ratingTypeData, d => Math.max(d.Movie, d['TV Show']))!]).range([height, 0]);

    const gBars = g.selectAll('g')
      .data(ratingTypeData)
      .join('g')
      .attr('transform', d => `translate(${x0(d.rating)},0)`);

    gBars.selectAll('rect')
      .data(d => [
        { type: 'Movie', value: d.Movie },
        { type: 'TV Show', value: d['TV Show'] }
      ])
      .join('rect')
      .attr('x', d => x1(d.type)!)
      .attr('y', d => y(d.value))
      .attr('width', x1.bandwidth())
      .attr('height', d => height - y(d.value))
      .attr('fill', d => d.type === 'Movie' ? '#DC2626' : '#F472B6')
      .on('mouseover', function (event, d) {
        d3.select(this).attr('opacity', 0.8);
        d3.select('body').append('div')
          .attr('class', 'tooltip')
          .style('position', 'absolute')
          .style('background', '#1f2937')
          .style('border', '1px solid #374151')
          .style('border-radius', '4px')
          .style('padding', '5px')
          .style('color', 'white')
          .html(`Type: ${d.type}<br>Rating: ${d3.select(this.parentNode).datum().rating}<br>Count: ${d.value}`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 20) + 'px');
      })
      .on('mouseout', () => d3.select('.tooltip').remove());

    svg.append('g').attr('transform', `translate(${margin.left},${height + margin.top})`)
      .call(d3.axisBottom(x0))
      .selectAll('text').attr('fill', 'white').attr('transform', 'rotate(-45)').attr('text-anchor', 'end');
    svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)
      .call(d3.axisLeft(y))
      .selectAll('text').attr('fill', 'white');
    svg.append('text')
      .attr('x', width / 2 + margin.left)
      .attr('y', margin.top / 2)
      .attr('text-anchor', 'middle')
      .text('Rating by Content Type')
      .attr('fill', 'white')
      .attr('font-size', '16px');
  };

  const drawContentAdditionTrend = (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, data: NetflixShow[], width: number, height: number, margin: { top: number; right: number; bottom: number; left: number }) => {
    const additionCounts = d3.rollup(
      data.filter(d => d.dateAdded !== 'Unknown'),
      v => v.length,
      d => new Date(d.dateAdded).getFullYear()
    );
    const additionData = Array.from(additionCounts, ([year, count]) => ({ year, count }))
      .sort((a, b) => a.year - b.year);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
    const x = d3.scaleLinear().domain([d3.min(additionData, d => d.year)!, d3.max(additionData, d => d.year)!]).range([0, width]);
    const y = d3.scaleLinear().domain([0, d3.max(additionData, d => d.count)!]).range([height, 0]);
    const line = d3.line().x(d => x(d.year)).y(d => y(d.count));

    g.append('path')
      .datum(additionData)
      .attr('fill', 'none')
      .attr('stroke', '#DC2626')
      .attr('stroke-width', 2)
      .attr('d', line)
      .on('mouseover', () => d3.select(this).attr('stroke', '#F472B6'))
      .on('mouseout', () => d3.select(this).attr('stroke', '#DC2626'));

    svg.append('g').attr('transform', `translate(${margin.left},${height + margin.top})`)
      .call(d3.axisBottom(x).tickFormat(d3.format('d')))
      .selectAll('text').attr('fill', 'white');
    svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)
      .call(d3.axisLeft(y))
      .selectAll('text').attr('fill', 'white');
    svg.append('text')
      .attr('x', width / 2 + margin.left)
      .attr('y', margin.top / 2)
      .attr('text-anchor', 'middle')
      .text('Content Addition Trend')
      .attr('fill', 'white')
      .attr('font-size', '16px');
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2 - margin.top)
      .attr('y', margin.left - 40)
      .attr('text-anchor', 'middle')
      .text('Titles Added')
      .attr('fill', 'white')
      .attr('font-size', '12px');
  };

  if (loading) return <div className="text-white">Loading data... {retryCount > 0 && `(Retry ${retryCount}/3)`}</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <div className="space-y-6 animate-fade-in p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-700 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
            N
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Netflix Analytics Dashboard</h2>
            <p className="text-gray-400">{netflixShows.length.toLocaleString()}+ titles across {Array.from(new Set(netflixShows.map(show => show.country))).length}+ countries</p>
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

      {/* Search & Filter */}
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
              <Badge variant="secondary" className="bg-red-500/20 text-red-400">
                Netflix Original
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div>
                <span className="text-red-400 text-sm font-medium">Release Year</span>
                <p className="text-white font-semibold">{selectedShowData.year}</p>
              </div>
              <div>
                <span className="text-red-400 text-sm font-medium">Duration</span>
                <p className="text-white font-semibold">{selectedShowData.duration} {selectedShowData.type === 'Movie' ? 'min' : 'seasons'}</p>
              </div>
              <div>
                <span className="text-red-400 text-sm font-medium">Genre</span>
                <p className="text-white font-semibold">{selectedShowData.genre}</p>
              </div>
              <div>
                <span className="text-red-400 text-sm font-medium">Rating</span>
                <p className="text-white font-semibold">{selectedShowData.rating}</p>
              </div>
              <div>
                <span className="text-red-400 text-sm font-medium">Date Added</span>
                <p className="text-white font-semibold">{selectedShowData.dateAdded}</p>
              </div>
              <div>
                <span className="text-red-400 text-sm font-medium">Description</span>
                <p className="text-white font-semibold">{selectedShowData.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-red-600 to-red-700 border-0 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Total Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{filteredShows.length.toLocaleString()}</div>
            <div className="text-sm opacity-70">Movies & Series</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 text-white">
          <CardHeader className="pb-2 flex flex-row items-center space-y-0">
            <CardTitle className="text-sm font-medium opacity-90">Movies</CardTitle>
            <Film className="h-4 w-4 ml-auto opacity-70" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-400">{filteredShows.filter(show => show.type === 'Movie').length.toLocaleString()}</div>
            <div className="text-sm opacity-70">{filteredShows.length ? ((filteredShows.filter(show => show.type === 'Movie').length / filteredShows.length) * 100).toFixed(1) : 0}%</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 text-white">
          <CardHeader className="pb-2 flex flex-row items-center space-y-0">
            <CardTitle className="text-sm font-medium opacity-90">TV Shows</CardTitle>
            <Tv className="h-4 w-4 ml-auto opacity-70" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-400">{filteredShows.filter(show => show.type === 'TV Show').length.toLocaleString()}</div>
            <div className="text-sm opacity-70">{filteredShows.length ? ((filteredShows.filter(show => show.type === 'TV Show').length / filteredShows.length) * 100).toFixed(1) : 0}%</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Global Reach</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-400">{Array.from(new Set(filteredShows.map(show => show.country))).length}</div>
            <div className="text-sm opacity-70">Countries</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Chart key="genre-distribution" data={filteredShows} title="Genre Distribution" zoom={zoom} drawFn={drawGenreDistribution} />
        <Chart key="yearly-content-types" data={filteredShows} title="Yearly Content Types" zoom={zoom} drawFn={drawYearlyContentTypes} />
        <Chart key="average-duration-trend" data={filteredShows} title="Average Duration Trend" zoom={zoom} drawFn={drawAverageDurationTrend} />
        <Chart key="content-type-proportion" data={filteredShows} title="Content Type Proportion" zoom={zoom} drawFn={drawContentTypeProportion} />
        <Chart key="country-distribution" data={filteredShows} title="Country Distribution" zoom={zoom} drawFn={drawCountryDistribution} />
        <Chart key="rating-by-content-type" data={filteredShows} title="Rating by Content Type" zoom={zoom} drawFn={drawRatingByContentType} />
        <Chart key="content-addition-trend" data={filteredShows} title="Content Addition Trend" zoom={zoom} drawFn={drawContentAdditionTrend} />
      </div>

      {/* Show Duration Distribution */}
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Show Duration Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}>
            <div className="space-y-4">
              {[
                { duration: '< 30 min', percentage: 10, count: 1350 },
                { duration: '30-60 min', percentage: 70, count: 9450 },
                { duration: '60-90 min', percentage: 15, count: 2025 },
                { duration: '> 90 min', percentage: 5, count: 675 }
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
          <CardTitle className="text-white">About Netflix Originals</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300 text-sm space-y-2">
          <p>"Stranger Things" revolutionized Netflix's original content strategy, becoming a global phenomenon with its nostalgic 80s setting and supernatural storyline.</p>
          <p>"The Crown" showcases Netflix's commitment to high-quality historical dramas, earning critical acclaim and multiple awards for its portrayal of the British Royal Family.</p>
          <p>"Squid Game" became Netflix's most-watched series, demonstrating the platform's global reach and the power of international content.</p>
          <Badge variant="secondary" className="mt-2 bg-red-500/20 text-red-400">Netflix Originals</Badge>
        </CardContent>
      </Card>
    </div>
  );
};

export default NetflixDashboard;