import PropTypes from 'prop-types';
import Head from 'next/head';
import { getSession, signOut } from 'next-auth/client';

import { deleteSettings } from '../utils/APILogic';

export async function getServerSideProps({ req }) {
  const session = await getSession({ req });
  return { props: { session } };
}

export default function Settings({ session }) {
  const deleteAccount = async () => {
    await deleteSettings(session);
    signOut();
  };
  return (
    <div className="container">
      <Head><title>Settings</title></Head>
      <h1>Settings</h1>
      <button type="button" className="delete" onClick={deleteAccount}>Delete Account</button>
      <p>This will delete ALL of your information from our database.<br />
        If you would instead like to reset your statistics,
        you may do so from the Statistics page.
      </p>
    </div>
  );
}
Settings.propTypes = { session: PropTypes.object.isRequired };
