/* eslint-disable react/prop-types */
import Link from 'next/link';
import { Provider } from 'next-auth/client';

import '../styles/globals.css';

import Navigation from '../components/Navigation';

export default function MyApp({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <Link href="/">
        <h1 id="title">TypeTwo</h1>
      </Link>
      <Navigation {...pageProps} />

      <Component {...pageProps} />
      <footer className="footer">
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className="logo" />
        </a>
      </footer>
    </Provider>
  );
}
