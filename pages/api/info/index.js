import axios from 'axios';

export default async (req, res) => {
  const config = { params: req.query };

  if (req.method === 'GET') {
    let response;
    try {
      response = await axios.get('http://localhost:5001/db', config);
    } catch (e) {
      console.error(e);
      res.status(404).send('User has no typing info logged.');
    }
    res.status(200).send(response.data);
  }
};
