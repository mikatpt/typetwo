import PropTypes from 'prop-types';

export default function RoundMetrics({ wpm, errors, acc }) {
  return (
    <div>
      Words per minute: {wpm}
      Errors: {errors}
      Accuracy: {acc}%
    </div>
  );
}

RoundMetrics.propTypes = {
  wpm: PropTypes.number.isRequired,
  errors: PropTypes.number.isRequired,
  acc: PropTypes.number.isRequired,
};
