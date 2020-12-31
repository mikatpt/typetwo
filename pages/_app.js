/* eslint-disable react/prop-types */
import Router from 'next/router';
import Link from 'next/link';
import { Provider } from 'next-auth/client';
import { start, done } from 'nprogress';

import 'nprogress/nprogress.css';
import '../styles/globals.css';

import Navigation from '../components/Navigation';

Router.events.on('routeChangeStart', () => start());
Router.events.on('routeChangeComplete', () => done());
Router.events.on('routeChangeError', () => done());

export default function MyApp({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <Link href="/"><h1 id="title">TypeTwo</h1></Link>
      <Navigation />
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
