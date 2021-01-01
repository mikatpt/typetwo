import { useState, useEffect, createRef } from 'react';
import PropTypes from 'prop-types';

import createHistogram from '../../utils/graphs/letterHistogram';

export default function Letters({ letterSet, capital }) {
  const [option, setOption] = useState('0');
  const ref = createRef();
  const change = (e) => setOption(e.target.value);

  useEffect(() => {
    createHistogram(ref, letterSet, capital, option);
  }, [letterSet, option]);

  return (
    <div style={{ position: 'relative' }}>
      <select className="select" value={option} onChange={change}>
        <option value="0">Sort Alphabetical</option>
        <option value="1">Sort by speed</option>
        <option value="2">Sort by frequency</option>
      </select>

      <div ref={ref} className="svg-container" />
    </div>
  );
}
Letters.propTypes = { letterSet: PropTypes.object.isRequired, capital: PropTypes.bool.isRequired };
