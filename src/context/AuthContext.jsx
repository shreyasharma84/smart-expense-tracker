import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for mock session
    const storedUser = localStorage.getItem('mock_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Mock login logic
    if (email && password) { // Simple validation
      const mockUser = {
        name: email.split('@')[0], // Extract name from email for demo
        email: email,
        id: Date.now().toString()
      };
      setUser(mockUser);
      localStorage.setItem('mock_user', JSON.stringify(mockUser));
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const signup = (name, email, password) => {
    // Mock signup logic
    const mockUser = {
      name,
      email,
      id: Date.now().toString()
    };
    setUser(mockUser);
    localStorage.setItem('mock_user', JSON.stringify(mockUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mock_user');
  };

  const updateProfile = (data) => {
      setUser(prev => {
          const newUser = { ...prev, ...data };
          localStorage.setItem('mock_user', JSON.stringify(newUser));
          return newUser;
      });
      return { success: true };
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
