import { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { getSession } from 'next-auth/client';

import { Metrics } from '../components/context';
import { getInfo, sendInfo, getSettings, sendSettings } from '../utils/APILogic';
import { generateWords } from '../utils/Logic';

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

  const getWords = (wordset = 0) => setWords(generateWords(wordset));

  useEffect(() => {
    if (session) {
      getSettings(session).then((res) => {
        if (res.data.length) {
          setPrefs(res.data[0]);
          getWords(res.data[0].wordset);
        }
      });
    } else getWords(0);
  }, []);

  const updateWords = (option) => {
    const update = { ...prefs, wordset: option };
    if (session) sendSettings(session, update);
    setPrefs(update);
    getWords(option);
  };

  const sendData = (data) => {
    setMetrics(data);
    if (session) sendInfo(session, metrics);
  };

  return (
    <div className="container">
      <Head>
        <title>TypeTwo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="main">
        <RoundMetrics metrics={metrics} wordset={prefs.wordset} updateWords={updateWords} />
        <Typer words={words} getWords={getWords} prefs={prefs} sendData={sendData} />
        <Instructions />
        {(metrics.words && metrics.data) && <RoundAnalysis metrics={metrics} />}
      </main>
    </div>
  );
}

TypeTwo.propTypes = { session: PropTypes.object };
TypeTwo.defaultProps = { session: null };
