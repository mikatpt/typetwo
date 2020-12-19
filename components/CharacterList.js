import PropTypes from 'prop-types';
import Character from './Character.js';

import styles from '../styles/WordDisplay.module.css';

const Characters = ({ words, current }) => {
  const chars = words.split('');

  return (
    <div className={styles.character}>
      {chars.map((char, i) => <Character key={char + i} char={char} i={i} current={current} />)}
    </div>
  );
};

Characters.propTypes = {
  words: PropTypes.string.isRequired,
  current: PropTypes.number.isRequired,
};

export default Characters;
