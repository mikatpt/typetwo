import { useContext } from 'react';
import Head from 'next/head';
import { NextApiRequest } from 'next';
import { getSession, Session } from 'next-auth/client';

import { Metrics, MetricsContextType, initialMetrics } from '../components/context';
import { deleteInfo } from '../utils/APILogic';

import LifeTimeStats from '../components/Statistics/LifeTimeStats';
import Letters from '../components/Statistics/Letters';
import Pairs from '../components/Statistics/Pairs';

export async function getServerSideProps({ req }: { req: NextApiRequest }) {
  const session = await getSession({ req });
  return { props: { session } };
}

// To do: Maybe average wpm of last 10?

export default function Statistics({ session }: { session: Session }) {
  const { metrics, setMetrics } = useContext(Metrics) as MetricsContextType;
  const noSession = (<p>Please log in to track your lifetime statistics!</p>);
  const noData = (<p>No data logged!</p>);

  const removeInfo = async () => {
    await deleteInfo(session);
    setMetrics(initialMetrics);
  };

  if (!session || !metrics.totalchars) {
    return (
      <div className="container">
        <Head><title>Statistics</title></Head>
        <h1>Statistics</h1>
        {!session ? noSession : noData}
      </div>
    );
  }
  const { totalchars, totaltime, fastestwpm, singles, doubles } = metrics;

  return (
    <div className="container">
      <Head><title>Statistics</title></Head>
      <h1 style={{ paddingTop: '35px' }}>STATISTICS</h1>
      <main className="main" style={{ paddingTop: 0 }}>
        <LifeTimeStats chars={totalchars || 0} time={totaltime || 0} fastest={fastestwpm || 0} />
        <Letters letterSet={singles || {}} capital={false} />
        <Letters letterSet={singles || {}} capital />
        <Pairs pairs={doubles || {}} />
        <button type="button" className="delete" onClick={removeInfo} style={{ margin: '30px 0' }}>RESET ALL STATISTICS</button>
      </main>
    </div>
  );
}
