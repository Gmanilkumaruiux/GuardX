import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Initial bootstrap users for the prototype database
const INITIAL_USERS = [
  { id: 'u-1', name: 'System Administrator', email: 'admin@guardx.com', password: 'admin', role: 'admin', riskScore: 0, status: 'Active', deviceCount: 1 },
  { id: 'u-2', name: 'John Doe', email: 'john.doe@example.com', password: 'password123', role: 'user', riskScore: 15, status: 'Active', deviceCount: 1 },
  { id: 'u-3', name: 'Alice Smith', email: 'alice@domain.com', password: 'password123', role: 'user', riskScore: 5, status: 'Active', deviceCount: 1 },
  { id: 'u-4', name: 'Suspicious Bot', email: 'spammer99@x.com', password: 'password123', role: 'user', riskScore: 95, status: 'Blocked', deviceCount: 5 }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usersDb, setUsersDb] = useState([]);
  const navigate = useNavigate();

  // Load database from localStorage on startup
  useEffect(() => {
    const savedDb = localStorage.getItem('guardx_users_db');
    if (savedDb) {
      setUsersDb(JSON.parse(savedDb));
    } else {
      localStorage.setItem('guardx_users_db', JSON.stringify(INITIAL_USERS));
      setUsersDb(INITIAL_USERS);
    }

    const session = localStorage.getItem('guardx_session');
    if (session) {
      setUser(JSON.parse(session));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Fetch up-to-date DB
        const currentDb = JSON.parse(localStorage.getItem('guardx_users_db')) || INITIAL_USERS;
        const matched = currentDb.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (matched) {
          if (matched.status === 'Blocked' || matched.status === 'Suspended') {
            reject(new Error('This account has been administratively BLOCKED due to high risk scores.'));
            return;
          }
          
          const isCorrectPassword = matched.password === password || 
            (matched.email.toLowerCase() === 'admin@guardx.com' && (password === 'password123' || password === 'password'));
          
          if (isCorrectPassword) {
            setUser(matched);
            localStorage.setItem('guardx_session', JSON.stringify(matched));
            resolve(matched);
          } else {
            reject(new Error('Invalid password. Authentication failed.'));
          }
        } else {
          reject(new Error('Email address not registered. Please sign up first.'));
        }
      }, 600);
    });
  };

  const register = async (email, password, name) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentDb = JSON.parse(localStorage.getItem('guardx_users_db')) || INITIAL_USERS;
        
        // Add default device count
        const newUser = { 
          id: `u-${Date.now()}`, 
          name, 
          email, 
          password, 
          role: email.toLowerCase().includes('admin') ? 'admin' : 'user', 
          riskScore: 0, 
          status: 'Active',
          deviceCount: 1 
        };
        
        const updatedDb = [...currentDb, newUser];
        localStorage.setItem('guardx_users_db', JSON.stringify(updatedDb));
        setUsersDb(updatedDb);
        
        // Disable auto-login on signup to enforce manual login validation
        // setUser(newUser);
        // localStorage.setItem('guardx_session', JSON.stringify(newUser));
        resolve(newUser);
      }, 600);
    });
  };

  const logout = (email) => {
    navigate('/', { replace: true });
    setTimeout(() => {
      setUser(null);
      localStorage.removeItem('guardx_session');
    }, 50);
  };

  // Administrative blocks/unblocks
  const administrativeSetStatus = (id, newStatus) => {
    const currentDb = JSON.parse(localStorage.getItem('guardx_users_db')) || INITIAL_USERS;
    const updatedDb = currentDb.map(u => {
      if (u.id === id || u.email === id) {
        return { 
          ...u, 
          status: newStatus,
          riskScore: newStatus === 'Blocked' ? 100 : 0
        };
      }
      return u;
    });
    localStorage.setItem('guardx_users_db', JSON.stringify(updatedDb));
    setUsersDb(updatedDb);

    // If current session user is blocked, force logout!
    if (user && (user.id === id || user.email === id) && newStatus === 'Blocked') {
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      usersDb, 
      login, 
      logout, 
      register, 
      loading,
      administrativeSetStatus 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
