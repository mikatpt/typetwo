import { createContext, useState, useEffect, ReactNode } from 'react';
import PropTypes from 'prop-types';

import { getSession } from 'next-auth/client';
import { getInfo } from '../utils/APILogic';

export type CharacterStore = {[pair: string]: {time: number; total:number; errors: number;}};

export type MetricsType = {
  totalchars: number;
  fastestwpm: number;
  lastwpm: number;
  lastaccuracy: number;
  totaltime: number;
  lasterrors: number;
  lastfifths: number[];
  singles: CharacterStore;
  doubles: CharacterStore;
  errors?: {[chars: string]: { [key: string]: string;}};
  data?: Array<[string, number]>;
  words?: string;
}
export const initialMetrics: MetricsType = {
  totalchars: 0,
  fastestwpm: 0,
  lastwpm: 0,
  lastaccuracy: 0,
  lasterrors: 0,
  totaltime: 0,
  lastfifths: [],
  singles: {},
  doubles: {},
  errors: {},
  data: [],
};

export type MetricsContextType = {
  metrics: MetricsType;
  setMetrics: (metrics: MetricsType) => void;
}

export const Metrics = createContext<MetricsContextType | null>(null);

export const MetricsContextProvider = ({ children }: { children: ReactNode }) => {
  const [metrics, setMetrics] = useState(initialMetrics);

  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        getInfo(session).then((res) => (
          Object.keys(res.data).length && setMetrics(res.data)
        ));
      }
    });
  }, []);

  return (
    <Metrics.Provider value={{ metrics, setMetrics }}>
      {children}
    </Metrics.Provider>
  );
};
MetricsContextProvider.propTypes = { children: PropTypes.object.isRequired };
