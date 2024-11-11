import React, { useState } from 'react';
import axios from 'axios';

function SubmitPayment() {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('');
  const [provider, setProvider] = useState('');
  const [accountInfo, setAccountInfo] = useState('');
  const [swiftCode, setSwiftCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please login first');
      return;
    }

    try {
      await axios.post(
        'https://localhost:3001/user/submit-payment',
        { amount, currency, provider, accountInfo, swiftCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Payment submitted successfully');
    } catch (error) {
      setError('Error submitting payment');
    }
  };

  return (
    <div className="SubmitPayment">
      <h2>Submit Payment</h2>
      <form onSubmit={handleSubmitPayment}>
        <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        <input type="text" placeholder="Currency" value={currency} onChange={(e) => setCurrency(e.target.value)} required />
        <input type="text" placeholder="Provider" value={provider} onChange={(e) => setProvider(e.target.value)} required />
        <input type="text" placeholder="Account Info" value={accountInfo} onChange={(e) => setAccountInfo(e.target.value)} required />
        <input type="text" placeholder="SWIFT Code" value={swiftCode} onChange={(e) => setSwiftCode(e.target.value)} required />
        <button type="submit">Submit Payment</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}

export default SubmitPayment;
