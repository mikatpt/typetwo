import { useState, useEffect } from 'react';
import ReactTooltip from 'react-tooltip';

import { sortPairs } from '../../utils/Logic';
import styles from '../../styles/RoundAnalysis/Pairs.module.css';

type Pair = Array<[string, number]>;

export default function Pairs({ pairs }: { pairs: Pair }) {
  const [sorted, setSorted] = useState<Pair>([]);
  useEffect(() => {
    setSorted(sortPairs(pairs));
  }, [pairs]);

  return (
    <div className={styles.container}>
      <h4 className={styles.title}>PAIR METRICS</h4>
      <span className={styles.help} data-tip data-for="ttpPairs">?</span>

      <table className={styles.pairs}>
        <tbody>
          <tr className={styles.row}>
            <td className={styles.num}> #    </td>
            <td className={styles.text}>pair</td>
            <td className={styles.speed}>wpm</td>
          </tr>
          {sorted.map((p, i) => (
            <tr key={i} className={styles.row}>
              <td className={styles.num}>{`${sorted.length - i}.`}</td>
              <td className={styles.text}>{p[0]}</td>
              <td className={styles.speed}>{(60000 / (p[1] * 5)).toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <ReactTooltip id="ttpPairs" uuid="ttpPairs" type="dark" place="top" effect="solid">Your speed for every letter pair you typed. Spaces are denoted by underscores.</ReactTooltip>
    </div>
  );
}
