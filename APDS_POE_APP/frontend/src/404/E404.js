import React from 'react';
import './404Page.css'; // Import the CSS file

const E404 = () => {
  return (
    <div className="error-container">
      <h1 className="error-title">404</h1>
      <p className="error-message">Oops! The page you're looking for can't be found.</p>
      <a href="/" className="home-link">Go Back Home</a>
    </div>
  );
};

export default E404;
