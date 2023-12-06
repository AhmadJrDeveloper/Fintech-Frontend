import React, { useState } from 'react';
import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/Login/Login';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Reports from "./pages/Reports/Reports"
import Transactions from "./pages/Transactions/Transactions"

const PrivateRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem("token");

  return isAuthenticated ? (
    element
  ) : (
    <Navigate to="/login" replace />
  );
};

export default function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/reports" element={<PrivateRoute element={<Reports/>} />} />
          <Route path="/transactions" element={<PrivateRoute element={<Transactions/>} />} />




          <Route
            path="/dashboard"
            element={<PrivateRoute element={<Dashboard />} />}
          />
        </Routes>
      </Router>
    </>
  );
}
