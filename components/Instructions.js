import ReactTooltip from 'react-tooltip';

import styles from '../styles/Instructions.module.css';

// Perhaps add react tooltip to explain further?
export default function Instructions() {
  return (
    <span className={styles.instructions}>
      <div className={styles.prev} data-tip data-for="ttpReset">
        <h4>Reset:</h4>
        <img src="/EscKey.png" alt="Esc" className={styles.img} />
      </div>

      <div className={styles.next} data-tip data-for="ttpNext">
        <h4>Next:</h4>
        <img src="/EnterAlt.png" alt="Enter" className={styles.img} />
      </div>

      <ReactTooltip id="ttpReset" uuid="ttpReset" type="dark" place="right" effect="solid">
        Press the Escape key to reset the current word list and timers.
      </ReactTooltip>

      <ReactTooltip id="ttpNext" uuid="ttpNext" type="dark" place="left" effect="solid">
        Press the Enter key to proceed to the next word list.
      </ReactTooltip>
    </span>
  );
}
