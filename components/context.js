import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { getSession } from 'next-auth/client';
import { getInfo } from '../utils/APILogic';

export const Metrics = createContext();

export const MetricsContextProvider = ({ children }) => {
  const [metrics, setMetrics] = useState({});

  useEffect(() => {
    getSession().then((session) => {
      if (session) getInfo(session).then((res) => res.data.length && setMetrics(res.data[0]));
    });
  }, []);

  return (
    <Metrics.Provider value={{ metrics, setMetrics }}>
      {children}
    </Metrics.Provider>
  );
};
MetricsContextProvider.propTypes = { children: PropTypes.object.isRequired };
