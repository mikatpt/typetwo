import Head from 'next/head';
import { getSession } from 'next-auth/client';

export async function getServerSideProps({ req }) {
  const session = await getSession({ req });
  return { props: { session } };
}

export default function Statistics() {
  return (
    <div className="container">
      <Head><title>Statistics</title></Head>
      <h1>Statistics</h1>
    </div>
  );
}
