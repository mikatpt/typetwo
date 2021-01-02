import { useContext } from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import { getSession } from 'next-auth/client';

import { Metrics } from '../components/context';
import { deleteInfo } from '../utils/APILogic';

import LifeTimeStats from '../components/Statistics/LifeTimeStats';
import Letters from '../components/Statistics/Letters';
import Pairs from '../components/Statistics/Pairs';

export async function getServerSideProps({ req }) {
  const session = await getSession({ req });
  return { props: { session } };
}

// To do: Maybe average wpm of last 10?

export default function Statistics({ session }) {
  const { metrics, setMetrics } = useContext(Metrics);
  const noSession = (<p>Please log in to track your lifetime statistics!</p>);
  const noData = (<p>No data logged!</p>);

  const removeInfo = async () => {
    await deleteInfo(session);
    setMetrics({});
  };

  if (!session || !Object.keys(metrics).length) {
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
      <h1>Statistics</h1>
      <main className="main" style={{ paddingTop: 0 }}>
        <LifeTimeStats chars={totalchars} time={totaltime} fastest={fastestwpm} />
        <Letters letterSet={singles} capital={false} />
        <Letters letterSet={singles} capital />
        <Pairs pairs={doubles} />
        <button type="button" className="delete" onClick={removeInfo} style={{ alignSelf: 'flex-end' }}>Reset all statistics</button>
      </main>
    </div>
  );
}
Statistics.propTypes = { session: PropTypes.object.isRequired };
