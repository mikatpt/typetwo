import { get, post, update, del } from './routes';
import { formatLetters, formatStats, updateData } from '../../../utils/Logic';

export default async (req, res) => {
  const { query: { pid } } = req;

  if (req.method === 'GET') {
    const response = await get(pid, res);
    res.status(200).send(response);
  }

  if (req.method === 'POST') {
    const {
      words, totaltime, lastwpm, lasterrors, lastaccuracy, lastfifths, data, errors,
    } = req.body[0];

    const len = words.length;
    const [singles, doubles] = formatLetters(data, errors);
    const params = [
      pid, len, totaltime, lastwpm, lastwpm, lasterrors, lastaccuracy, lastfifths, singles, doubles,
    ];

    let response;
    if (!Object.keys(req.body[1]).length) {
      response = await post(params, res);
    } else {
      const toSend = updateData(req.body[1], params);
      response = await update(toSend, res);
    }
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(response);
  }
  if (req.method === 'DELETE') {
    res.setHeader('Content-Type', 'text/plain');
    const response = del(pid, res);
    res.status(200).send(response);
  }
};
