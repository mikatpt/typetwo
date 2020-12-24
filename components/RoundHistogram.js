import { useEffect, createRef } from 'react';
import PropTypes from 'prop-types';

import createHistogram from '../utils/graphs/createHistogram';
import styles from '../styles/RoundHistogram.module.css';

/*
To Do:
On hover, display the text block.
*/

export default function RoundHistogram({ fifths, words }) {
  const ref = createRef();

  useEffect(() => {
    createHistogram(ref, fifths, words);
  }, [fifths]);

  return (
    <div className={styles.graph}>
      <div ref={ref} />
    </div>
  );
}

RoundHistogram.propTypes = {
  fifths: PropTypes.arrayOf(PropTypes.number).isRequired,
  words: PropTypes.string.isRequired,
};
