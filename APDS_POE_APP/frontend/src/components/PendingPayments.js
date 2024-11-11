import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PendingPayments() {
  const [pendingPayments, setPendingPayments] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPendingPayments = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login first');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/pending-payments', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPendingPayments(response.data);
      } catch (error) {
        setError('Error retrieving pending payments');
      }
    };

    fetchPendingPayments();
  }, []);

  const handleApprovePayment = async (paymentId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/approve-payment/${paymentId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPendingPayments(pendingPayments.filter((payment) => payment._id !== paymentId));
    } catch (error) {
      setError('Error approving payment');
    }
  };

  return (
    <div>
      <h2>Pending Payments</h2>
      {error && <p>{error}</p>}
      <ul>
        {pendingPayments.map((payment) => (
          <li key={payment._id}>
            <p>Amount: {payment.amount}</p>
            <button onClick={() => handleApprovePayment(payment._id)}>Approve</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PendingPayments;
