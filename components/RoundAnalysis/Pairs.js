import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';

import { sortPairs } from '../../utils/Logic';
import styles from '../../styles/RoundAnalysis/Pairs.module.css';

export default function Pairs({ pairs }) {
  const [sorted, setSorted] = useState([]);
  useEffect(() => {
    setSorted(sortPairs(pairs));
  }, [pairs]);

  return (
    <div className={styles.container}>
      <h4>Pair Metrics:</h4>
      <span className={styles.help} data-tip data-for="ttpPairs">?</span>

      <table className={styles.pairs}>
        <tbody>
          {sorted.map((p, i) => (
            <tr key={i}>
              <td>{`${sorted.length - i}.`}</td>
              <td className={styles.text}>{p[0]}</td>
              <td>{(60000 / (p[1] * 5)).toFixed(1)}wpm</td>
            </tr>
          ))}
        </tbody>
      </table>

      <ReactTooltip id="ttpPairs" uuid="ttpPairs" type="dark" place="top" effect="solid">Your speed for every letter pair you typed. Consider finding alternate fingerings for your slowest pairs!</ReactTooltip>
    </div>
  );
}
Pairs.propTypes = { pairs: PropTypes.array.isRequired };
