import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

function readStoredUser() {
  const raw = localStorage.getItem('classconnect_user');
  return raw ? JSON.parse(raw) : null;
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('classconnect_token'));
  const [user, setUser] = useState(readStoredUser);

  function loginWithSession(sessionToken, sessionUser) {
    localStorage.setItem('classconnect_token', sessionToken);
    localStorage.setItem('classconnect_user', JSON.stringify(sessionUser));
    setToken(sessionToken);
    setUser(sessionUser);
  }

  function logout() {
    localStorage.removeItem('classconnect_token');
    localStorage.removeItem('classconnect_user');
    setToken(null);
    setUser(null);
  }

  const value = { token, user, isAuthenticated: Boolean(token), loginWithSession, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
