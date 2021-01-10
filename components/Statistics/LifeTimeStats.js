import PropTypes from 'prop-types';

import { calculateWPM, msToMinutes } from '../../utils/Logic';
import styles from '../../styles/components/Statistics.module.css';

export default function LifeTimeStats({ chars, time, fastest }) {
  const lifetimewpm = calculateWPM(chars, time);
  const minutes = msToMinutes(time);
  const words = Math.floor(chars / 5);
  return (
    <div className={styles.stats}>
      <div className={styles.grid}>
        <div className={styles.gridItem}><p>TOTAL WORDS TYPED</p><h4>{words}</h4></div>
        <div className={styles.gridItem}><p>TIME SPENT TYPING</p><h4>{minutes}</h4></div>
        <div className={styles.gridItem}>
          <p>AVERAGE SPEED</p><h4>{lifetimewpm}<span className={styles.wpm}>wpm</span></h4>
        </div>
        <div className={styles.gridItem}>
          <p>TOP SPEED</p><h4>{fastest}<span className={styles.wpm}>wpm</span></h4>
        </div>
      </div>
    </div>
  );
}
LifeTimeStats.propTypes = {
  chars: PropTypes.number.isRequired,
  time: PropTypes.number.isRequired,
  fastest: PropTypes.number.isRequired,
};
