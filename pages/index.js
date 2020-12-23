import { useState } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { getSession } from 'next-auth/client';

import { getInfo, sendInfo } from '../utils/APILogic';
import { formatStats, generateWords } from '../utils/Logic';
import styles from '../styles/Typing.module.css';

import RoundMetrics from '../components/RoundMetrics';
import Typer from '../components/Typer';
import RoundHistogram from '../components/RoundHistogram';

export async function getServerSideProps({ req }) {
  const session = await getSession({ req });
  let initMetrics;
  if (session) {
    const res = await getInfo(session);
    initMetrics = res.data;
  }
  initMetrics = initMetrics || [{}];
  return { props: { word: generateWords(200), session, initMetrics } };
}
/*
To do:
  - Stats component
  - Maybe move metrics up to _app?
*/

export default function TypeTwo({ word, session, initMetrics }) {
  const [metrics, setMetrics] = useState(initMetrics[0]);
  const [stats, setStats] = useState(formatStats(initMetrics[0]));

  // metrics: {id, user_id, totalWords, totalTime, fastestWPM,
  //           lastWPM, lastErrors, lastAccuracy, singles, doubles}
  // data: [wordList, timeSpent, errors, digraphs, fifths]
  // Send data to database.
  const sendData = (data) => {
    setStats(formatStats(data));
    if (session) {
      sendInfo(session, [data, metrics])
        .then(() => getInfo(session))
        .then((res) => setMetrics(res.data[0]));
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>TypeTwo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <RoundMetrics wpm={stats[0]} errors={stats[1]} acc={stats[2]} />
        <Typer word={word} sendData={sendData} />
        {stats[3] !== 0 && <RoundHistogram fifths={stats[3]} words={stats[4]} />}
      </main>
    </div>
  );
}

TypeTwo.propTypes = {
  word: PropTypes.string.isRequired,
  initMetrics: PropTypes.arrayOf(PropTypes.object).isRequired,
  session: PropTypes.shape({ expires: PropTypes.string,
    user: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      image: PropTypes.string,
    }) }),
};

TypeTwo.defaultProps = { session: null };
