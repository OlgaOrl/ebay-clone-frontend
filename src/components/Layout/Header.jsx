import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const token = localStorage.getItem('token');
    const isLoggedIn = !!token;
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
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
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
                            eBay Clone
                        </Link>
                    </div>

                    {/* Navigation - уменьшенные отступы */}
                    <nav className="flex items-center space-x-6">
                        <Link
                            to="/"
                            className="text-gray-700 hover:text-sky-500 font-medium transition-colors"
                        >
                            Home
                        </Link>
                        <Link
                            to="/listings"
                            className="text-gray-700 hover:text-sky-500 font-medium transition-colors"
                        >
                            Listings
                        </Link>

                        {isLoggedIn ? (
                            <>
                                <Link
                                    to="/orders"
                                    className="text-gray-700 hover:text-sky-500 font-medium transition-colors"
                                >
                                    My Orders
                                </Link>
                                <Link
                                    to="/profile"
                                    className="text-gray-700 hover:text-sky-500 font-medium transition-colors"
                                >
                                    Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="bg-sky-400 hover:bg-sky-500 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-gray-700 hover:text-sky-500 font-medium transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-sky-400 hover:bg-sky-500 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200"
                                >
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