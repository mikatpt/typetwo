import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { signIn, signOut, getSession } from 'next-auth/client';
import axios from 'axios';

import { generateWords } from '../utils/Logic';
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
  const [metrics, setMetrics] = useState();
  const [stats, setStats] = useState([0, 0, 0]);
  useEffect(() => {
    if (session) {
      axios.get(`http://localhost:3000/api/info/${session.user.email}`)
        .then((res) => {
          console.log('data:', res);
          setMetrics(res.data);
        });
    }
  }, []);

  // Send data to database.
  // data: [wordList, timeSpent, errors, digraphs, fifths]
  const sendData = (data) => {
    const wpm = ((data[0].length / 5) * (60000.0 / data[1])).toFixed(2);
    const errors = Object.keys(data[2]).length;
    const acc = ((100 * (data[0].length - errors)) / data[0].length).toFixed(2);
    console.log(data);
    setStats([Number(wpm), errors, Number(acc)]);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Welcome to TypeTwo!</h2>
      {!session && <>Not signed in <br /> <button onClick={signIn} type="button">Sign in</button></>}
      {session && <>Signed in as {session.user.email} <br /> <button onClick={signOut} type="button">Sign out</button></>}
      <RoundMetrics wpm={stats[0]} errors={stats[1]} acc={stats[2]} />
      <Typer word={word} sendData={sendData} />
    </div>
  );
}

TypeTwo.propTypes = {
  word: PropTypes.string.isRequired,
  session: PropTypes.shape({ expires: PropTypes.string,
    user: PropTypes.shape({
      user: PropTypes.string,
      email: PropTypes.string,
      image: PropTypes.string,
    }) }).isRequired,
};
