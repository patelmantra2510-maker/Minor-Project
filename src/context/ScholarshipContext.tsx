import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Scholarship } from '../types/scholarship';
import { SCHOLARSHIPS_DATA } from '../data/scholarships';
import { getScholarships, recordScholarshipView } from '../services/scholarshipService';

interface ScholarshipContextType {
  scholarships: Scholarship[];
  loading: boolean;
  dataSource: 'sqlite' | 'supabase' | 'local_fallback';
  refreshScholarships: () => Promise<void>;
  trackScholarshipView: (id: string) => Promise<void>;
}

const ScholarshipContext = createContext<ScholarshipContextType>({
  scholarships: SCHOLARSHIPS_DATA,
  loading: false,
  dataSource: 'local_fallback',
  refreshScholarships: async () => {},
  trackScholarshipView: async () => {},
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

  const trackScholarshipView = async (id: string) => {
    try {
      const res = await recordScholarshipView(id);
      if (res && res.success) {
        setScholarships((prev) =>
          prev.map((s) => {
            if (s.id === id || s.slug === id) {
              return {
                ...s,
                views: res.views !== undefined ? res.views : (s.views || 0) + 1,
              };
            }
            return s;
          })
        );
      }
    } catch (err) {
      console.warn('[ScholarshipProvider] Failed to track scholarship view:', err);
    }
  };

  useEffect(() => {
    refreshScholarships();
  }, []);

  return (
    <ScholarshipContext.Provider
      value={{
        scholarships,
        loading,
        dataSource,
        refreshScholarships,
        trackScholarshipView,
      }}
    >
      {children}
    </ScholarshipContext.Provider>
  );
};

export const useScholarships = () => useContext(ScholarshipContext);
