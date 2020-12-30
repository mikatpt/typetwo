import { useEffect, createRef } from 'react';
import PropTypes from 'prop-types';

import createHistogram from '../../utils/graphs/letterHistogram';

export default function Capitals({ singles }) {
  const ref = createRef();

  useEffect(() => {
    createHistogram(ref, singles, true);
  }, [singles]);

  return (<div ref={ref} className="svg-container" />);
}
Capitals.propTypes = { singles: PropTypes.object.isRequired };
