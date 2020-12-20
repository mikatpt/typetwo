import _ from 'lodash';

import hundred from './wordLists/common100.json';
import twohundred from './wordLists/common200.json';
import thousand from './wordLists/common1000.json';
import tenthousand from './wordLists/common10000.json';

// Given a particular rarity, generate 30 words
export const generateWords = (rarity) => {
  let wordList;
  if (rarity === 100) wordList = hundred;
  if (rarity === 200) wordList = twohundred;
  if (rarity === 1000) wordList = thousand;
  if (rarity === 10000) wordList = tenthousand;

  return _.shuffle(wordList).slice(0, 30).join(' ');
};

export const Timer = class {
  constructor() {
    this.startWPM = null;
    this.startPair = null;
  }

  // Track wpm of a full paragraph
  start(which) {
    if (which === 'wpm') this.startWPM = new Date().getTime();
    if (which === 'pair') this.startPair = new Date().getTime();
  }

  end(which) {
    const end = new Date().getTime();
    const start = which === 'wpm' ? this.startWPM : this.startPair;
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
