import { useEffect, createRef } from 'react';
import PropTypes from 'prop-types';

import createHistogram from '../../utils/graphs/pairHistogram';

export default function Pairs({ pairs }) {
  const ref = createRef();

  useEffect(() => {
    createHistogram(ref, pairs);
  }, [pairs]);

  return (<div ref={ref} className="svg-container" />);
}
Pairs.propTypes = { pairs: PropTypes.object.isRequired };
