import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Timer, getWord } from '../../utils/Logic';
import { useKeyPress, modifyEscEnter, modifyBack } from '../../utils/KeyboardLogic';

import CharacterList from './CharacterList';

const initialState = {
  current: 0,
  fifths: [],
  spaces: 0,
  data: [],
  next: 1,
  errors: {},
  space: false,
};

export default function Typer({ words, getWords, prefs, sendData }) {
  const [state, setState] = useState(initialState);
  const Time = useRef(new Timer());
  const pref = useRef();

  const reset = () => { setState(initialState); };

  useEffect(() => { pref.current = prefs.wordset; }, [prefs]);
  useEffect(() => { reset(); }, [words]);

  // Sends data, but times out if you're typing below 20wpm
  useEffect(() => {
    if (state.current === words.length) {
      const timeSpent = Time.current.end('wpm');
      const lastFifths = [...state.fifths, Time.current.end('fifth')];
      const timeout = 60000 / (20 / (words.length / 5));
      if (timeSpent < timeout) sendData([words, timeSpent, state.errors, state.data, lastFifths]);
      else reset();
    }
  }, [state.current]);

  modifyEscEnter((key) => (key === 'esc' ? reset() : getWords(pref.current)));
  modifyBack(); // See logic file for backspace implementation

  // Listens for key presses and checks if correct, with graceful error handling.
  useKeyPress((key) => {
    let { spaces, space, current, next, data, fifths, errors } = state;
    let err;
    const pair = current > 0 ? words[current - 1] + words[current] : null;

    if (current === 0 && !errors[current]) Time.current.start('all');

    if (key === words[current]) {
      if (pair) data = [...data, [pair, Time.current.end('pair')]];

      if (key === ' ') {
        if (spaces + 1 === Math.ceil(words.split(' ').length / 5)) {
          spaces = 0;
          fifths = [...fifths, Time.current.end('fifth')];
        } else spaces += 1;
      }
      current += 1;
      next = current + 1;
      space = false;

      // Error handling
    } else if (errors[current]) {
      // If second consecutive key is correct after an error, allow user to continue.
      if (key === words[next]) {
        const conditions = (space && next === current + 3) || (!space && next === current + 2);
        if (conditions && next + 1 < words.length) {
          data = [...data, [pair, Time.current.end('pair')]];
          current = next + 1;
        } else if (space && next + 1 < words.length) next += 1;
      } else next = -1; // ...otherwise, do not permit user to continue until correct key pressed.
    } else if (current !== words.length) {
      err = {
        current: words[current],
        prev: words[current - 1] + words[current],
        next: words[current] + words[next],
        word: getWord(words, current),
      };
      errors = { ...errors, [current]: err };

      if (key === words[next]) {
        if (key === ' ' || words[next + 1] === ' ') space = true;
        next += 1;
      }
    }

    // Only update state if one of the three conditionals was hit.
    if (current !== state.current || err || next !== state.next) {
      setState({ current, next, fifths, spaces, data, errors, space });
    }
  });

  return <CharacterList words={words} current={state.current} errors={state.errors} />;
}
Typer.propTypes = {
  words: PropTypes.string.isRequired,
  getWords: PropTypes.func.isRequired,
  prefs: PropTypes.object.isRequired,
  sendData: PropTypes.func.isRequired,
};
