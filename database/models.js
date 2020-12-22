import pool from './index';

export const getInfo = async (email) => {
  console.log(email);
  const query = `
  SELECT * FROM metrics
  LEFT JOIN users
  ON metrics.user_id = users.id
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
  INSERT INTO metrics(user_id, totalWords, totalTime, fastestWPM, singles, doubles)
  VALUES ((SELECT id FROM users WHERE email = $1), $2, $3, $4, $5, $6)
  `;

  let response;
  try {
    response = await pool.query(query, [params]);
  } catch (e) {
    console.error(e);
    throw (e);
  }
  return response;
};

// Expects that you've already made a successful GET and have user id.
export const updateInfo = async (params) => {
  const query = `
  UPDATE metrics
  SET totalWords = $1, totalTime = $2, fastestWPM = $3,
  singles = $4, doubles = $5
  WHERE user_id = $6;`;

  let response;
  try {
    response = await pool.query(query, [params]);
  } catch (e) {
    console.error(e);
    throw (e);
  }
  return response;
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
