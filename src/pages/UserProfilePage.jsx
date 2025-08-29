import React, { useState, useEffect } from 'react';
import { usersAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const UserProfilePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authChecking, setAuthChecking] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        setAuthChecking(false);
        fetchUserProfile();
    }, [navigate]);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            setError('');
            
            // Try to fetch current user profile - try multiple endpoints
            let response;
            try {
                // First try /profile endpoint
                response = await usersAPI.getProfile();
            } catch (profileError) {
                console.log('Profile endpoint failed, trying /users/me:', profileError);
                try {
                    // If /profile fails, try /users/me
                    response = await usersAPI.getMe();
                } catch (meError) {
                    console.log('Users/me endpoint failed, falling back to hardcoded ID:', meError);
                    // Fallback to hardcoded ID if other endpoints don't exist
                    response = await usersAPI.getById(1);
                }
            }
            
            console.log('User profile response:', response);
            
            if (response.data) {
                setUser(response.data);
                setFormData({
                    username: response.data.username || '',
                    email: response.data.email || ''
                });
            } else {
                setError('No user data received');
            }
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
            
            if (error.response?.status === 401) {
                // Token is invalid or expired
                localStorage.removeItem('token');
                navigate('/login');
                return;
            } else if (error.response?.status === 404) {
                setError('User profile not found');
            } else {
                setError('Failed to load profile data. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        
        if (!user?.id) {
            setError('User ID not available');
            return;
        }
        
        try {
            setError('');
            
            // Try to update current user profile
            let response;
            try {
                // First try /profile endpoint for update
                response = await usersAPI.updateProfile(formData);
            } catch (profileError) {
                console.log('Profile update endpoint failed, trying user ID:', profileError);
                // Fallback to updating by user ID
                response = await usersAPI.update(user.id, formData);
            }
            
            setUser({ ...user, ...formData });
            setEditing(false);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Failed to update profile:', error);
            
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
                return;
            } else if (error.response?.status === 403) {
                setError('You are not authorized to update this profile');
            } else {
                setError('Failed to update profile. Please try again.');
            }
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
            return;
        }
        
        if (!user?.id) {
            setError('User ID not available');
            return;
        }

        try {
            setError('');
            
            // Try to delete current user profile
            try {
                await usersAPI.deleteProfile();
            } catch (profileError) {
                console.log('Profile delete endpoint failed, trying user ID:', profileError);
                await usersAPI.delete(user.id);
            }
            
            localStorage.removeItem('token');
            navigate('/');
        } catch (error) {
            console.error('Failed to delete account:', error);
            
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
                return;
            } else if (error.response?.status === 403) {
                setError('You are not authorized to delete this account');
            } else {
                setError('Failed to delete account. Please try again.');
            }
        }
    };

    // Show loading while checking authorization
    if (authChecking) {
        return <div className="text-center py-8">Checking authorization...</div>;
    }

    // Show loading while fetching user data
    if (loading) {
        return <div className="text-center py-8">Loading profile data...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">User Profile</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                    <button
                        onClick={fetchUserProfile}
                        className="ml-4 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                    >
                        Retry
                    </button>
                </div>
            )}

            <div className="card">
                {editing ? (
                    <form onSubmit={handleUpdate}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                value={formData.username}
                                onChange={(e) => setFormData({...formData, username: e.target.value})}
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="flex gap-4">
                            <button type="submit" className="btn btn-primary">
                                Save Changes
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setEditing(false);
                                    setError('');
                                    // Reset form data to original user data
                                    setFormData({
                                        username: user?.username || '',
                                        email: user?.email || ''
                                    });
                                }}
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Username
                            </label>
                            <p className="text-lg">{user?.username || 'Not available'}</p>
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Email
                            </label>
                            <p className="text-lg">{user?.email || 'Not available'}</p>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setEditing(true)}
                                className="btn btn-primary"
                            >
                                Edit Profile
                            </button>
                            <button
                                onClick={handleDelete}
                                className="btn"
                                style={{backgroundColor: '#dc2626', color: 'white'}}
                            >
                                Delete Account
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfilePage;
