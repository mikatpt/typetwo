import { useState } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { getSession } from 'next-auth/client';

import { getInfo, sendInfo, getSettings, sendSettings } from '../utils/APILogic';
import { formatStats, generateWords } from '../utils/Logic';
import styles from '../styles/Index.module.css';

import RoundMetrics from '../components/RoundMetrics';
import Instructions from '../components/Instructions';
import Typer from '../components/Typer';
import RoundAnalysis from '../components/RoundAnalysis/Analysis';

export async function getServerSideProps({ req }) {
  const session = await getSession({ req });
  let initMetrics = {};
  let settings = { wordset: 0 }; // Initial default settings.
  if (session) {
    const res = await getInfo(session);
    const res2 = await getSettings(session);
    settings = res2.data.length ? res2.data[0] : settings;
    initMetrics = res.data.length ? res.data[0] : initMetrics;
  }
  return { props: { word: generateWords(settings.wordset), session, initMetrics, settings } };
}
/*
To do:
  - Stats component
  - Maybe move metrics up to _app?
*/

export default function TypeTwo({ word, session, initMetrics, settings }) {
  const [words, setWords] = useState(word);
  const [prefs, setPrefs] = useState(settings);
  const [metrics, setMetrics] = useState(initMetrics);
  const [stats, setStats] = useState(formatStats(initMetrics));

  const getWords = () => setWords(generateWords(prefs.wordset));

  const updateWords = (option) => {
    setPrefs((prev) => ({ ...prev, wordset: option }));
    setWords(generateWords(option));
  };

  // metrics: {id, user_id, totalWords, totalTime, fastestWPM,
  //           lastWPM, lastErrors, lastAccuracy, singles, doubles}
  // data: [wordList, timeSpent, errors, digraphs, fifths]
  // After each round, send data to database.
  const sendData = (data) => {
    setStats(formatStats(data));
    if (session) {
      sendInfo(session, [data, metrics])
        .then(() => getInfo(session))
        .then((res) => setMetrics(res.data[0]));
      sendSettings(session, prefs);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>TypeTwo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <RoundMetrics stats={stats} wordset={prefs.wordset} updateWords={updateWords} />
        <Instructions />
        <Typer words={words} getWords={getWords} sendData={sendData} />
        <RoundAnalysis stats={stats} />
      </main>
    </div>
  );
}

TypeTwo.propTypes = {
  word: PropTypes.string.isRequired,
  initMetrics: PropTypes.object.isRequired,
  settings: PropTypes.objectOf(PropTypes.number).isRequired,
  session: PropTypes.object,
};
TypeTwo.defaultProps = { session: null };
