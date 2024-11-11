// index.js
import React from 'react';
<<<<<<< HEAD
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
=======
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
>>>>>>> 376d20699058406614f66d7729505532ad9ec505
import App from './App';

<<<<<<< HEAD
ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
=======
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
>>>>>>> 376d20699058406614f66d7729505532ad9ec505
);
