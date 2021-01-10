import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/client';

import s from '../styles/components/Navigation.module.css';

export default function Navigation() {
  const [session] = useSession();
  return (
    <div className={s.navBar}>

      <Link href="/"><div className={s.navItem}>START TYPING!</div></Link>
      <Link href="/about"><div className={s.navItem}>ABOUT</div></Link>
      <Link href="/statistics"><div className={s.navItem}><img className={s.png} alt="a histogram" src="/histogram.png" />STATISTICS</div></Link>

      {!session && <div className={s.navItem} onClick={signIn} role="button" tabIndex={0} onKeyDown={signIn}><p className={s.signIn}>SIGN IN</p></div> }
      {session && (
      <Link href="/settings">
        <div className={s.navItem}>
          <img className={s.img} src={session.user.image} alt="" />
          <p className={s.txt}>{session.user.name
            ? (session.user.name).toUpperCase() : (session.user.email).toUpperCase()}
          </p>
        </div>
      </Link>
      )}
      {session && (
        <div className={s.navItem} onClick={signOut} role="button" tabIndex={0} onKeyDown={signOut}><p className={s.signOut}>SIGN OUT</p></div>
      )}
    </div>
  );
}
