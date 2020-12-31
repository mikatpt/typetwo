import * as d3 from 'd3';
import { calculateWPM } from '../Logic';

const createHistogram = (ref, chars, option) => {
  d3.select(ref.current).selectAll('*').remove();

  const sorting = option === '1' ? ((a, b) => (a.total <= b.total ? 1 : -1))
    : ((a, b) => (a.wpm <= b.wpm ? -1 : 1));

  const data = Object.keys(chars)
    .map((pair) => (
      { pair, total: chars[pair].total, wpm: calculateWPM(chars[pair].total, chars[pair].time) }))
    .sort(sorting);

  // Canvas
  const width = 800;
  const height = 400;

  const canvas = d3.select(ref.current)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .classed('svg-content-responsive', true);

  // Chart
  const margin = 40;
  const chart = canvas.append('g').attr('transform', `translate(${margin}, ${margin})`);

  // X, Y axis
  const x = width - 2 * margin;
  const y = height - 2 * margin;
  const max = d3.max(data, (d) => d.wpm);

  const xScale = d3.scaleBand().range([0, x]).domain(data.map((d) => d.pair)).padding(0.1);
  const yScale = d3.scaleLinear().range([y, 0]).domain([0, max]);

  const xAxis = d3.axisBottom(xScale).tickValues([]);
  const yAxis = d3.axisLeft().scale(yScale).ticks(8).tickValues(d3.range(0, max + 1, max / 8));

  chart.append('g').attr('transform', `translate(0, ${y})`).call(xAxis);
  chart.append('g').call(yAxis);

  // Axis label
  canvas.append('text')
    .attr('x', (x / 2) + margin)
    .attr('y', height - 10)
    .attr('text-anchor', 'middle')
    .text('Pairs');

  // Graph title
  canvas.append('text')
    .attr('x', (x / 2) + margin)
    .attr('y', 20)
    .attr('text-anchor', 'middle')
    .attr('font-weight', 'bold')
    .text('Pair speed');

  // Create tooltip
  const tooltip = d3.select(ref.current).append('div').attr('class', 'tooltip');

  // Hovering on OR above bars will display data.
  canvas.on('touchmove mousemove', function b(event) {
    const location = d3.pointer(event, this)[0];

    // Bisector returns a func which finds the closest index to a given coordinate
    // Not sure why it doesn't account for margins, so we do so manually
    const findIdx = d3.bisector((d) => xScale(d.pair) + margin).left;
    const current = findIdx(data, location) - 1;

    if (current > -1 && location < width - margin) {
      const d = data[current];

      chart.selectAll('rect').attr('opacity', 1);
      d3.select(`#pair_${current}`).attr('opacity', 0.8);

      tooltip.html(`Pair: ${d.pair}<br/>Speed: ${d.wpm}wpm<br/>Total: ${d.total}`)
        .style('left', `${xScale(d.pair)}px`)
        .style('top', `${yScale(d.wpm) - 30}px`)
        .style('opacity', 1);
    }
  }).on('touchend mouseleave', () => {
    chart.selectAll('rect').attr('opacity', 1);
    tooltip.style('opacity', 0);
  });

  // Add bars
  chart.selectAll('rect')
    .data(data).enter()
    .append('rect')
    .attr('x', (d) => xScale(d.pair))
    .attr('y', (d) => yScale(d.wpm))
    .attr('width', xScale.bandwidth())
    .attr('height', (d) => y - yScale(d.wpm))
    .attr('fill', 'rgb(5, 65, 128)')
    .attr('id', (d, i) => `pair_${i}`);
};
export default createHistogram;
