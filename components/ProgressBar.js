import { start, inc, done } from 'nprogress';

import Router from 'next/router';

let loading;
let timer;
const delay = 250;

const load = () => {
  if (loading) return;
  loading = true;

  timer = setTimeout(() => {
    start();
    const increment = setInterval(() => {
      if (loading) inc(0.2);
      else clearInterval(increment);
    }, 500);
  }, delay);
};

const end = () => {
  loading = false;
  clearTimeout(timer);
  done();
};

Router.events.on('routeChangeStart', load);
Router.events.on('routeChangeComplete', end);
Router.events.on('routeChangeError', end);

export default function ProgressBar() { return null; }
