import { useEffect, createRef } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

/*
To Do:
On hover, display the text block.
*/

export default function RoundHistogram({ fifths, words }) {
  const ref = createRef();

  useEffect(() => {
    d3.select(ref.current).selectAll('*').remove();

    const wordList = words.split(' ');
    const times = [0, 6, 12, 18, 24].map((i) => wordList.slice(i, i + 6))
      .map((section, i) => {
        const chars = section.join(' ').length / 5;
        const time = (chars * (60000.0 / fifths[i])).toFixed(2);
        return Number(time);
      });
    console.log('fifths', fifths);
    console.log('times', times);

    const size = 400;
    const sizeY = 200;
    const scale = 1;
    const svg = d3.select(ref.current)
      .append('svg')
      .attr('width', size)
      .attr('height', sizeY);
    const width = 75;
    svg.selectAll('rect')
      .data(times).enter()
      .append('rect')
      .attr('x', (d, i) => 5 + i * (width + 5))
      .attr('y', (d) => sizeY - d * scale)
      .attr('width', width)
      .attr('height', (d) => d * scale)
      .attr('fill', 'teal');
    svg.selectAll('text')
      .data(times).enter()
      .append('text')
      .attr('x', (d, i) => 17 + i * (width + 5))
      .attr('y', (d) => sizeY - d * scale - 10)
      .text((d) => d);
  }, [fifths]);

  return (
    <div>
      <h1>Speed Over Time</h1>
      <div ref={ref} />
    </div>
  );
}

RoundHistogram.propTypes = {
  fifths: PropTypes.arrayOf(PropTypes.number).isRequired,
  words: PropTypes.string.isRequired,
};
