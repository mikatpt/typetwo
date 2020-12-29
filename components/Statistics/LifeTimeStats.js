import PropTypes from 'prop-types';

import { msToMinutes } from '../../utils/Logic';

export default function LifeTimeStats({ chars, time, fastest }) {
  const lifetimewpm = ((chars / 5) * (60000 / time)).toFixed(2);
  const minutes = msToMinutes(time);
  const words = Math.floor(chars / 5);
  return (
    <table>
      <tbody>
        <tr><td>Total words typed:</td><td>{words}</td></tr>
        <tr><td>Time spent typing:</td><td>{minutes}</td></tr>
        <tr><td>Lifetime Average Speed:</td><td>{lifetimewpm}wpm</td></tr>
        <tr><td>Top Speed:</td><td>{fastest}wpm</td></tr>
      </tbody>
    </table>
  );
}
LifeTimeStats.propTypes = {
  chars: PropTypes.number.isRequired,
  time: PropTypes.number.isRequired,
  fastest: PropTypes.number.isRequired,
};
