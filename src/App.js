import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import NavbarAdmin from './components/NavbarAdmin';
import Home from './pages/guest/Home';
import Shop from './pages/guest/Shop';
import ShopDetail from './pages/guest/ShopDetail';
import Reseller from './pages/guest/Reseller';
import Contact from './pages/guest/Contact';
import Dashboard from './pages/admin/Dashboard';
import ManageCategories from './pages/admin/ManageCategories';
import ManageBrands from './pages/admin/ManageBrands';
import ManageItems from './pages/admin/ManageItems';
import Login from './pages/Login';
import ProtectedRoute from './utils/ProtectedRoute';
import { AuthProvider } from './utils/AuthContext';

const Layout = ({ children }) => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <>
      {isAdminPath ? <NavbarAdmin /> : <Navbar />}
      {children}
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ShopDetail />} />
            <Route path="/reseller" element={<Reseller />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/manage-categories"
              element={
                <ProtectedRoute>
                  <ManageCategories />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/manage-brands"
              element={
                <ProtectedRoute>
                  <ManageBrands />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/manage-items"
              element={
                <ProtectedRoute>
                  <ManageItems />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

export default App;
