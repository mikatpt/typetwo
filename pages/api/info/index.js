import { getInfo } from '../../../database/models';

export default async (req, res) => {
  if (req.method === 'GET') {
    let response;
    try {
      response = await getInfo(); // is this index.js useless? seems like it.
    } catch (e) {
      console.error(e);
      res.status(404).send('User has no typing info logged.');
    }
    res.status(200).json(response);
  }
};
