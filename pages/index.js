import { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { getSession } from 'next-auth/client';

import { Metrics } from '../components/context';
import { getInfo, sendInfo, getSettings, sendSettings } from '../utils/APILogic';
import { formatStats, generateWords } from '../utils/Logic';

import RoundMetrics from '../components/RoundMetrics';
import Instructions from '../components/Instructions';
import Typer from '../components/Typing/Typer';
import RoundAnalysis from '../components/RoundAnalysis/Analysis';

export async function getServerSideProps({ req }) {
  const session = await getSession({ req });
  return { props: { session } };
}

export default function TypeTwo({ session }) {
  const [words, setWords] = useState('');
  const [prefs, setPrefs] = useState({ wordset: 0 });
  const { metrics, setMetrics } = useContext(Metrics);
  const [stats, setStats] = useState(formatStats(metrics));

  useEffect(() => {
    if (session) {
      getSettings(session).then((res) => {
        if (res.data.length) {
          setPrefs(res.data[0]);
          setWords(generateWords(res.data[0].wordset));
        }
      });
    } else setWords(generateWords(0));
  }, []);

  useEffect(() => {
    if (Object.keys(metrics).length && !stats[3]) setStats(formatStats(metrics));
  }, [metrics]);

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
        .then((res) => setMetrics(res.data));
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
        <Typer words={words} getWords={getWords} prefs={prefs} sendData={sendData} />
        <Instructions />
        <RoundAnalysis stats={stats} />
      </main>
    </div>
  );
}

TypeTwo.propTypes = { session: PropTypes.object };
TypeTwo.defaultProps = { session: null };
