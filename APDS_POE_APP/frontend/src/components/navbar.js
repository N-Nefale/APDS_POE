import React from "react";
import logo from "../logo.svg";
import "bootstrap/dist/css/bootstrap.css";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  // Assuming user data (like role) is stored in localStorage or context
  const user = JSON.parse(localStorage.getItem("user")); // Example of retrieving user data

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <NavLink className="navbar-brand" to="/">
          <img style={{ width: '25%' }} src={logo} alt="Logo" />
        </NavLink>
        <div className="navbar" id="navbarSupportedContent">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/submit-payment">
                Submit Payment
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/pending-payments">
                Pending Payments
              </NavLink>
            </li>
            {user?.role === "staff" && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/approved-payments">
                  Approved Payments
                </NavLink>
              </li>
            )}
            <li className="nav-item">
              <NavLink className="nav-link" to="/login">
                Login
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}
