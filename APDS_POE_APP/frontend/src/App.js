// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/login';
import Signup from './components/signup';
import SubmitPayment from './components/SubmitPayment';
import PendingPayments from './components/PendingPayments';

function App() {
  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/submit-payment" element={<SubmitPayment />} />
      <Route path="/pending-payments" element={<PendingPayments />} />
      <Route path="/" element={<Login />} />
    </Routes>
  );
}

export default App;
