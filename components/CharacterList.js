import PropTypes from 'prop-types';

import styles from '../styles/WordDisplay.module.css';

import Character from './Character';

const Characters = ({ words, current, errors }) => {
  const chars = words.split('');

  return (
    <span className={styles.character}>
      {chars.map((char, i) => {
        const error = !!errors[`${i}`];
        return (<Character key={char + i} char={char} i={i} current={current} error={error} />);
      })}
    </span>
  );
};

Characters.propTypes = {
  words: PropTypes.string.isRequired,
  current: PropTypes.number.isRequired,
  errors: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default Characters;
