'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Import Bootstrap JS on client side
    require('bootstrap/dist/js/bootstrap.bundle.min.js');

    const storedUser = sessionStorage.getItem('user');
    const token = sessionStorage.getItem('token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (userData) => {
    // Only store essential user information
    const essentialUser = {
      id: userData.user.id,
      name: userData.user.name,
      email: userData.user.email,
      role: userData.user.role
    };
    
    sessionStorage.setItem('user', JSON.stringify(essentialUser));
    sessionStorage.setItem('token', userData.user.token);
    setUser(essentialUser);
    router.push('/dashboard');
  };

  const logout = () => {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
