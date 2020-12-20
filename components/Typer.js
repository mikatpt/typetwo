import { useState, useRef } from 'react';
import PropTypes from 'prop-types';

import { Timer, getWord, generateWords } from '../utils/Logic';
import { useKeyPress, modifyEsc, modifyBack } from '../utils/KeyboardLogic';
import styles from '../styles/Typer.module.css';

import CharacterList from './CharacterList';

/*
Todo:
  - styling
  - Send errorList to database after each round.
  - replace 200 with an env variable controlled by settings.
*/

export default function Typer({ word }) {
  const [words, setWords] = useState(word);
  const [current, setCurrent] = useState(0);
  const [next, setNext] = useState(1);
  const [metrics, setMetrics] = useState([]);
  const [errors, setError] = useState({});
  const [space, setSpace] = useState(false);
  const Time = useRef(new Timer());

  const reset = () => {
    setCurrent(0);
    setNext(1);
    setError({});
    setMetrics([]);
  };

  modifyEsc(() => reset());
  modifyBack(); // See logic file for backspace implementation

  // Listens for key presses and checks if correct, with graceful error handling.
  useKeyPress((key) => {
    const pair = current > 0 && words[current] !== ' ' && words[current - 1] !== ' ' ? words[current - 1] + words[current] : null;

    if (current === 0) Time.current.start('wpm');

    if (pair && !errors[current]) setMetrics((prev) => [...prev, [pair, Time.current.end('pair')]]);
    Time.current.start('pair');

    if (key === words[current]) {
      const n = current + 1;
      setCurrent(n);
      setNext(n + 1);
      setSpace(false);

      if (n === words.length) {
        setWords(generateWords(200));
        const wpm = ((words.length / 5) * (60000.0 / Time.current.end('wpm'))).toFixed(2);
        const acc = ((100 * (words.length - Object.keys(errors).length)) / words.length).toFixed(2);
        // EDIT THIS > send errorList, metrics to database, display on dash, then resets all.
        setMetrics((prev) => {
          const res = [...prev, ['wpm', wpm, acc, words.length / 5, Time.current.end('wpm')]];
          console.log(`Your errors: ${JSON.stringify(errors)}
  Your times: ${JSON.stringify(res)}`);
          return res;
        });

        reset();
      }
      // Error handling
    } else if (errors[current]) {
      // If second consecutive key is correct after an error, allow user to continue.
      if (key === words[next]) {
        const conditions = (space && next === current + 3) || (!space && next === current + 2);
        if (conditions && next + 1 < words.length) setCurrent(next + 1);
        else if (space && next + 1 < words.length) setNext(next + 1);
      } else setNext(-1); // ...otherwise, do not permit user to continue until correct key pressed.
    } else {
      // only track errors for the first mistake in a chain.

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
Typer.propTypes = { word: PropTypes.string.isRequired };
