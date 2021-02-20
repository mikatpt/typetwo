import { useState, useEffect, createRef, ChangeEvent } from 'react';
import { CharacterStore } from '../context';

import createHistogram from '../../utils/graphs/pairHistogram';

export default function Pairs({ pairs }: { pairs: CharacterStore }) {
  const [option, setOption] = useState('0');
  const ref = createRef<any>();
  const change = (e: ChangeEvent<HTMLSelectElement>) => setOption(e.target.value);

  useEffect(() => {
    createHistogram(ref, pairs, option);
  }, [pairs, option]);

  return (
    <div style={{ position: 'relative' }}>
      <select className="select" value={option} onChange={change}>
        <option value="0">Sort by Speed</option>
        <option value="1">Sort by Frequency</option>
      </select>
      <div ref={ref} className="svg-container" />

    </div>
  );
}
