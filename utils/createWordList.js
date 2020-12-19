const fs = require('fs');
const path = require('path');
const words = require('./wordLists/common10000.json');

// Given an array of words and a filename.json, creates a JSON file.
const createWordList = (wordList, file) => {
  const toWrite = JSON.stringify(wordList);
  fs.writeFile(path.join(__dirname, '/wordLists/', file), toWrite, (err) => {
    if (err) console.error(err);
  });
};

// Template - writes 100 most common words!
createWordList(words.slice(0, 100), 'common100.json');
