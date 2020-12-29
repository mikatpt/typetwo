import { useEffect, createRef } from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';

import createHistogram from '../../utils/graphs/createHistogram';
import styles from '../../styles/RoundAnalysis/Histogram.module.css';

export default function RoundHistogram({ fifths, words }) {
  const ref = createRef();

  useEffect(() => {
    createHistogram(ref, fifths, words);
  }, [fifths]);

  return (
    <div className={styles.graph}>
      <span className={styles.help} data-tip data-for="ttpHist">?</span>

      <div ref={ref} />
      <ReactTooltip id="ttpHist" uuid="ttpHist" type="dark" place="top" effect="solid">Your speed at different points of the text.<br />Hover over the bars for exact text!</ReactTooltip>

    </div>
  );
}
RoundHistogram.propTypes = {
  fifths: PropTypes.arrayOf(PropTypes.number).isRequired,
  words: PropTypes.string.isRequired,
};
