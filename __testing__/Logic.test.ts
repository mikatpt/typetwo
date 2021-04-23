import { MutableRefObject } from 'react';
import * as Logic from '../utils/Logic';

// describe('Word list generation')
describe('Word list generation', () => {
  test('Should return a list of 30 words from most popular lists', () => {
    const twohundred = Logic.generateWords(0).split(' ').length;
    const thousand = Logic.generateWords(1).split(' ').length;
    const tenthousand = Logic.generateWords(2).split(' ').length;
    expect(twohundred).toBe(30);
    expect(thousand).toBe(30);
    expect(tenthousand).toBe(30);
  });
});

describe('Timer functionality', () => {
  const Time = new Logic.Timer();
  test('Given an input should time that input', async () => {
    Time.start('wpm');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const end = Time.end('wpm');
    expect(end).toBeGreaterThanOrEqual(900);
  });
});

describe('getWord function', () => {
  test('Given an index, should return closest word to index', () => {
    const words = 'The quick brown fox jumped over the lazy dog';
    expect(Logic.getWord(words, 0)).toBe('The');
    expect(Logic.getWord(words, 3)).toBe(' ');
    expect(Logic.getWord(words, 4)).toBe('quick');
    expect(Logic.getWord(words, 10)).toBe('brown');
  });
});

describe('calculateWPM function', () => {
  test('Given a number of characters and a time, returns correct wpm to two decimal points', () => {
    const chars = 1000;
    const time = 100000;
    const wpm = Logic.calculateWPM(chars, time);
    expect(wpm).toBe(120);
  });
});

describe('formatLetters function', () => {
  const data: [string, number][] = [['ah', 2000], ['ha', 3000], ['a', 1000], ['b ', 4000]];
  const err = { current: 'o', prev: 'fo', next: 'x ', word: 'fox' };
  const errorList = { 10: err };

  const actual = Logic.formatLetters(data, errorList);

  type Formatted = { [chars: string]: { [key: string]: number }}

  test('Should return an array of two objects', () => {
    expect(actual).toHaveLength(2);
    expect(actual[0]).toMatchObject<Formatted>({});
    expect(actual[1]).toMatchObject<Formatted>({});
  });

  test('Should add correct amount of errors and data points', () => {
    expect(Object.keys(actual[0])).toHaveLength(4);
    expect(Object.keys(actual[1])).toHaveLength(3);
    expect(actual[1]).not.toHaveProperty('b ');
  });

  test('Should properly format statistics', () => {
    expect(actual[0].a.total).toBe(3);
    expect(actual[0].a.time).toBe(6000);
    expect(actual[0].o.errors).toBe(1);
  });
});

describe('updateData function', () => {
  const single = { time: 1000, total: 1, errors: 1 };
  const double = { time: 1000, total: 2, errors: 0 };
  const row = {
    totalchars: 44,
    totaltime: 4000,
    fastestwpm: 32,
    singles: { h: single },
    doubles: { Th: double },
  };
  const newData = ['id', 45, 1000, 33, 33, 1, 97.73, [1000, 1000, 1000, 1000, 0], { h: single }, { Th: double }];
  const updated = Logic.updateData(row, newData);

  test('Should update fields correctly', () => {
    const [pid, totalchars, timeSpent, fastestwpm, lastwpm,
      lasterrors, lastacc, fifths, singles, doubles] = updated;
    expect(pid).toBe('id');
    expect(totalchars).toBe(89);
    expect(timeSpent).toBe(5000);
    expect(fastestwpm).toBe(33);
    expect(lastwpm).toBe(33);
    expect(lasterrors).toBe(1);
    expect(lastacc).toBe(97.73);
    expect(fifths).toEqual(newData[7]);
    expect(singles).toHaveProperty('h');
    expect(singles.h.total).toBe(2);
    expect(singles.h.errors).toBe(2);
    expect(singles.h.time).toBe(2000);
    expect(doubles.Th.total).toBe(4);
    expect(doubles.Th.errors).toBe(0);
    expect(doubles.Th.time).toBe(2000);
  });
});

describe('sortPairs function', () => {
  const pairs: [string, number][] = [['bc', 2000], ['az', 10000], ['fe', 50], ['le', 300]];
  const sorted = Logic.sortPairs(pairs);
  const expected = [['az', 10000], ['bc', 2000], ['le', 300], ['fe', 50]];

  test('Should sort list of tuples descending by speed', () => {
    expect(sorted).toEqual(expected);
  });
});

describe('Typing logic', () => {
  const words = 'The quick brown fox jumped over the lazy dog';
  let state = {} as Logic.State;
  const Time: MutableRefObject<InstanceType<typeof Logic.Timer>> = { current: new Logic.Timer() };

  const setState = (nextState: Logic.State) => { state = ({ ...state, ...nextState }); };

  beforeEach(() => {
    state = {
      current: 0,
      fifths: [],
      spaces: 0,
      data: [],
      next: 1,
      errors: {},
      space: false,
    };
  });

  test('Should travel full word list accurately with no errors', () => {
    words.split('').forEach((word) => Logic.typingLogic(word, state, words, Time, setState));
    expect(state.current).toBe(44);
    expect(state.errors).toMatchObject({});
  });

  test('Should contain exactly words.length - 1 items in data when no errors are made', () => {
    words.split('').forEach((word) => Logic.typingLogic(word, state, words, Time, setState));
    expect(state.data).toHaveLength(words.length - 1);
  });

  test('When only one character is missed, allows user to finish passage', () => {
    const t = 'The qick brown fox jumped over the lazy dog';
    t.split('').forEach((word) => Logic.typingLogic(word, state, words, Time, setState));

    expect(state.current).toBe(44);
  });

  test('When only one character is mis-typed, allows user to finish passage', () => {
    const t = 'The qrick brown fox jumped over the lazy dog';
    t.split('').forEach((word) => Logic.typingLogic(word, state, words, Time, setState));
    expect(state.current).toBe(44);
  });

  test('Given a mistake occurred, should log error correctly', () => {
    const t = 'The qrick brown fox jumped over the lazy dog';
    t.split('').forEach((word) => Logic.typingLogic(word, state, words, Time, setState));
    const err = { current: 'u', prev: 'qu', next: 'ui', word: 'quick' };
    expect(state.errors['5']).toEqual(err);
  });
});
