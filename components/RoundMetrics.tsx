import { ChangeEvent } from 'react';

import styles from '../styles/components/RoundMetrics.module.css';

import { MetricsType } from './context';

interface Props {
  metrics: MetricsType;
  wordset: number;
  updateWords: (option: number) => void;
}

export default function RoundMetrics({ metrics, wordset, updateWords }: Props) {
  const change = (e: ChangeEvent<HTMLSelectElement>) => updateWords(+e.target.value);

  return (
    <div className={styles.container}>
      <p className={styles.stat}><b>Words per minute:</b> {metrics.lastwpm}</p>
      <p className={styles.stat}><b>Errors:</b> {metrics.lasterrors}</p>
      <p className={styles.stat}><b>Accuracy:</b> {metrics.lastaccuracy}%</p>
      <p className={styles.stat}><b>Word Set:</b> </p>
      <div className={styles.selContainer}>
        <select id="wordSet" className={styles.select} value={wordset} onChange={change}>
          <option value="0">200 Most Popular</option>
          <option value="1">1000 Most Popular</option>
          <option value="2">10000 Most Popular</option>
          <option value="3">Quotes</option>
        </select>
      </div>
    </div>
  );
}
