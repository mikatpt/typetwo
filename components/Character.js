import PropTypes from 'prop-types';

import styles from '../styles/WordDisplay.module.css';

/*
To do:
  - More styling
  - Current should blink.
  - Insert newlines every x characters at whitespace?
*/

const Character = ({ char, i, current, error }) => {
  const past = i < current ? styles.past : '';
  const style = i === current ? styles.current : past;
  const final = error ? `${style} ${styles.error}` : style;

  return (<div className={final}>{char}</div>);
};

Character.propTypes = {
  char: PropTypes.string.isRequired,
  i: PropTypes.number.isRequired,
  current: PropTypes.number.isRequired,
  error: PropTypes.bool.isRequired,
};

export default Character;
