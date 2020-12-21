import PropTypes from 'prop-types';
import { signIn, signOut, useSession } from 'next-auth/client';

import { generateWords } from '../utils/Logic';
import styles from '../styles/Typing.module.css';

import Typer from '../components/Typer';

export async function getServerSideProps() {
  return { props: { word: generateWords(200) } };
}
/*
To do:
  - Head section with metadata
  - Add a <main> tag, perhaps?
  - Stats component
  - Navigation component
*/
export default function TypeTwo({ word }) {
  const [session] = useSession();
  console.log(session);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Welcome to TypeTwo!</h2>
      {!session && <>Not signed in <br /> <button onClick={signIn} type="button">Sign in</button></>}
      {session && <>Signed in as {session.user.email} <br /> <button onClick={signOut} type="button">Sign out</button></>}
      <Typer word={word} />
    </div>
  );
}

TypeTwo.propTypes = { word: PropTypes.string.isRequired };
