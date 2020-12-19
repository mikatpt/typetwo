import { useState, useEffect } from 'react';

// Updates current pressed key.
const useKeyPress = (callback) => {
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

export default useKeyPress;
