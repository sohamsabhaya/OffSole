import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../api/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = async () => {
    try {
      const data = await authService.checkStatus();
      setIsAuthenticated(data.is_authenticated || false);
      setUser(data.username || null);
      setIsAdmin(Boolean(data.is_admin || data.is_staff || data.username === 'admin'));
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
      setUser(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials);
      if (data.success) {
        await checkAuthStatus();
        // After checkAuthStatus, isAdmin state is updated — read the fresh status
        const statusData = await authService.checkStatus();
        const adminFlag = Boolean(statusData.is_admin || statusData.is_staff || statusData.username === 'admin');
        return { success: true, message: data.message, isAdmin: adminFlag };
      }
      return { success: false, message: data.message || 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.detail || error.response?.data?.message || 'Login failed' 
      };
    }
  };


  const signup = async (userData) => {
    try {
      const data = await authService.signup(userData);
      if (data.success) {
        await checkAuthStatus();
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message || 'Signup failed' };
    } catch (error) {
      console.error('Signup error:', error);
      return { 
        success: false, 
        message: error.response?.data?.detail || error.response?.data?.message || 'Signup failed' 
      };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      setIsAdmin(false);
    }
  };

  const deleteAccount = async () => {
    try {
      const data = await authService.deleteAccount();
      setIsAuthenticated(false);
      setUser(null);
      setIsAdmin(false);
      return { success: true, message: data.message };
    } catch (error) {
      console.error('Error deleting account:', error);
      return {
        success: false,
        message: error.response?.data?.detail || 'Failed to delete account'
      };
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const value = {
    isAuthenticated,
    user,
    isAdmin,
    loading,
    login,
    signup,
    logout,
    deleteAccount,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;