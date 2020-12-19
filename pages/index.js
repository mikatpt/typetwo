import Head from 'next/head';
import Link from 'next/link';

import styles from '../styles/Home.module.css';

// store all chars in outgoing and incoming
// display only last 20 chars of outgoing and first 20 chars of incoming

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>TypeTwo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to TypeTwo!
        </h1>
        <div className={styles.grid}>
          <Link href="/typing">
            <div className={styles.card}>
              <h3>Typing App</h3>
            </div>
          </Link>

          <Link href="/about">
            <div className={styles.card}>
              <h3>About &rarr;</h3>
            </div>

          </Link>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  );
}
