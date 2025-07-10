import { useEffect, useState } from 'react';
import './App.css';
import Login  from '../Pages/Login';
import Dashboard from '../Pages/DashBoard/DashBoard';

function App() {
  const [token, setToken] = useState(null); // State to track the token

  useEffect(() => {
    const storedToken = localStorage.getItem('token'); // Retrieve the token from localStorage
    setToken(storedToken); // Update the token state
  }, []);

  return (
    <>
      {/* Render components based on the presence of a token */}
      {token ? (
        <Dashboard /> // Render the dashboard if the token exists
      ) : (
        <Login /> // Render the welcome page if no token exists
      )}
    </>
  );
}

export default App;
