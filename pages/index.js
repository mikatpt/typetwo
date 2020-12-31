import { useState } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { getSession } from 'next-auth/client';

import { getInfo, sendInfo, getSettings, sendSettings } from '../utils/APILogic';
import { formatStats, generateWords } from '../utils/Logic';

import RoundMetrics from '../components/RoundMetrics';
import Instructions from '../components/Instructions';
import Typer from '../components/Typing/Typer';
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

export default function TypeTwo({ word, session, initMetrics, settings }) {
  const [words, setWords] = useState(word);
  const [prefs, setPrefs] = useState(settings);
  const [metrics, setMetrics] = useState(initMetrics);
  const [stats, setStats] = useState(formatStats(initMetrics));

  const getWords = (wordset = 0) => setWords(generateWords(wordset));

  const updateWords = (option) => {
    const update = { ...prefs, wordset: option };
    if (session) sendSettings(session, update);
    setPrefs(update);
    setWords(generateWords(option));
  };

  const sendData = (data) => {
    setStats(formatStats(data));
    if (session) {
      sendInfo(session, [data, metrics])
        .then(() => getInfo(session))
        .then((res) => setMetrics(res.data[0]));
    }
  };

  return (
    <div className="container">
      <Head>
        <title>TypeTwo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="main">
        <RoundMetrics stats={stats} wordset={prefs.wordset} updateWords={updateWords} />
        <Instructions />
        <Typer words={words} getWords={getWords} prefs={prefs} sendData={sendData} />
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
