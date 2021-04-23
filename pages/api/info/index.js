import axios from 'axios';

export default async (req, res) => {
  const config = { params: req.query };

  if (req.method === 'GET') {
    let response;
    try {
      response = await axios.get('http://localhost:5001/db', config);
    } catch (e) {
      res.setHeader('Content-Type', 'text/plain');
      console.error(e);
      res.status(404).send('User has no typing info logged.');
    }
    res.status(200).send(response.data);
  } else if (req.method === 'POST') {
    let response;
    res.setHeader('Content-Type', 'text/plain');

    try {
      response = await axios.post('http://localhost:5001/db', req.body, config);
      res.status(200).send('Successfully saved data.');
    } catch (e) {
      console.error(e.response.statusText);
      res.status(404).send('Something went wrong in posting data.');
    }
  }
};
