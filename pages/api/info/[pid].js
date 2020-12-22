import { getInfo } from '../../../database/models';

export default async (req, res) => {
  const { query: { pid } } = req;
  if (req.method === 'GET') {
    let response;
    try {
      response = await getInfo(pid);
    } catch (e) {
      console.error(e);
      res.status(404).send('User has no typing info logged.');
    }
    res.status(200).send(response);
  }
};
