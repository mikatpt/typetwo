import * as d3 from 'd3';
import { calculateWPM } from '../Logic';

const createHistogram = (ref, chars, capital = false) => {
  d3.select(ref.current).selectAll('*').remove();

  const str = capital ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' : 'abcdefghijklmnopqrstuvwxyz';

  const data = str.split('')
    .map((char) => (chars[char]
      ? ({ char, wpm: calculateWPM(chars[char].total, chars[char].time), total: chars[char].total })
      : { char, wpm: 0, total: 0 }));

  // Create canvas
  const width = 800;
  const height = 400;

  const canvas = d3.select(ref.current)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    // .attr('preserveAspectRatio', 'xMinYMin meet')
    // .attr('viewBox', `0 0 ${width} ${height}`)
    .classed('svg-content-responsive', true);

  // Create chart
  const margin = 40;
  const chart = canvas.append('g').attr('transform', `translate(${margin}, ${margin})`);

  // Create X and Y axis
  const x = width - 2 * margin;
  const y = height - 2 * margin;

  const max = d3.max(data, (d) => d.wpm);

  const xScale = d3.scaleBand().range([0, x]).domain(data.map((i) => i.char)).padding(0.15);
  const yScale = d3.scaleLinear().range([y, 0]).domain([0, max]);

  const yAxis = d3.axisLeft().scale(yScale).ticks(8).tickValues(d3.range(0, max + 1, max / 8));

  // Append axes to chart
  chart.append('g').attr('transform', `translate(0, ${y})`).call(d3.axisBottom(xScale));
  chart.append('g').call(yAxis);

  // Title the chart
  const casing = capital ? 'Uppercase' : 'Lowercase';
  canvas.append('text')
    .attr('x', (x / 2) + margin)
    .attr('y', 20)
    .attr('text-anchor', 'middle')
    .attr('font-weight', 'bold')
    .text(`Average Speed, ${casing} Letters`);

  // Create tooltip for bars
  const tooltip = d3.select(ref.current).append('div').attr('class', 'tooltip');

  // Append bars to graph
  chart.selectAll('rect')
    .data(data).enter()
    .append('rect')
    .attr('x', (d) => xScale(d.char))
    .attr('y', (d) => yScale(d.wpm))
    .attr('width', xScale.bandwidth())
    .attr('height', (d) => y - yScale(d.wpm))
    .attr('fill', 'rgb(5, 65, 128)')
    .on('mouseenter', function a(e, d) {
      tooltip.html(`${d.wpm}wpm<br/>Total: ${d.total}`).transition().duration(200).style('opacity', 1);
      d3.select(this).attr('opacity', 0.8);
    })
    .on('mousemove', (e, d) => {
      tooltip.style('left', `${d3.pointer(e)[0]}px`).style('top', `${yScale(d.wpm)}px`);
    })
    .on('mouseleave', function c() {
      tooltip.transition().duration(500).style('opacity', 0);
      d3.select(this).attr('opacity', 1);
    });
};
export default createHistogram;
