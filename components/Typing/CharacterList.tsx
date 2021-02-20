import styles from '../../styles/Typing/WordDisplay.module.css';

import Character from './Character';

interface Props {
  words: string;
  current: number;
  errors: { [char: string]: { [char: string]: string; } };
}

export default function Characters({ words, current, errors }: Props) {
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
