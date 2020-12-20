import PropTypes from 'prop-types';

import { generateWords } from '../utils/Logic';
import styles from '../styles/Home.module.css';

import Typer from '../components/Typer';

export async function getServerSideProps() {
  return { props: { word: generateWords(200) } };
}

export default function TypeTwo({ word }) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Welcome to TypeTwo!</h2>
      <Typer word={word} />
    </div>
  );
}

TypeTwo.propTypes = { word: PropTypes.string.isRequired };
