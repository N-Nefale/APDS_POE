import React, { useEffect, useState } from "react";
import axios from "axios";


export default function ApprovedPayments() {
  const [approvedPayments, setApprovedPayments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Function to fetch approved payments
    const fetchApprovedPayments = async () => {
      try {
        const token = localStorage.getItem("token"); // Example of retrieving JWT token
        const response = await axios.get("https://localhost:3001/user/approved-payments", { // replace with your backend URL
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const  {message, approvedPayments}  = response.data
        console.log(message);
        console.log(approvedPayments);
        
        setApprovedPayments(approvedPayments);
      } catch (err) {
        setError("Error fetching approved payments.");
        console.error(err);
      }
    };

    fetchApprovedPayments();
  }, []);

  return (
    <div className="ApprovedPayments">
      <h2>Approved Payments</h2>
      {error && <p className="error">{error}</p>}
      {approvedPayments.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Amount</th>
              <th>Currency</th>
              <th>Provider</th>
              <th>Account Info</th>
              <th>SWIFT Code</th>
              <th>Approved At</th>
            </tr>
          </thead>
          <tbody>
            {approvedPayments.map((payment) => (
              <tr key={payment._id}>
                <td>{payment.amount}</td> {/* Handles MongoDB specific formatting */}
                <td>{payment.currency}</td>
                <td>{payment.provider}</td>
                <td>{payment.accountInfo}</td>
                <td>{payment.swiftCode}</td>
                <td>{new Date(parseInt(payment.approvedAt)).toLocaleString()}</td> {/* Formats MongoDB date */}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-payments">No approved payments found.</p>
      )}
    </div>
  );
}
