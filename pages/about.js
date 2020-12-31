import Head from 'next/head';
import { getSession } from 'next-auth/client';

export async function getServerSideProps({ req }) {
  const session = await getSession({ req });
  return { props: { session } };
}

export default function About() {
  return (
    <div className="container">
      <Head><title>About</title></Head>
      <h1>About the project</h1>
      <main style={{ whiteSpace: 'pre' }}>
        <p>
          TypeTwo is a project built out of a composite of
          features that I wanted from a typing app.
        </p>
        <p>Key features:</p>
        <ul>
          <li>
            <p>
              A clean interface disincentivizing the use of backspace to
              <br />encourage typing correctly the first time, instead of correcting mistakes
            </p>
          </li>
          <li><p>An easy way to restart any passage to practice tricky words</p></li>
          <li><p>Word lists of various difficulties</p></li>
          <li><p>Letter pair speed tracking</p></li>
          <li><p>Specific all-time statistics covering letters, pairs, average speeds, etc.</p></li>
        </ul>
        <p>This project was heavily inspired by <a href="https://www.keybr.com/">keybr</a> and <a href="https://play.typeracer.com/">typeracer</a>, which I encourage you to check out if you haven&#39;t already!</p>
      </main>
    </div>
  );
}
