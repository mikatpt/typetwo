import { useState } from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import { getSession } from 'next-auth/client';

import { getInfo, deleteInfo } from '../utils/APILogic';

import LifeTimeStats from '../components/Statistics/LifeTimeStats';
import Letters from '../components/Statistics/Letters';
import Pairs from '../components/Statistics/Pairs';

export async function getServerSideProps({ req }) {
  let metrics = {};
  const session = await getSession({ req });
  if (session) {
    const res = await getInfo(session);
    metrics = res.data.length ? res.data[0] : metrics;
  }
  return { props: { session, metrics } };
}

// To do: Maybe average wpm of last 10?

export default function Statistics({ session, metrics }) {
  const [stats, setStats] = useState(metrics);
  const noSession = (<p>Please log in to track your lifetime statistics!</p>);
  const noData = (<p>No data logged. Start typing!</p>);
  const removeInfo = async () => {
    await deleteInfo(session);
    setStats({});
  };

  if (!session || !Object.keys(stats).length) {
    return (
      <div className="container">
        <Head><title>Statistics</title></Head>
        <h1>Statistics</h1>
        {!session ? noSession : noData}
      </div>
    );
  }
  const { totalchars, totaltime, fastestwpm, singles, doubles } = stats;

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
Statistics.propTypes = {
  session: PropTypes.object.isRequired,
  metrics: PropTypes.object.isRequired,
};
