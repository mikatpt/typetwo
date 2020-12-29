import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import styles from '../../styles/RoundAnalysis/Pairs.module.css';

const sortPairs = (pairs) => pairs.slice().sort((a, b) => {
  if (a[1] > b[1]) return -1;
  if (a[1] < b[1]) return 1;
  return 0;
});

export default function Pairs({ pairs }) {
  const [sorted, setSort] = useState([]);
  useEffect(() => {
    setSort(sortPairs(pairs));
  }, [pairs]);

  return (
    <div>
      <h4>Pair Metrics (Slowest to Fastest):</h4>
      <table>
        <tbody className={styles.pairs}>
          {sorted.map((p, i) => (
            <tr key={i}>
              <td>{`${sorted.length - i}.`}</td>
              <td>{p[0]}</td>
              <td>{(60000 / (p[1] * 5)).toFixed(2)}wpm</td>
            </tr>
          ))}

        </tbody>
      </table>
    </div>
  );
}
Pairs.propTypes = { pairs: PropTypes.array.isRequired };
