import React, { useState, useEffect } from 'react';
import { usersAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const UserProfilePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: ''
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            // В реальном приложении ID получать из токена
            const response = await usersAPI.getById(1);
            setUser(response.data);
            setFormData({
                username: response.data.username,
                email: response.data.email
            });
        } catch (error) {
            console.error('Failed to fetch user');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await usersAPI.update(1, formData);
            setUser({ ...user, ...formData });
            setEditing(false);
            alert('Profile updated successfully!');
        } catch (error) {
            alert('Failed to update profile');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
            try {
                await usersAPI.delete(1);
                localStorage.removeItem('token');
                navigate('/');
            } catch (error) {
                alert('Failed to delete account');
            }
        }
    };

    if (loading) return <div className="text-center py-8">Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">User Profile</h1>

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
                                onClick={() => setEditing(false)}
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
                            <p className="text-lg">{user?.username}</p>
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Email
                            </label>
                            <p className="text-lg">{user?.email}</p>
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