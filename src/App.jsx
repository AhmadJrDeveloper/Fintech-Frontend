import React from 'react';
import { Routes, Route, Outlet, BrowserRouter as Router } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';
import Users from './pages/Users/Users';
import Transactions from './pages/Transactions/Transactions';
import Reports from './pages/Reports/Reports';
import Goals from './pages/Goals/Goals';
import NavBar from './components/NavBar/NavBar';
import SideBar from './components/SideBar/SideBar';
import Login from './pages/Login/Login';


const App = () => {
  const Layout = () => {
    return (
      <>
        <div style={{ display: 'flex' }}>
          <SideBar style={{ order: 2 }} />
          <div style={{ flexGrow: 1, order: 1 }}>
            <NavBar />
            <Outlet />
          </div>
        </div>
      </>
    );
  };

  return (
    <Router>
      <Routes>
      <Route path="/" element={<Login />} />

        <Route path="/" element={<Layout />}>
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/Transactions" element={<Transactions />} />
          <Route path="/Reports" element={<Reports />} />
          <Route path="/Goals" element={<Goals />} />
          <Route path="/Users" element={<Users />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;