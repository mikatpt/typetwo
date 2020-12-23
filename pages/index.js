import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { getSession } from 'next-auth/client';

import { getInfo, sendInfo } from '../utils/APILogic';
import { formatStats, generateWords } from '../utils/Logic';
import styles from '../styles/Typing.module.css';

import RoundMetrics from '../components/RoundMetrics';
import Typer from '../components/Typer';

export async function getServerSideProps({ req }) {
  const session = await getSession({ req });
  return { props: { word: generateWords(200), session } };
}
/*
To do:
  - Head section with metadata
  - Add a <main> tag, perhaps?
  - Stats component
  - Navigation component
  - Maybe move metrics up to _app?
*/

export default function TypeTwo({ word, session }) {
  const [metrics, setMetrics] = useState({});
  const [stats, setStats] = useState([0, 0, 0]);
  useEffect(() => {
    if (session) {
      getInfo(session)
        .then((res) => {
          setMetrics(res.data[0]);
          setStats(formatStats(res.data[0]));
        });
    }
  }, []);

  // metrics: {id, user_id, totalWords, totalTime, fastestWPM,
  //           lastWPM, lastErrors, lastAccuracy, singles, doubles}
  // data: [wordList, timeSpent, errors, digraphs, fifths]
  // Send data to database.
  const sendData = (data) => {
    setStats(formatStats(data));
    if (session) {
      sendInfo(session, [data, metrics])
        .then(() => getInfo(session))
        .then((res) => setMetrics(res.data));
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

      </main>
    </div>
  );
}

TypeTwo.propTypes = {
  word: PropTypes.string.isRequired,
  session: PropTypes.shape({ expires: PropTypes.string,
    user: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      image: PropTypes.string,
    }) }),
};

TypeTwo.defaultProps = { session: null };
