import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ListingsPage from './pages/ListingsPage';
import ListingDetailPage from './pages/ListingDetailPage';
import CreateListingPage from './pages/CreateListingPage';
import EditListingPage from './pages/EditListingPage';
import OrdersPage from './pages/OrdersPage';
import UserProfilePage from './pages/UserProfilePage';

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/listings" element={<ListingsPage />} />
                    <Route path="/listings/create" element={<CreateListingPage />} />
                    <Route path="/listings/:id" element={<ListingDetailPage />} />
                    <Route path="/listings/:id/edit" element={<EditListingPage />} />
                    <Route path="/orders" element={<OrdersPage />} />
                    <Route path="/profile" element={<UserProfilePage />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;