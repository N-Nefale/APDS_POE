import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [name, setName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer'); // customer or staff
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    const url = role === 'customer' ? 'http://localhost:5000/api/signup' : 'http://localhost:5000/api/staff-signup';
    try {
      await axios.post(url, { name, accountNumber, idNumber, password });
      navigate('/login'); // redirect to login page after successful signup
    } catch (error) {
      console.error("Error signing up", error);
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="text" placeholder="Account Number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} required />
        {role === 'customer' && <input type="text" placeholder="ID Number" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} />}
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <select onChange={(e) => setRole(e.target.value)} value={role}>
          <option value="customer">Customer</option>
          <option value="staff">Staff</option>
        </select>
        <button type="submit">Signup</button>
      </form>
    </div>
  );
}

export default Signup;
