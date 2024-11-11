import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [name, setName] = useState('Jane Smith');
  const [accountNumber, setAccountNumber] = useState('STAFF001');
  const [password, setPassword] = useState('SecurePass123');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log(name + accountNumber + password )
      const response = await axios.post('https://localhost:3001/user/login/', { name, accountNumber, password });

      localStorage.setItem('token', response.data.token);

      if (response.data.role === 'customer') {
        navigate('/submit-payment');
      } else if (response.data.role === 'staff') {
        navigate('/pending-payments');
      }

    } catch (error) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div  className="Login">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="text" placeholder="Account Number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}

export default Login;
