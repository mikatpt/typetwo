import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Timer, getWord, generateWords } from '../utils/Logic';
import { useKeyPress, modifyEsc, modifyBack } from '../utils/KeyboardLogic';
import styles from '../styles/Typer.module.css';

import CharacterList from './CharacterList';

/*
Todo:
  - styling
  - replace 200 with an env variable controlled by settings.
*/
export default function Typer({ word, sendData }) {
  const [words, setWords] = useState(word);
  const [current, setCurrent] = useState(0);
  const [fifths, setFifths] = useState([]);
  const [spaces, setSpaces] = useState(0);
  const [metrics, setMetrics] = useState([]);
  const Time = useRef(new Timer());

  // Error handling
  const [next, setNext] = useState(1);
  const [errors, setError] = useState({});
  const [space, setSpace] = useState(false);

  const reset = () => {
    setCurrent(0);
    setFifths([]);
    setSpaces(0);
    setMetrics([]);
    setNext(1);
    setError({});
    setSpace(false);
  };

  useEffect(() => {
    if (current === words.length) {
      setWords(generateWords(200));
      const timeSpent = Time.current.end('wpm');
      const lastFifths = [...fifths, Time.current.end('fifth')];
      sendData([words, timeSpent, errors, metrics, lastFifths]);
      reset();
    }
  }, [current]);

  modifyEsc(() => reset());
  modifyBack(); // See logic file for backspace implementation

  // Listens for key presses and checks if correct, with graceful error handling.
  useKeyPress((key) => {
    const pair = current > 0 ? words[current - 1] + words[current] : null;

    if (current === 0 && !errors[current]) Time.current.start('all');

    if (key === words[current]) {
      if (pair) setMetrics([...metrics, [pair, Time.current.end('pair')]]);

      if (key === ' ') {
        if (spaces + 1 === 6) {
          setSpaces(0);
          setFifths([...fifths, Time.current.end('fifth')]);
        } else setSpaces(spaces + 1);
      }
      const n = current + 1;
      setCurrent(n);
      setNext(n + 1);
      setSpace(false);

      // Error handling
    } else if (errors[current]) {
      // If second consecutive key is correct after an error, allow user to continue.
      if (key === words[next]) {
        const conditions = (space && next === current + 3) || (!space && next === current + 2);
        if (conditions && next + 1 < words.length) {
          setMetrics([...metrics, [pair, Time.current.end('pair')]]);
          setCurrent(next + 1);
        } else if (space && next + 1 < words.length) setNext(next + 1);
      } else setNext(-1); // ...otherwise, do not permit user to continue until correct key pressed.
    } else {
      const err = {
        current: words[current],
        prev: words[current - 1] + words[current],
        next: words[current] + words[next],
        word: getWord(words, current),
      };
      setError({ ...errors, [current]: err });

      if (key === words[next]) {
        if (key === ' ' || words[next + 1] === ' ') setSpace(true);
        setNext(next + 1);
      }
    }
  });

  return (
    <div className={styles.textContainer}>
      <CharacterList words={words} current={current} errors={errors} />
    </div>
  );
}
Typer.propTypes = { word: PropTypes.string.isRequired, sendData: PropTypes.func.isRequired };
