import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usersAPI } from '../services/api';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear error when user starts typing
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        // Client-side validation
        if (!formData.username.trim()) {
            setError('Username is required');
            setLoading(false);
            return;
        }
        if (!formData.email.trim()) {
            setError('Email is required');
            setLoading(false);
            return;
        }
        if (!formData.password || formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email.trim())) {
            setError('Please enter a valid email address');
            setLoading(false);
            return;
        }

        try {
            const registrationData = {
                username: formData.username.trim(),
                email: formData.email.trim().toLowerCase(),
                password: formData.password
            };

            console.log('Attempting registration with:', {
                username: registrationData.username,
                email: registrationData.email,
                password: '***'
            });

            const response = await usersAPI.create(registrationData);

            console.log('Registration successful:', response);
            
            setSuccess(true);
            setError('');
            
            // Show success message and redirect after 2 seconds
            setTimeout(() => {
                navigate('/login', { 
                    state: { 
                        message: 'Registration successful! Please log in with your credentials.',
                        email: registrationData.email
                    }
                });
            }, 2000);

        } catch (error) {
            console.error('Registration error:', error);
            
            // Handle different error scenarios
            if (error.response) {
                // Server responded with error status
                const status = error.response.status;
                const errorData = error.response.data;
                
                console.error('Error response data:', errorData);
                console.error('Error status:', status);
                
                switch (status) {
                    case 400:
                        setError(errorData.error || 'Invalid registration data. Please check your input.');
                        break;
                    case 405:
                        setError('Registration service temporarily unavailable. Please try again later.');
                        console.error('405 Method Not Allowed - Check if the API endpoint exists and accepts POST requests');
                        break;
                    case 409:
                        setError('An account with this email already exists. Please use a different email or try logging in.');
                        break;
                    case 422:
                        setError(errorData.error || 'Validation failed. Please check your input.');
                        break;
                    case 500:
                        setError('Server error. Please try again later.');
                        break;
                    default:
                        setError(errorData.error || `Registration failed (Error ${status}). Please try again.`);
                }
            } else if (error.request) {
                // Network error
                console.error('Network error:', error.request);
                setError('Network error. Please check your internet connection and try again.');
            } else {
                // Other error
                console.error('Unexpected error:', error.message);
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <div className="text-green-600 text-6xl mb-4">✅</div>
                        <h2 className="text-3xl font-extrabold text-gray-900">
                            Registration Successful!
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Your account has been created successfully.
                        </p>
                        <p className="mt-1 text-sm text-gray-600">
                            Redirecting you to login page...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Or{' '}
                        <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                            sign in to your existing account
                        </Link>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Username *
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Enter your username"
                                value={formData.username}
                                onChange={handleChange}
                                disabled={loading}
                                autoComplete="username"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address *
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Enter your email address"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password *
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Enter your password (min 6 characters)"
                                value={formData.password}
                                onChange={handleChange}
                                disabled={loading}
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Password must be at least 6 characters long
                            </p>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Creating account...
                                </>
                            ) : (
                                'Create account'
                            )}
                        </button>
                    </div>

                    <div className="text-center">
                        <p className="text-xs text-gray-500">
                            By creating an account, you agree to our Terms of Service and Privacy Policy.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
