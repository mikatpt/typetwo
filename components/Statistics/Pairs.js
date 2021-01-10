import { useState, useEffect, createRef } from 'react';
import PropTypes from 'prop-types';

import createHistogram from '../../utils/graphs/pairHistogram';

export default function Pairs({ pairs }) {
  const [option, setOption] = useState('0');
  const ref = createRef();
  const change = (e) => setOption(e.target.value);

  useEffect(() => {
    createHistogram(ref, pairs, option);
  }, [pairs, option]);

  return (
    <div style={{ position: 'relative' }}>
      <select className="select" value={option} onChange={change}>
        <option value="0">Sort by Speed</option>
        <option value="1">Sort by Frequency</option>
      </select>
      <div ref={ref} className="svg-container" />

    </div>
  );
}
Pairs.propTypes = { pairs: PropTypes.object.isRequired };
