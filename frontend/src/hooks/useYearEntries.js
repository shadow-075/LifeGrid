import { useEffect } from 'react';
import { useEntriesContext } from '../context/EntriesContext';

// Returns { entries, loading, refresh } for a given calendar year,
// fetching it once and reusing the shared cache after that.
const useYearEntries = (year) => {
  const { cache, loadingYears, fetchYear, invalidateYear } = useEntriesContext();

  useEffect(() => {
    fetchYear(year);
  }, [year, fetchYear]);

  return {
    entries: cache[year] || [],
    loading: !!loadingYears[year] && !cache[year],
    refresh: () => invalidateYear(year),
  };
};

export default useYearEntries;
