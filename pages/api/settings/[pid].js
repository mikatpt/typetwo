import { getSettings, upsertSettings } from '../../../database/models';

export default async (req, res) => {
  const { query: { pid } } = req;

  if (req.method === 'GET') {
    let response;
    try {
      response = await getSettings([pid]);
    } catch (e) {
      console.error(e);
      res.status(404).send('Something went wrong in GETting info!');
    }
    res.status(200).send(response); // {user_id, wordset}
  }
  if (req.method === 'POST') {
    const params = [pid, req.body.wordset]; // add more settings here
    let response;
    try {
      response = await upsertSettings(params);
    } catch (e) {
      console.error(e);
      res.status(404).send('Something went wrong in POSTing info!');
    }
    res.status(200).send(response);
  }
};
