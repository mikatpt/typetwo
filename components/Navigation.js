import PropTypes from 'prop-types';
import Link from 'next/link';
import { signIn, signOut, getSession } from 'next-auth/client';

import styles from '../styles/Navigation.module.css';

export async function getServerSideProps({ req }) {
  const session = await getSession({ req });
  return { props: { session } };
}

export default function Navigation({ session }) {
  return (
    <div className={styles.navBar}>
      {!session && <div className={styles.navItem} onClick={signIn} role="button" tabIndex={0} onKeyDown={signIn}><p className={styles.signIn}>Sign In</p></div> }
      {session && (
        <div className={styles.navItem} onClick={signOut} role="button" tabIndex={0} onKeyDown={signOut}><p className={styles.signOut}>Sign Out</p></div>
      )}
      {session && (
        <div className={styles.navItem} style={{ cursor: 'default' }}>
          <img className={styles.img} src={session.user.image} alt="" />
          <p className={styles.txt}>{session.user.name ? session.user.name : session.user.email}</p>
        </div>
      )}

      <Link href="/"><div className={styles.navItem}>Start Typing!</div></Link>
      <Link href="/about"><div className={styles.navItem}>About</div></Link>
      <Link href="/statistics"><div className={styles.navItem}>Statistics</div></Link>
      <Link href="/settings"><div className={styles.navItem}>Settings</div></Link>

    </div>
  );
}

Navigation.propTypes = {
  session: PropTypes.shape({ expires: PropTypes.string,
    user: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      image: PropTypes.string,
    }) }),
};
Navigation.defaultProps = { session: null };
