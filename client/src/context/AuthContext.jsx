import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginCustomer, registerCustomer, getCustomerProfile, loginAdmin, getAdminMe } from '../services/authService';
import { getPublicSettings } from '../services/settingsService';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { addToast } = useToast();

  // Customer State
  const [user, setUser] = useState(null);
  const [userToken, setUserToken] = useState(() => localStorage.getItem('customer_token'));
  const [isUserLoading, setIsUserLoading] = useState(true);

  // Admin State
  const [admin, setAdmin] = useState(null);
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('admin_token'));
  const [isAdminLoading, setIsAdminLoading] = useState(true);

  // Global Settings State
  const [settings, setSettings] = useState(null);

  const fetchSettings = useCallback(async () => {
    try {
      const data = await getPublicSettings();
      setSettings(data);
    } catch (e) {
      console.error('Failed to load store settings', e);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Load customer profile if token exists
  useEffect(() => {
    const initCustomer = async () => {
      if (userToken) {
        try {
          const profile = await getCustomerProfile();
          setUser(profile);
        } catch (err) {
          console.warn('Customer session expired or invalid');
          localStorage.removeItem('customer_token');
          setUserToken(null);
          setUser(null);
        }
      }
      setIsUserLoading(false);
    };
    initCustomer();
  }, [userToken]);

  // Load admin profile if admin token exists
  useEffect(() => {
    const initAdmin = async () => {
      if (adminToken) {
        try {
          const adminMe = await getAdminMe();
          setAdmin(adminMe);
        } catch (err) {
          console.warn('Admin session expired or invalid');
          localStorage.removeItem('admin_token');
          setAdminToken(null);
          setAdmin(null);
        }
      }
      setIsAdminLoading(false);
    };
    initAdmin();
  }, [adminToken]);

  // Unified login handler (routes according to role)
  const handleUnifiedLogin = async (credentials) => {
    const data = await loginCustomer(credentials);
    if (data.role === 'admin') {
      localStorage.setItem('admin_token', data.token);
      setAdminToken(data.token);
      setAdmin(data);
      addToast(`স্বাগতম অ্যাডমিন ${data.name}!`, 'success');
    } else {
      localStorage.setItem('customer_token', data.token);
      setUserToken(data.token);
      setUser(data);
      addToast(`স্বাগতম, ${data.name}!`, 'success');
    }
    return data;
  };

  const handleCustomerRegister = async (formData) => {
    const data = await registerCustomer(formData);
    localStorage.setItem('customer_token', data.token);
    setUserToken(data.token);
    setUser(data);
    addToast('অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে! আবু আহমেদ কালেকশনে আপনাকে স্বাগতম।', 'success');
    return data;
  };

  const handleCustomerLogout = () => {
    localStorage.removeItem('customer_token');
    setUserToken(null);
    setUser(null);
    addToast('আপনি সফলভাবে লগআউট হয়েছেন।', 'info');
  };

  // Dedicated Admin Authentication handlers
  const handleAdminLogin = async (credentials) => {
    const data = await loginAdmin(credentials);
    localStorage.setItem('admin_token', data.token);
    setAdminToken(data.token);
    setAdmin(data);
    addToast(`স্বাগতম অ্যাডমিন ${data.name}!`, 'success');
    return data;
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('admin_token');
    setAdminToken(null);
    setAdmin(null);
    addToast('অ্যাডমিন সফলভাবে লগআউট হয়েছেন।', 'info');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userToken,
        isUserLoading,
        login: handleUnifiedLogin,
        customerLogin: handleUnifiedLogin,
        customerRegister: handleCustomerRegister,
        customerLogout: handleCustomerLogout,
        setUser,

        admin,
        adminToken,
        isAdminLoading,
        adminLogin: handleAdminLogin,
        adminLogout: handleAdminLogout,

        settings,
        refreshSettings: fetchSettings
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
