import { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { isTokenValid, getSession, clearSession } from './utils/auth';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);

  // Check auth status on load
  useEffect(() => {
    const checkAuth = () => {
      const isValid = isTokenValid();
      setIsAuthenticated(isValid);
      
      // If token expired but session was active, clean up
      if (!isValid && getSession()) {
        console.warn("Session expired. Logging out...");
        clearSession();
        alert("Your session has expired. Please log in again.");
      }
      setCheckingAuth(false);
    };

    checkAuth();

    // Periodically verify token expiration (every 10 seconds)
    const interval = setInterval(() => {
      const isValid = isTokenValid();
      if (!isValid && isAuthenticated) {
        setIsAuthenticated(false);
        clearSession();
        alert("Session expired. Please log in again.");
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 select-none">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 font-medium text-sm">Verifying secure environment...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {isAuthenticated ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </>
  );
}

export default App;
