import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminLogin as apiAdminLogin } from '../../services/scholarshipService';

interface AdminContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType>({
  isAuthenticated: false,
  token: null,
  login: async () => ({ success: false }),
  logout: () => {},
});

const STORAGE_KEY = 'edvora_admin_token';

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  });

  const isAuthenticated = Boolean(token);

  useEffect(() => {
    if (token) {
      sessionStorage.setItem(STORAGE_KEY, token);
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, [token]);

  const login = async (password: string): Promise<{ success: boolean; error?: string }> => {
    const res = await apiAdminLogin(password);
    if (res.success && res.token) {
      setToken(res.token);
      return { success: true };
    }
    return { success: false, error: res.error || 'Authentication failed' };
  };

  const logout = () => {
    setToken(null);
    sessionStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AdminContext.Provider value={{ isAuthenticated, token, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
