/* eslint-disable no-param-reassign */
import { MutableRefObject } from 'react';
import _ from 'lodash';

import twohundred from './wordLists/common200.json';
import thousand from './wordLists/common1000.json';
import tenthousand from './wordLists/common10000.json';
import quotes from './wordLists/quotes.json';

type WordList = string[] | {[key: string]: string | number}[];

/**
 * Randomly generates a string of words.
 * @param option Number 0-3 representing different word lists.
 * @returns A quote or a string of 30 words.
 */
export const generateWords = (option: number): string => {
  let wordList: WordList;
  switch (option) {
    case 0: wordList = twohundred; break;
    case 1: wordList = thousand; break;
    case 2: wordList = tenthousand; break;
    case 3: return quotes[Math.floor(Math.random() * 500)].content;
    default: throw new Error();
  }
  return _.shuffle(wordList).slice(0, 30).join(' ');
};

/** Used to time full word list, every fifth, and between every character */
export const Timer = class {
  private startWPM: number;

  private startPair: number;

  private startFifth: number;

  constructor() {
    this.startWPM = 0;
    this.startPair = 0;
    this.startFifth = 0;
  }

  /**
   * Start a specific timer, or start all timers.
   * @param which Denotes which timer to start.
   */
  start(which: 'all' | 'wpm' | 'pair' | 'fifth') {
    const time = new Date().getTime();
    if (which === 'all') {
      this.startWPM = time;
      this.startPair = time;
      this.startFifth = time;
    }
    if (which === 'wpm') this.startWPM = time;
    if (which === 'pair') this.startPair = time;
    if (which === 'fifth') this.startFifth = time;
  }

  /**
   * Ends the specified timer(s) and returns the time in milliseconds.
   * @param which Denotes which timer to end.
   */
  end(which: 'wpm' | 'pair' | 'fifth') {
    const end = new Date().getTime();
    const isFifth = which === 'fifth' ? this.startFifth : this.startPair;
    const start = which === 'wpm' ? this.startWPM : isFifth;
    this.start(which);
    return end - start;
  }
};

/**
 * Given a string of words and an index, return the word closest to the index.
 * @param words Space-separated string of words.
 * @param i Current index
 */
export const getWord = (words: string, i: number): string => {
  if (words[i] === ' ') return ' ';
  let start = i;
  let end = i;
  while (words[start - 1] !== ' ' && start > 0) start--;
  while (words[end + 1] !== ' ' && end < words.length) end++;
  return words.substring(start, end + 1);
};

type CalcWPM = (chars: number, time: number) => number;
/**
 * Returns words per minute, given characters and time in milliseconds.
 * @param chars Number of characters
 * @param time Time in milliseconds
 */
export const calculateWPM: CalcWPM = (chars, time) => Number(((12000 * chars) / time).toFixed(2));

export interface Stats {
  lastwpm: number;
  lasterrors: number;
  lastaccuracy: number;
  totaltime: number;
  errors: {[chars: string]: { [key: string]: string; }};
  words?: string;
  lastfifths: number[];
  data?: Array<[string, number]>
}

/**
 * Given raw statistics, formats them for display. Returns 0's for error handling.
 * @param data
 */
export const formatStats = (data: Stats) => {
  const { lastwpm, lasterrors, lastaccuracy, words, lastfifths } = data;

  if (!Object.keys(data).length) return [0, 0, 0, 0];
  if (words) return [lastwpm, lasterrors, lastaccuracy, lastfifths, words, data.data];
  return [lastwpm, lasterrors, lastaccuracy, 0];
};

interface FormattedData {
  [chars: string]: { [key: string]: number; }
}

export const formatLetters = (data: [string, number][], errorList: any) => {
  const singles: FormattedData = {};
  const doubles: FormattedData = {};

  const addToData = (dataSet: any, str: string, time: number, errors: number) => {
    if (!dataSet[str]) dataSet[str] = { total: 1, errors, time };
    else {
      dataSet[str].total += 1;
      dataSet[str].time += time;
      dataSet[str].errors += errors;
    }
  };

  Object.keys(errorList).forEach((i) => {
    addToData(singles, errorList[i].current, 0, 1);
    const prev = errorList[i].prev.replace(/\s/, '');
    if (prev.length === 2) addToData(doubles, prev, 0, 1);
  });

  // data = array of tuples, ['pa', 2000]
  data.forEach((tuple) => {
    const pair = tuple[0].replace(/\s/, '');
    const time = tuple[1];
    if (pair.length === 2) addToData(doubles, pair, time, 0);
    pair.split('').forEach((char) => {
      addToData(singles, char, time, 0);
    });
  });
  if (singles[' ']) delete singles[' '];

  return [singles, doubles];
};

// Update type definition for this later!
/**
 * Takes database info and updates it with new data.
 * @param rows
 * @param newData
 */
export const updateData = (rows: any, newData: any) => {
  const toSend = [...newData];
  toSend[1] += rows.totalchars;
  toSend[2] += rows.totaltime;
  toSend[3] = Math.max(toSend[3], rows.fastestwpm);

  const update = (toUpdate: any, newInfo: any) => {
    Object.keys(newInfo).forEach((char) => {
      if (!toUpdate[char]) toUpdate[char] = newInfo[char];
      else {
        toUpdate[char].time += newInfo[char].time;
        toUpdate[char].total += newInfo[char].total;
        toUpdate[char].errors += newInfo[char].errors;
      }
    });
  };

  const { singles, doubles } = rows;
  update(singles, toSend[8]);
  update(doubles, toSend[9]);

  toSend[8] = singles;
  toSend[9] = doubles;
  return toSend;
};

/**
 * Given an array of tuples (letterPair, speed), sorts by speed descending.
 * @param pairs
 */
export const sortPairs = (pairs: [string, number][]) => _.cloneDeep(pairs)
  .sort((a, b) => b[1] - a[1])
  .map((pair) => {
    if (pair[0][0] === ' ' || pair[0][1] === ' ') pair[0] = pair[0].replace(/\s/, '_');
    return pair;
  });

/**
 * Converts time to hr:min:sec format.
 * @param ms Time in milliseconds.
 */
export const msToMinutes = (ms: number) => {
  let seconds: string | number = Math.floor((ms / 1000) % 60);
  let minutes: string | number = Math.floor((ms / (1000 * 60)) % 60);
  let hours: string | number = Math.floor((ms / (1000 * 60 * 60)) % 24);

  hours = (hours < 10) ? `0${hours}` : hours;
  minutes = (minutes < 10) ? `0${minutes}` : minutes;
  seconds = (seconds < 10) ? `0${seconds}` : seconds;

  return `${hours}:${minutes}:${seconds}`;
};

export interface State {
  fifths: number[];
  data: Array<[string, number]>;
  errors: { [char: string]: { [char: string]: string; } };
  [key: string]: any;
}

type TypingType = (
  key: string | undefined,
  state: State,
  words: string,
  Time: MutableRefObject<InstanceType<typeof Timer>>,
  updateState: (nextState: State) => void
) => void

/**
 * Checks if typed key matches current key. Saves speed and error metrics.
 * If an error made matches the following character (i.e. user dropped a letter),
 * allow the user to continue typing.
 */
export const typingLogic: TypingType = (key, state, words, Time, updateState) => {
  let { spaces, space, current, next, data, fifths, errors } = state;
  const pair = current > 0 ? words[current - 1] + words[current] : '';

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

      if (next + 1 < words.length) {
        if (conditions) {
          data = [...data, [pair, Time.current.end('pair')]];
          current = next + 1;
        } else if (space) next += 1;
        else next += 1;
      }
    } else next = -Infinity; // otherwise, do not permit user to continue until correct key pressed.
  } else if (current !== words.length) {
    const err = {
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
  } else return;
  updateState({ current, next, fifths, spaces, data, errors, space });
};
