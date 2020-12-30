import * as d3 from 'd3';
import { calculateWPM } from '../Logic';

// Creates a histogram at the current reference.
const createHistogram = (ref, fifths, words) => {
  // Wipe previous graphs
  d3.select(ref.current).selectAll('*').remove();

  const wordList = words.split(' ');
  const l = Math.ceil(wordList.length / 5);

  // Grab wpm and each section's list of words.
  const data = [0, l, 2 * l, 3 * l, 4 * l]
    .map((i) => wordList.slice(i, i + l).join(' '))
    .map((section, i) => ({ time: calculateWPM(section.length, fifths[i]), text: section }));

  // Create an svg canvas upon which to paint your chart.
  const canvas = d3.select(ref.current)
    .append('svg')
    .attr('width', 500)
    .attr('height', 350);

  const margin = 70;
  const X = 500 - 2 * margin;
  const Y = 360 - 2 * margin;

  // Create a chart and set its margins.
  const chart = canvas.append('g').attr('transform', `translate(${margin}, ${margin})`);

  // Create X and Y axis

  const max = d3.max(data, (d) => d.time);
  const xScale = d3.scaleBand().range([0, X]).domain([1, 2, 3, 4, 5].map((i) => i)).padding(0.3);
  const yScale = d3.scaleLinear().range([Y, 0]).domain([0, max]);
  const yAxis = d3.axisLeft().scale(yScale).ticks(8).tickValues(d3.range(0, max + 1, max / 8));

  // Append initial X and Y axis' to your chart.
  chart.append('g').attr('transform', `translate(0, ${Y})`).call(d3.axisBottom(xScale));
  chart.append('g').call(yAxis);

  // Append a Y axis label and a title.
  canvas.append('text')
    .attr('x', (X / 2) + margin)
    .attr('y', 330)
    .attr('text-anchor', 'middle')
    .text('Segments');

  canvas.append('text')
    .attr('x', (X / 2) + margin)
    .attr('y', 25)
    .attr('text-anchor', 'middle')
    .text('Speed Over Time (wpm)');

  // Create a tooltip which hangs underneath the title.
  const tooltip = canvas.append('text')
    .attr('class', 'tooltip')
    .attr('x', (X / 2) + margin)
    .attr('y', 45)
    .attr('text-anchor', 'middle')
    .style('opacity', 0);

  // Append bars to graph.
  chart.selectAll('rect')
    .data(data).enter()
    .append('rect')
    .attr('x', (d, i) => xScale(i + 1))
    .attr('y', (d) => yScale(d.time))
    .attr('width', xScale.bandwidth())
    .attr('height', (d) => Y - yScale(d.time))
    .on('mouseenter', function a(e, d) {
      d3.select(this).attr('opacity', 0.5);
      tooltip.transition().duration(200).style('opacity', 0.9);
      tooltip.html(d.text).style('left', 30).style('top', -30);
    })
    .on('mouseleave', function b() {
      d3.select(this).attr('opacity', 1);
      tooltip.transition().duration(200).style('opacity', 0);
    });

  // Append labels to each bar in the graph.
  chart.selectAll()
    .append('g')
    .attr('class', 'bar-label')
    .data(data)
    .enter()
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('x', (d, i) => xScale(i + 1) + xScale.bandwidth() / 2)
    .attr('y', (d) => yScale(d.time) - 6)
    .text((d) => d.time);
};

export default createHistogram;
