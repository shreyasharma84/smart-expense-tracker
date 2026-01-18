import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const res = await api.get('profile/');
        setUser(res.data);
      } catch (error) {
        console.error(error);
        logout();
      }
    }
    setLoading(false);
  }

  const login = async (username, password) => {
    try {
      const res = await api.post('login/', { username, password });
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      await checkUser();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Login failed' };
    }
  };

  const signup = async (name, email, password) => {
    try {
      // Use email as username to ensure consistency with login
      await api.post('register/', {
        username: email,
        email,
        password,
        first_name: name
      });
      // Auto login after signup
      return await login(email, password);
    } catch (error) {
      console.error(error);
      return { success: false, error: 'Signup failed. Email might be already taken.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  };

  const updateProfile = async (data) => {
    try {
      const res = await api.put('profile/', data);
      setUser(res.data);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Update failed' };
    }
  }

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
