import ReactTooltip from 'react-tooltip';

import styles from '../styles/components/Instructions.module.css';

// Perhaps add react tooltip to explain further?
export default function Instructions() {
  return (
    <div className={styles.instructions}>
      <div className={styles.prev} data-tip data-for="ttpReset">
        <img src="/EscKey.png" alt="Esc" className={styles.img} />
        <h4 className={styles.text}>RESET</h4>
      </div>

      <div className={styles.next} data-tip data-for="ttpNext">
        <img src="/EnterAlt.png" alt="Enter" className={styles.img} />
        <h4 className={styles.text}>NEXT</h4>
      </div>

      <ReactTooltip id="ttpReset" uuid="ttpReset" type="dark" place="left" effect="solid">
        Press the Escape key to reset the current word list and timers.
      </ReactTooltip>

      <ReactTooltip id="ttpNext" uuid="ttpNext" type="dark" place="right" effect="solid">
        Press the Enter key to proceed to the next word list.
      </ReactTooltip>
    </div>
  );
}
