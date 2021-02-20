import Pairs from './Pairs';
import Histogram from './Histogram';

export default function RoundAnalysis({ stats }: { stats: any[] }) {
  // render analysis only if we have a previous round in memory. Ergo, fifths and words must exist.
  return (stats[3] !== 0 && stats[4]) && (
    <div style={{ display: 'flex', width: '711px' }}>
      <Pairs pairs={stats[5]} />
      <Histogram fifths={stats[3]} words={stats[4]} />
    </div>
  );
}
