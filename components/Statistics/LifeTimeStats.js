import PropTypes from 'prop-types';

import { msToMinutes } from '../../utils/Logic';
import styles from '../../styles/components/Statistics.module.css';

export default function LifeTimeStats({ chars, time, fastest }) {
  const lifetimewpm = ((chars / 5) * (60000 / time)).toFixed(2);
  const minutes = msToMinutes(time);
  const words = Math.floor(chars / 5);
  return (
    <div className={styles.stats}>
      <h3 className={styles.title}>All Time Stats</h3>
      <div className={styles.grid}>
        <div className={styles.gridItem}><p>Total words typed:</p><h4>{words}</h4></div>
        <div className={styles.gridItem}><p>Time spent typing:</p><h4>{minutes}</h4></div>
        <div className={styles.gridItem}><p>Average Speed:</p><h4>{lifetimewpm}wpm</h4></div>
        <div className={styles.gridItem}><p>Top Speed:</p><h4>{fastest}wpm</h4></div>
      </div>
    </div>
  );
}
LifeTimeStats.propTypes = {
  chars: PropTypes.number.isRequired,
  time: PropTypes.number.isRequired,
  fastest: PropTypes.number.isRequired,
};
