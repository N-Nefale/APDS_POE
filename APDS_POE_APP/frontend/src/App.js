// App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login';
import Signup from './components/signup';
import SubmitPayment from './components/SubmitPayment';
import PendingPayments from './components/PendingPayments';
import Navbar from './components/navbar';
import E404 from './404/E404'
import HomePage from './components/HomePage'
import ApprovedPayments from './components/ApprovedPayments';
import './App.css'


function App() {
  return (
    <>
    <Navbar />
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/submit-payment" element={<SubmitPayment />} />
      <Route path="/pending-payments" element={<PendingPayments />} />
      <Route path="/*" element={<Navigate to={'/404'}  />} />
      <Route path="/404" element={<E404 />} />
      <Route path="/approved-payments" element={<ApprovedPayments />} />

    </Routes>
    </>
  );
}

export default App;
