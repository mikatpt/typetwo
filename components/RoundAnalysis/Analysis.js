import PropTypes from 'prop-types';

import Pairs from './Pairs';
import Histogram from './Histogram';

export default function RoundAnalysis({ stats }) {
  // render analysis only if we have a previous round in memory. Ergo, fifths and words must exist.
  return (stats[3] !== 0 && stats[4]) && (
    <div style={{ display: 'flex', width: '711px' }}>
      <Pairs pairs={stats[5]} />
      <Histogram fifths={stats[3]} words={stats[4]} />
    </div>
  );
}
RoundAnalysis.propTypes = { stats: PropTypes.array.isRequired };
