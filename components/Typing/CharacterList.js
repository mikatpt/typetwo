import PropTypes from 'prop-types';

import styles from '../../styles/Typing/WordDisplay.module.css';

import Character from './Character';

export default function Characters({ words, current, errors }) {
  const chars = words.split('');

  return (
    <span className={styles.character}>
      {chars.map((char, i) => {
        const error = !!errors[`${i}`];
        return (<Character key={char + i} char={char} i={i} current={current} error={error} />);
      })}
      {!chars.length && (<span className={styles.loading}>Loading...</span>)}
    </span>
  );
}

Characters.propTypes = {
  words: PropTypes.string.isRequired,
  current: PropTypes.number.isRequired,
  errors: PropTypes.objectOf(PropTypes.object).isRequired,
};
