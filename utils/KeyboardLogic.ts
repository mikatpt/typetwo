import { useState, useEffect, useCallback } from 'react';

type KeyPressFunc = (key?: string) => void;

/**
 * Captures the current pressed key and invokes a callback using it.
 * @param callback First parameter = key
 */
export const useKeyPress = (callback: KeyPressFunc): void => {
  const downHandler = ({ key }: KeyboardEvent) => {
    if (key.length === 1 && callback) callback(key);
  };

  // Sets and cleans up HTML event listeners.
  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    return () => { window.removeEventListener('keydown', downHandler); };
  });
};

/**
 * Invokes a callback on the escape
 * @param callback
 */
export const modifyEscEnter = (callback: KeyPressFunc): void => {
  const escFunc = useCallback(({ key }: KeyboardEvent) => {
    if (key === 'Escape') callback('esc');
    else if (key === 'Enter') callback('enter');
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', escFunc, false);
    return () => { window.removeEventListener('keydown', escFunc, false); };
  });
};

/**
 * Modifies listeners to remove default functionality
 * from spacebar, apostrophe, backspace, and period.
 * @param callback
 */
export const modifyBack = (callback?: KeyPressFunc): void => {
  const backFunc = useCallback((e: KeyboardEvent & Event) => {
    if (e.key === 'Backspace' && callback) callback();
    if (e.key === 'Backspace' || e.key === ' ' || e.key === "'" || e.key === '.') e.preventDefault();
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', backFunc, false);
    return () => { window.removeEventListener('keydown', backFunc, false); };
  });
};

// Here's the callback we use to give backspace functionality. I'm not convinced I want it.
// But we'll keep it here just in case.
// () => {
//   setCurrent((prev) => {
//     if (prev === 0 || words[prev - 1] === ' ') return prev;
//     Time.start('pair');
//     setNext(prev);
//     return prev - 1;
//   });
// }
