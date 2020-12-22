import pool from './index';

export const getInfo = async (email) => {
  const query = `
  SELECT m.totalwords, m.totaltime, m.fastestwpm, m.lastwpm, m.lasterrors,
  m.lastaccuracy, m.fifths, m.singles, m.doubles
  FROM metrics AS m
  LEFT JOIN users
  ON m.user_id = users.id
  WHERE users.id = (SELECT id FROM users WHERE email = $1);`;

  let response;
  try {
    response = await pool.query(query, [email]);
  } catch (e) {
    console.error(e);
    throw (e);
  }
  return response.rows;
};

export const insertInfo = async (params) => {
  const query = `
  INSERT INTO metrics(user_id, totalWords, totalTime, fastestWPM,
    lastWPM, lastErrors, lastAccuracy, fifths, singles, doubles)
  VALUES ((SELECT id FROM users WHERE email = $1), $2, $3, $4, $5, $6, $7, $8, $9, $10)
  `;

  try {
    await pool.query(query, params);
  } catch (e) {
    console.error(e);
    throw (e);
  }
  return `Successfully saved data for ${params[0]}`;
};

export const updateInfo = async (params) => {
  const query = `
  UPDATE metrics
  SET totalWords = $2, totalTime = $3, fastestWPM = $4,
  lastWPM = $5, lastErrors = $6, lastAccuracy = $7,
  fifths = $8, singles = $9, doubles = $10
  WHERE user_id = (SELECT id FROM users WHERE email = $1);`;

  try {
    await pool.query(query, params);
  } catch (e) {
    console.error(e);
    throw (e);
  }
  return `Successfully updated data for ${params[0]}`;
};

export const deleteInfo = async (params) => {
  const query = `
  DELETE FROM metrics
  WHERE user_id = (SELECT id FROM users WHERE email = $1);`;

  let response;
  try {
    response = await pool.query(query, [params]);
  } catch (e) {
    console.error(e);
    throw (e);
  }
  return response;
};
