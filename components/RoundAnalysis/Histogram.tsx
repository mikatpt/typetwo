import { useEffect, createRef } from 'react';
import ReactTooltip from 'react-tooltip';

import createHistogram from '../../utils/graphs/roundHistogram';
import styles from '../../styles/RoundAnalysis/Histogram.module.css';

interface Props {
  fifths: number[];
  words: string;
}

export default function RoundHistogram({ fifths, words }: Props) {
  const ref = createRef<any>();

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
