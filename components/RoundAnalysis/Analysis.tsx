import Pairs from './Pairs';
import Histogram from './Histogram';

import { MetricsType } from '../context';

export default function RoundAnalysis({ metrics }: { metrics: MetricsType }) {
  return (metrics.words && metrics.data) && (
    <div style={{ display: 'flex', width: '711px' }}>
      <Pairs pairs={metrics.data} />
      <Histogram fifths={metrics.lastfifths} words={metrics.words} />
    </div>
  );
}
