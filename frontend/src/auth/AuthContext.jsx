import { createContext, useState, useEffect } from 'react';
import axios from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (username, password, role) => {
    const res = await axios.post('accounts/token/', { username, password });
    localStorage.setItem('access_token', res.data.access);
    const profile = await axios.get('accounts/me/');
    if (profile.data.role !== role) throw new Error('Role mismatch');
    setUser(profile.data);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('accounts/me/');
        setUser(res.data);
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
