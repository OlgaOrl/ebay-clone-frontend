import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { listingsAPI } from '../services/api';

const EditListingPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [listing, setListing] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        fetchCurrentUser().catch(console.error);
        fetchListing().catch(console.error);
    }, [id]);

    const fetchCurrentUser = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            // Using hardcoded user ID 1 for now
            setCurrentUser({ id: 1 });
        } catch (error) {
            console.error('Failed to fetch current user:', error);
            navigate('/login');
        }
    };

    const fetchListing = async () => {
        try {
            const response = await listingsAPI.getById(id);
            const listingData = response.data;
            
            // Check if current user owns this listing
            if (currentUser && listingData.userId !== currentUser.id) {
                setError('You are not authorized to edit this listing');
                return;
            }
            
            setListing(listingData);
            setFormData({
                title: listingData.title,
                description: listingData.description,
                price: listingData.price.toString()
            });
        } catch (error) {
            setError('Listing not found');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            const updateData = {
                ...formData,
                price: parseFloat(formData.price)
            };

            await listingsAPI.update(id, updateData);
            navigate(`/listings/${id}`);
        } catch (error) {
            setError(error.response?.data?.error || 'Failed to update listing');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this listing?')) {
            try {
                await listingsAPI.delete(id);
                navigate('/listings');
            } catch (error) {
                alert('Failed to delete listing');
            }
        }
    };

    if (loading) {
        return (
            <div className="text-center py-8">
                <p>Loading...</p>
            </div>
        );
    }

    if (error && !listing) {
        return (
            <div className="alert alert-error">
                {error}
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <Link to={`/listings/${id}`} className="text-blue-600 hover:underline mb-4 inline-block">
                ← Back to Listing
            </Link>

            <h1 className="text-3xl font-bold mb-6">Edit Listing</h1>

            <div className="card">
                {error && (
                    <div className="alert alert-error mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Title *
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Description *
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            className="form-input"
                            required
                        ></textarea>
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Price ($) *
                        </label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="btn btn-primary"
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>

                        <Link to={`/listings/${id}`} className="btn btn-secondary">
                            Cancel
                        </Link>

                        <button
                            type="button"
                            onClick={handleDelete}
                            className="btn"
                            style={{backgroundColor: '#dc2626', color: 'white'}}
                        >
                            Delete Listing
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditListingPage;
