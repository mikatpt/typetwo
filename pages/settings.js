import Head from 'next/head';
import { getSession } from 'next-auth/client';

export async function getServerSideProps({ req }) {
  const session = await getSession({ req });
  return { props: { session } };
}

export default function Settings() {
  return (
    <div>
      <Head><title>Settings</title></Head>
      <h1>Settings</h1>
    </div>
  );
}
