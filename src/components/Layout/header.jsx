import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const token = localStorage.getItem('token');
    const isLoggedIn = !!token;
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // Вызовите API для выхода если нужно
            localStorage.removeItem('token');
            navigate('/');
            window.location.reload();
        } catch (error) {
            console.error('Logout failed:', error);
            localStorage.removeItem('token');
            navigate('/');
        }
    };

    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-bold text-blue-600">
                            eBay Clone
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex items-center space-x-4">
                        <Link to="/" className="text-gray-700 hover:text-blue-600">
                            Home
                        </Link>
                        <Link to="/listings" className="text-gray-700 hover:text-blue-600">
                            Listings
                        </Link>

                        {isLoggedIn ? (
                            <>
                                <Link to="/orders" className="text-gray-700 hover:text-blue-600">
                                    My Orders
                                </Link>
                                <Link to="/profile" className="text-gray-700 hover:text-blue-600">
                                    Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="btn btn-secondary"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-700 hover:text-blue-600">
                                    Login
                                </Link>
                                <Link to="/register" className="btn btn-primary">
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;