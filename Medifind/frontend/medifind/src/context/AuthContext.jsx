import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load auth info from sessionStorage on startup
    const token = sessionStorage.getItem('medifind_token');
    const role = sessionStorage.getItem('medifind_role');
    const name = sessionStorage.getItem('medifind_name');
    const email = sessionStorage.getItem('medifind_email');

    if (token && role && name && email) {
      setUser({ token, role, name, email });
    }
    setLoading(false);
  }, []);

  const login = (token, registeredName) => {
    try {
      // Decode JWT token manually without library
      const base64 = token.split('.')[1];
      // Decode base64 unicode safely
      const decoded = JSON.parse(atob(base64));
      
      const role = decoded.role || 'USER';
      const email = decoded.sub || '';
      const name = registeredName || decoded.name || email.split('@')[0] || 'User';

      sessionStorage.setItem('medifind_token', token);
      sessionStorage.setItem('medifind_role', role);
      sessionStorage.setItem('medifind_name', name);
      sessionStorage.setItem('medifind_email', email);

      setUser({ token, role, name, email });
      return { role, name, email };
    } catch (error) {
      console.error('Error decoding token:', error);
      throw new Error('Invalid token format');
    }
  };

  const logout = () => {
    sessionStorage.removeItem('medifind_token');
    sessionStorage.removeItem('medifind_role');
    sessionStorage.removeItem('medifind_name');
    sessionStorage.removeItem('medifind_email');
    setUser(null);
  };

  const updateName = (newName) => {
    sessionStorage.setItem('medifind_name', newName);
    setUser((prev) => (prev ? { ...prev, name: newName } : null));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateName }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
