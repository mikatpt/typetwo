import PropTypes from 'prop-types';

import styles from '../styles/WordDisplay.module.css';

/*
To do:
  - More styling
  - Current should blink.
  - Insert newlines every x characters at whitespace?
*/

const Character = ({ char, i, current }) => {
  const past = i < current ? styles.past : '';
  const style = i === current ? styles.current : past;

  return (<div className={style}>{char}</div>);
};

Character.propTypes = {
  char: PropTypes.string.isRequired,
  i: PropTypes.number.isRequired,
  current: PropTypes.number.isRequired,
};

export default Character;
