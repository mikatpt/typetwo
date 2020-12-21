import PropTypes from 'prop-types';

import styles from '../styles/Character.module.css';

/*
To do:
  - More styling
*/

const Character = ({ char, i, current, error }) => {
  const past = i < current ? styles.past : '';
  const curr = i === current ? styles.current : past;
  const final = error ? `${curr} ${styles.error}` : curr;
  const display = char === ' ' && error ? '_' : char;
  const wordBreak = char === ' ' ? (<wbr />) : '';

  return (<span className={final}>{display}{wordBreak}</span>);
};

Character.propTypes = {
  char: PropTypes.string.isRequired,
  i: PropTypes.number.isRequired,
  current: PropTypes.number.isRequired,
  error: PropTypes.bool.isRequired,
};

export default Character;
