import { useEffect, createRef } from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';

// import createHistogram from '../../utils/graphs/pairHistogram';

export default function Pairs({ pairs }) {
  const ref = createRef();

  useEffect(() => {
    // createHistogram(pairs, ref);
  }, [pairs]);

  return (
    <div>
      <span data-tip data-for="ttpPairs">?</span>

      <div ref={ref} />
      <ReactTooltip id="ttpPairs" uuid="ttpPairs" type="dark" place="top" effect="solid">Not implemented yet!<br />Doubles</ReactTooltip>

    </div>
  );
}
Pairs.propTypes = {
  pairs: PropTypes.object.isRequired,
};
