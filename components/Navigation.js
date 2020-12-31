import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/client';

import s from '../styles/components/Navigation.module.css';

export default function Navigation() {
  const [session] = useSession();
  return (
    <div className={s.navBar}>
      {!session && <div className={s.navItem} onClick={signIn} role="button" tabIndex={0} onKeyDown={signIn}><p className={s.signIn}>Sign In</p></div> }
      {session && (
        <div className={s.navItem} onClick={signOut} role="button" tabIndex={0} onKeyDown={signOut}><p className={s.signOut}>Sign Out</p></div>
      )}
      {session && (
        <Link href="/settings">
          <div className={s.navItem}>
            <img className={s.img} src={session.user.image} alt="" />
            <p className={s.txt}>{session.user.name ? session.user.name : session.user.email}</p>
          </div>
        </Link>
      )}
      <Link href="/"><div className={s.navItem}>Start Typing!</div></Link>
      <Link href="/statistics"><div className={s.navItem}>Statistics</div></Link>
      <Link href="/about"><div className={s.navItem}>About</div></Link>
    </div>
  );
}
