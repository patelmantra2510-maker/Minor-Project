import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Scholarship } from '../types/scholarship';
import { SCHOLARSHIPS_DATA } from '../data/scholarships';
import { getScholarships } from '../services/scholarshipService';

interface ScholarshipContextType {
  scholarships: Scholarship[];
  loading: boolean;
  dataSource: 'sqlite' | 'supabase' | 'local_fallback';
  refreshScholarships: () => Promise<void>;
}

const ScholarshipContext = createContext<ScholarshipContextType>({
  scholarships: SCHOLARSHIPS_DATA,
  loading: false,
  dataSource: 'local_fallback',
  refreshScholarships: async () => {},
});

export const ScholarshipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scholarships, setScholarships] = useState<Scholarship[]>(SCHOLARSHIPS_DATA);
  const [loading, setLoading] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<'sqlite' | 'supabase' | 'local_fallback'>('local_fallback');

  const refreshScholarships = async () => {
    setLoading(true);
    try {
      const result = await getScholarships();
      if (result && result.data && result.data.length > 0) {
        setScholarships(result.data);
        setDataSource(result.source);
      }
    } catch (err) {
      console.warn('[ScholarshipProvider] Failed to load scholarships, falling back to local data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshScholarships();
  }, []);

  return (
    <ScholarshipContext.Provider value={{ scholarships, loading, dataSource, refreshScholarships }}>
      {children}
    </ScholarshipContext.Provider>
  );
};

export const useScholarships = () => useContext(ScholarshipContext);
