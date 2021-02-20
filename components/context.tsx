import { createContext, useState, useEffect, ReactNode } from 'react';
import PropTypes from 'prop-types';

import { getSession } from 'next-auth/client';
import { getInfo } from '../utils/APILogic';

export type CharacterStore = {[pair: string]: {time: number; total:number; errors: number;}};

export type MetricsType = {
  doubles?: CharacterStore;
  singles?: CharacterStore;
  fifths?: number[];
  fastestwpm?: number;
  lastaccuracy?: number;
  lasterrors?: number;
  lastwpm?: number;
  totalchars?: number;
  totaltime?: number;
}

export type MetricsContextType = {
  metrics: MetricsType;
  setMetrics: (metrics: MetricsType) => void;
}

export const Metrics = createContext<MetricsContextType | null>(null);

export const MetricsContextProvider = ({ children }: { children: ReactNode }) => {
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
