import * as d3 from 'd3';
import { calculateWPM } from '../Logic';

const createHistogram = (ref, chars, capital, option) => {
  d3.select(ref.current).selectAll('*').remove();

  const str = capital ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' : 'abcdefghijklmnopqrstuvwxyz';

  const alphabetical = str.split('')
    .map((char) => (chars[char]
      ? ({
        char,
        wpm: calculateWPM(chars[char].total, chars[char].time),
        total: chars[char].total,
        errors: Number(((chars[char].errors * 100) / chars[char].total).toFixed(2)),
      }) : { char, wpm: 0, total: 0, errors: 0 }));

  const sorting = option === '2' ? ((a, b) => (a.total <= b.total ? 1 : -1))
    : ((a, b) => (a.wpm <= b.wpm ? -1 : 1));

  const data = option === '0' ? alphabetical : alphabetical.sort(sorting);

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
  const casing = capital ? 'UPPERCASE' : 'LOWERCASE';
  canvas.append('text')
    .attr('x', (x / 2) + margin)
    .attr('y', 20)
    .attr('text-anchor', 'middle')
    .attr('font-weight', 'bold')
    .text(`AVERAGE SPEED, ${casing} LETTERS`);

  // Define tooltip. Allow hovering over tooltip.
  const tooltip = d3.select(ref.current).append('div').attr('class', 'tooltip');

  const uuid = capital ? 'caps' : 'lowers';
  canvas.on('touchmove mousemove', function b(event) {
    const location = d3.pointer(event, this)[0];

    // Bisector returns a func which finds the closest index to a given coordinate
    // Not sure why it doesn't account for margins, so we do so manually
    const findIdx = d3.bisector((d) => xScale(d.char) + margin).left;
    const current = findIdx(data, location) - 1;

    if (current > -1 && location < width - margin) {
      const d = data[current];

      chart.selectAll('rect').attr('opacity', 1);
      d3.select(`#${uuid}_${current}`).attr('opacity', 0.8);

      tooltip.html(`Letter: ${d.char}<br/>Speed: ${d.wpm}wpm<br/>Total: ${d.total}<br/>Error Rate: ${d.errors}%`)
        .style('left', `${xScale(d.char)}px`)
        .style('top', `${yScale(d.wpm) - 20}px`)
        .style('opacity', 1);
    }
  }).on('touchend mouseleave', () => {
    chart.selectAll('rect').attr('opacity', 1);
    tooltip.style('opacity', 0);
  });

  // Append bars to graph
  chart.selectAll('rect')
    .data(data).enter()
    .append('rect')
    .attr('x', (d) => xScale(d.char))
    .attr('y', (d) => yScale(d.wpm))
    .attr('width', xScale.bandwidth())
    .attr('height', (d) => y - yScale(d.wpm))
    .attr('fill', 'rgb(225, 109, 39)')
    .attr('id', (d, i) => `${uuid}_${i}`);
};
export default createHistogram;
