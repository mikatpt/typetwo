import PropTypes from 'prop-types';
import Character from './Character';

import styles from '../styles/WordDisplay.module.css';

const Characters = ({ words, current, errors }) => {
  const chars = words.split('');

  return (
    <div className={styles.character}>
      {chars.map((char, i) => {
        const error = !!errors[`${i}`];
        return (<Character key={char + i} char={char} i={i} current={current} error={error} />);
      })}
    </div>
  );
};

Characters.propTypes = {
  words: PropTypes.string.isRequired,
  current: PropTypes.number.isRequired,
  errors: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default Characters;
