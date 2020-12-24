import { getInfo, insertInfo, updateInfo } from '../../../database/models';

export const get = async (pid, res) => {
  let response;
  try {
    response = await getInfo([pid]);
  } catch (e) {
    console.error(e);
    res.status(404).send('Something went wrong in GETting info!');
  }
  return response;
};

export const post = async (params, res) => {
  let response;
  try {
    response = await insertInfo(params);
  } catch (e) {
    console.error(e);
    res.status(404).send('Something went wrong in POSTing data!');
  }
  return response;
};

export const update = async (params, res) => {
  let response;
  try {
    response = await updateInfo(params);
  } catch (e) {
    console.error(e);
    res.status(404).send('Something went wrong in updating data!');
  }
  return response;
};
