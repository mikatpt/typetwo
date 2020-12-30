import { get, post, update, del } from './routes';
import { formatLetters, formatStats, updateData } from '../../../utils/Logic';

export default async (req, res) => {
  const { query: { pid } } = req;

  if (req.method === 'GET') {
    const response = await get(pid, res);
    res.status(200).send(response);
  }

  if (req.method === 'POST') {
    // req.body = [[wordList, timeSpent, errors, digraphs, fifths],
    //  {totalchars, totaltime, fastestwpm, lastwpm, lasterrors, lastaccuracy,
    //    fifths, singles, doubles}]
    const totalchars = req.body[0][0].length;
    const timeSpent = req.body[0][1];
    const [wpm, err, acc] = formatStats(req.body[0]);
    const fifths = req.body[0][4];
    const [singles, doubles] = formatLetters(req.body[0][3], req.body[0][2]);
    const params = [pid, totalchars, timeSpent, wpm, wpm, err, acc, fifths, singles, doubles];

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
