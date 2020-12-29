import { useEffect, createRef } from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';

// import createHistogram from '../../utils/graphs/letterHistogram';

export default function Letters({ singles }) {
  const ref = createRef();

  useEffect(() => {
    // createHistogram(singles, ref);
  }, [singles]);

  return (
    <div>
      <span data-tip data-for="ttpSingles">?</span>

      <div ref={ref} />
      <ReactTooltip id="ttpSingles" uuid="ttpSingles" type="dark" place="top" effect="solid">Not implemented yet!<br />Singles</ReactTooltip>

    </div>
  );
}
Letters.propTypes = {
  singles: PropTypes.object.isRequired,
};
