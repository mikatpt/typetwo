/* eslint-disable no-param-reassign */
import _ from 'lodash';

import twohundred from './wordLists/common200.json';
import thousand from './wordLists/common1000.json';
import tenthousand from './wordLists/common10000.json';

// Given a particular rarity, generate 30 words
export const generateWords = (option) => {
  let wordList;
  if (option === 0) wordList = twohundred;
  if (option === 1) wordList = thousand;
  if (option === 2) wordList = tenthousand;

  return _.shuffle(wordList).slice(0, 30).join(' ');
};

export const Timer = class {
  constructor() {
    this.startWPM = null;
    this.startPair = null;
    this.startFifth = null;
  }

  // Track wpm of a full paragraph
  start(which) {
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

  end(which) {
    const end = new Date().getTime();
    const isFifth = which === 'fifth' ? this.startFifth : this.startPair;
    const start = which === 'wpm' ? this.startWPM : isFifth;
    this.start(which);
    return (end - start);
  }
};

// Given list of words and an index, return the word of that index.
export const getWord = (words, i) => {
  if (words[i] === ' ') return ' ';
  let start = i;
  let end = i;
  while (words[start - 1] !== ' ' && start > 0) start--;
  while (words[end + 1] !== ' ' && end < words.length) end++;
  return words.substring(start, end + 1);
};

export const formatStats = (data) => {
  if (Array.isArray(data)) {
    if (data.length < 3) return [0, 0, 0, 0];
    const wpm = ((data[0].length / 5) * (60000.0 / data[1])).toFixed(2);
    const errors = Object.keys(data[2]).length;
    const acc = ((100 * (data[0].length - errors)) / data[0].length).toFixed(2);
    return [Number(wpm), errors, Number(acc), data[4], data[0], data[3]];
  }
  if (!Object.keys(data).length) return [0, 0, 0, 0];
  const { lastwpm, lasterrors, lastaccuracy } = data;
  return [lastwpm, lasterrors, lastaccuracy, 0];
};

export const formatLetters = (data, errorList) => {
  const singles = {};
  const doubles = {};

  const addToData = (dataSet, str, time, errors) => {
    if (!dataSet[str]) dataSet[str] = { total: 1, errors, time };
    else {
      dataSet[str].total += 1;
      dataSet[str].time += time;
      dataSet[str].errors += errors;
    }
  };

  Object.keys(errorList).forEach((i) => {
    // {'ae': {current, prev, next, word}}
    addToData(singles, errorList[i].current, 0, 1);
    const prev = errorList[i].prev.replace(/\s/, '');
    if (prev.length === 2) addToData(doubles, prev, 0, 1);
  });

  data.forEach((tuple) => {
    const pair = tuple[0].replace(/\s/, '');
    const time = tuple[1];
    if (pair.length === 2) addToData(doubles, pair, time, 0);
    pair.split('').forEach((char) => {
      addToData(singles, char, time, 0);
    });
  });

  return [singles, doubles];
};

export const updateData = (rows, newData) => {
  const toSend = [...newData];
  toSend[1] += rows.totalwords;
  toSend[2] += rows.totaltime;
  toSend[3] = Math.max(toSend[3], rows.fastestwpm);

  const update = (toUpdate, newInfo) => {
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
