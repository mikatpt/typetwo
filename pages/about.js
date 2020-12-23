import Head from 'next/head';
import { getSession } from 'next-auth/client';

export async function getServerSideProps({ req }) {
  const session = await getSession({ req });
  return { props: { session } };
}

export default function About() {
  return (
    <div>
      <Head><title>About</title></Head>
      <h1>About the project</h1>
    </div>
  );
}
