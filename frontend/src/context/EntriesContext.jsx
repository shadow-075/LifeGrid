import { createContext, useCallback, useContext, useRef, useState } from 'react';
import * as entryService from '../services/entryService';

const EntriesContext = createContext(null);

export const EntriesProvider = ({ children }) => {
  const [cache, setCache] = useState({}); // { [year]: entries[] }
  const [loadingYears, setLoadingYears] = useState({}); // { [year]: boolean }
  const inFlight = useRef({});

  const fetchYear = useCallback(
    async (year, { force = false } = {}) => {
      if (!force && cache[year]) return cache[year];
      if (inFlight.current[year]) return inFlight.current[year];

      setLoadingYears((prev) => ({ ...prev, [year]: true }));
      const promise = entryService
        .getEntriesForYear(year)
        .then((data) => {
          setCache((prev) => ({ ...prev, [year]: data.entries }));
          return data.entries;
        })
        .finally(() => {
          setLoadingYears((prev) => ({ ...prev, [year]: false }));
          delete inFlight.current[year];
        });

      inFlight.current[year] = promise;
      return promise;
    },
    [cache]
  );

  const invalidateYear = useCallback((year) => fetchYear(year, { force: true }), [fetchYear]);

  return (
    <EntriesContext.Provider value={{ cache, loadingYears, fetchYear, invalidateYear }}>
      {children}
    </EntriesContext.Provider>
  );
};

export const useEntriesContext = () => {
  const ctx = useContext(EntriesContext);
  if (!ctx) throw new Error('useEntriesContext must be used within EntriesProvider');
  return ctx;
};
