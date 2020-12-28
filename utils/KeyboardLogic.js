import { useState, useEffect, useCallback } from 'react';

// Updates current pressed key.
export const useKeyPress = (callback) => {
  const [keyPressed, setKeyPressed] = useState();

  // Sets current key pressed. Ignores repeated inputs from holding down a key.
  const downHandler = ({ key }) => {
    if (keyPressed !== key && key.length === 1) {
      setKeyPressed(key);
      if (callback) callback(key);
    }
  };

  // Releases a key.
  const upHandler = () => { setKeyPressed(null); };

  useEffect(() => {
    // Set HTML event listeners
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    // Clean-up event listeners
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  });

  return keyPressed;
};

export const modifyEscEnter = (callback) => {
  const escFunction = useCallback((e) => {
    if (e.keyCode === 27) callback('esc');
    else if (e.keyCode === 13) callback('enter');
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', escFunction, false);
    return () => { window.removeEventListener('keydown', escFunction, false); };
  });
};

export const modifyBack = (callback) => {
  const backFunc = useCallback((e) => {
    if (e.keyCode === 8) {
      if (callback) callback();
      e.preventDefault();
    }
    if (e.keyCode === 32) e.preventDefault();
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
