import { useEffect, useState } from 'react';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../Pages/Login';
import Register from '../Pages/Register/Register';
import Dashboard from '../Pages/DashBoard/DashBoard';
import route from '../Navigation/Navigation';

function App() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={token ? <Navigate to="/" /> : <Login />} />
      <Route path="/register" element={token ? <Navigate to="/" /> : <Register />} />

      {/* Protected Routes - require token */}
      {token ? (
        <>
          {/* Use trailing * so descendant Routes inside Dashboard can match deeper paths */}
          <Route path="/*" element={<Dashboard />} />
        </>
      ) : (
        <Route path="*" element={<Navigate to="/login" />} />
      )}
    </Routes>
  );
}

export default App;
