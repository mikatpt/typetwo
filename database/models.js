import pool from './index';

const get = async (query, email) => {
  let response;
  try {
    response = await pool.query(query, email);
  } catch (e) {
    console.error(e);
    throw (e);
  }
  return response.rows;
};

const upsert = async (query, params) => {
  try {
    await pool.query(query, params);
  } catch (e) {
    console.error(e);
    throw (e);
  }
  return `Successfully saved data for ${params[0]}`;
};

const remove = async (query, params) => {
  try {
    await pool.query(query, params);
  } catch (e) {
    console.error(e);
    throw (e);
  }
  return `Removed ${params[0]} from the database.`;
};

export const getInfo = async (email) => {
  const query = `
  SELECT m.totalchars, m.totaltime, m.fastestwpm, m.lastwpm, m.lasterrors,
  m.lastaccuracy, m.fifths, m.singles, m.doubles
  FROM metrics AS m
  LEFT JOIN users
  ON m.user_id = users.id
  WHERE users.id = (SELECT id FROM users WHERE email = $1);`;

  return get(query, email);
};

export const insertInfo = async (params) => {
  const query = `
  INSERT INTO metrics(user_id, totalchars, totalTime, fastestWPM,
    lastWPM, lastErrors, lastAccuracy, fifths, singles, doubles)
  VALUES ((SELECT id FROM users WHERE email = $1), $2, $3, $4, $5, $6, $7, $8, $9, $10)`;

  return upsert(query, params);
};

export const updateInfo = async (params) => {
  const query = `
  UPDATE metrics
  SET totalchars = $2, totalTime = $3, fastestWPM = $4,
  lastWPM = $5, lastErrors = $6, lastAccuracy = $7,
  fifths = $8, singles = $9, doubles = $10
  WHERE user_id = (SELECT id FROM users WHERE email = $1);`;

  return upsert(query, params);
};

export const deleteInfo = async (params) => {
  const query = `
  DELETE FROM metrics
  WHERE user_id = (SELECT id FROM users WHERE email = $1);`;

  return remove(query, params);
};

export const getSettings = async (email) => {
  const query = `
  SELECT * FROM settings
  WHERE user_id = (SELECT id FROM users WHERE email = $1);`;

  return get(query, email);
};

export const upsertSettings = async (params) => {
  const query = `
  INSERT INTO settings(user_id, wordset)
  VALUES ((SELECT id FROM users WHERE email = $1), $2)
  ON CONFLICT (user_id) DO UPDATE SET
  wordset = $2`;

  return upsert(query, params);
};

export const deleteSettings = async (params) => {
  const query = `
  DELETE FROM settings
  WHERE user_id = (SELECT id FROM users WHERE email = $1)`;

  return remove(query, params);
};
