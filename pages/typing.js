import { useState } from 'react';

import CharacterList from '../components/CharacterList.js';

import generateWords from '../utils/generateWords.js';
import useKeyPress from '../utils/useKeyPress.js';
import styles from '../styles/Home.module.css';

/*
Todo:
  - Esc key should reset currentChar to 0
  - Backspace should not function!
  - Timer should begin upon typing first character
  - styling
  - Send errorList to database after each round.
  - replace 200 with an env variable controlled by settings.
*/

export default function Typing() {
  const [words, setWords] = useState(generateWords(200));
  const [current, setCurrent] = useState(0);
  const [next, setNext] = useState(1);
  const [errorList, setError] = useState({});
  const [space, setSpace] = useState(false);

  // Listens for key presses and checks if correct, with graceful error handling.
  useKeyPress((key) => {
    if (key === words[current]) {
      const n = current + 1;
      setCurrent(n);
      setNext(n + 1);
      setSpace(false);

      if (n === words.length) {
        setWords(generateWords(200));
        setCurrent(0);
        setNext(1);
        // EDIT THIS > send errorList to database, display on dash, then empty errorList
        console.log(`Your errors: ${JSON.stringify(errorList)}`);
        setError({});
      }
    } else if (errorList[current]) {
      // If second consecutive key is correct after an error, allow user to continue.
      if (key === words[next]) {
        const conditions = (space && next === current + 3) || (!space && next === current + 2);
        if (conditions) setCurrent(next + 1);
        else if (space) setNext(next + 1);
      } else setNext(-1); // ...otherwise, do not permit user to continue until correct key pressed.
    } else {
      // only track errors for the first mistake in a chain.

      // EDIT THIS. Save error stats for previous + current, current + next, and current.
      setError({ ...errorList, [current]: true });

      if (key === words[next]) {
        if (key === ' ' || words[next + 1] === ' ') setSpace(true);
        setNext(next + 1);
      }
    }
  });

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Welcome to TypeTwo!</h2>
      <main className={styles.main}> {/* do we need this main block? */}
        <div className={styles.textContainer}>
          <CharacterList words={words} current={current} />
        </div>
      </main>
    </div>
  );
}
