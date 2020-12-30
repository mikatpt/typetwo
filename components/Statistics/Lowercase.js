import { useEffect, createRef } from 'react';
import PropTypes from 'prop-types';

import createHistogram from '../../utils/graphs/letterHistogram';

export default function Lowercase({ singles }) {
  const ref = createRef();

  useEffect(() => {
    createHistogram(ref, singles);
  }, [singles]);

  return (<div ref={ref} className="svg-container" />);
}
Lowercase.propTypes = { singles: PropTypes.object.isRequired };
