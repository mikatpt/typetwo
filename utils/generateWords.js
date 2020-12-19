// const hundred = require()
import _ from 'lodash';

import hundred from './wordLists/common100.json';
import twohundred from './wordLists/common200.json';
import thousand from './wordLists/common1000.json';
import tenthousand from './wordLists/common10000.json';

// Given a particular rarity, generate 30 words
const generateWords = (rarity) => {
  let wordList;
  if (rarity === 100) wordList = hundred;
  if (rarity === 200) wordList = twohundred;
  if (rarity === 1000) wordList = thousand;
  if (rarity === 10000) wordList = tenthousand;

  return _.shuffle(wordList).slice(0, 30).join(' ');
};

export default generateWords;
