import PropTypes from 'prop-types';

import styles from '../styles/components/RoundMetrics.module.css';

export default function RoundMetrics({ stats, wordset, updateWords }) {
  const change = (e) => updateWords(Number(e.target.value));

  return (
    <div className={styles.container}>
      <p className={styles.stat}>Words per minute: {stats[0]}</p>
      <p className={styles.stat}>Errors: {stats[1]}</p>
      <p className={styles.stat}>Accuracy: {stats[2]}%</p>
      <p className={styles.stat}>Word Set: </p>
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

RoundMetrics.propTypes = {
  stats: PropTypes.array.isRequired,
  wordset: PropTypes.number.isRequired,
  updateWords: PropTypes.func.isRequired,
};
