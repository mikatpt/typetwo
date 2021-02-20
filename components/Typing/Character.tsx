import styles from '../../styles/Typing/Character.module.css';

interface Props {
  char: string;
  i: number;
  current: number;
  error: boolean;
}

export default function Character({ char, i, current, error }: Props) {
  const past = i < current ? styles.past : '';
  const curr = i === current ? styles.current : past;
  const final = error ? `${curr} ${styles.error}` : curr;
  const display = char === ' ' && error ? '_' : char;
  const wordBreak = char === ' ' ? (<wbr />) : '';

  return (<span className={final}>{display}{wordBreak}</span>);
}
