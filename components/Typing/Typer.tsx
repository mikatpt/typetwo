import { useState, useRef, useEffect, useContext, MutableRefObject } from 'react';

import { Timer, State, typingLogic, calculateWPM, formatLetters } from '../../utils/Logic';
import { useKeyPress, modifyEscEnter, modifyBack } from '../../utils/KeyboardLogic';
import { Metrics, MetricsContextType } from '../context';

import CharacterList from './CharacterList';

const initialState = {
  current: 0,
  fifths: [],
  spaces: 0,
  data: [],
  next: 1,
  errors: {},
  space: false,
} as State;

interface Props {
  words: string;
  getWords: (wordset: number) => void;
  prefs: { wordset: number; };
  sendData: (data: {[key:string]: any}) => void;
}

export default function Typer({ words, getWords, prefs, sendData }: Props) {
  const [state, setState] = useState(initialState);
  const { metrics } = useContext(Metrics) as MetricsContextType;

  const Time = useRef(new Timer());
  const pref: MutableRefObject<number> = useRef(0);

  const reset = () => { setState(initialState); };

  useEffect(() => { pref.current = prefs.wordset; }, [prefs]);
  useEffect(() => { reset(); }, [words]);

  // Sends data, but times out if you're typing below 20wpm
  useEffect(() => {
    if (state.current === words.length) {
      const totaltime = Time.current.end('wpm');
      const timeout = 60000 / (20 / (words.length / 5));
      const lasterrors = Object.keys(state.errors).length;
      const lastwpm = calculateWPM(words.length, totaltime);
      const [singles, doubles] = formatLetters(state.data, state.errors);

      if (totaltime < timeout) {
        sendData({
          totalchars: words.length + metrics.totalchars,
          fastestwpm: Math.max(metrics.fastestwpm, lastwpm),
          totaltime: totaltime + metrics.totaltime,
          errors: state.errors,
          data: state.data,
          lastaccuracy: +((100 * (words.length - lasterrors)) / words.length).toFixed(2),
          lastfifths: [...state.fifths, Time.current.end('fifth')],
          lastwpm,
          lasterrors,
          words,
          singles,
          doubles,
        });
      } else reset();
    }
  }, [state.current]);

  modifyEscEnter((key) => (key === 'esc' ? reset() : getWords(pref.current)));
  modifyBack(); // See logic file for backspace implementation

  const updateState = (nextState: State) => setState(nextState);

  // Listens for key presses and checks if correct, with graceful error handling.
  useKeyPress((key) => typingLogic(key, state, words, Time, updateState));

  return <CharacterList words={words} current={state.current} errors={state.errors} />;
}
