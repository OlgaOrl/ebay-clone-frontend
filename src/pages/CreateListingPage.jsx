import React, { useState, useEffect } from 'react';
import { listingsAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const CreateListingPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: 'Electronics',
        condition: 'Used',
        location: ''
    });
    const [selectedImages, setSelectedImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Check authorization on component load
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        // Limit to 5 images
        if (files.length > 5) {
            setError('Maximum 5 images allowed');
            return;
        }

        // Validate file types and sizes
        const validFiles = files.filter(file => {
            if (!file.type.startsWith('image/')) {
                setError('Only image files are allowed');
                return false;
            }
            if (file.size > 5 * 1024 * 1024) {
                setError('File size must be less than 5MB');
                return false;
            }
            return true;
        });

        setSelectedImages(validFiles);
        setError('');

        // Create previews
        const previews = validFiles.map(file => ({
            file,
            url: URL.createObjectURL(file),
            name: file.name
        }));
        setImagePreviews(previews);
    };

    const removeImage = (index) => {
        const newImages = selectedImages.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);

        // Revoke URL to free memory
        URL.revokeObjectURL(imagePreviews[index].url);

        setSelectedImages(newImages);
        setImagePreviews(newPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Additional token check before submission
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            // Create FormData for file upload
            const formDataWithFiles = new FormData();

            // Add text fields
            Object.keys(formData).forEach(key => {
                formDataWithFiles.append(key, formData[key]);
            });

            // Add image files
            selectedImages.forEach(file => {
                formDataWithFiles.append('images', file);
            });

            await listingsAPI.createWithImages(formDataWithFiles);
            navigate('/listings');
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                setError(error.response?.data?.error || 'Failed to create listing');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        // Clean up preview URLs
        imagePreviews.forEach(preview => URL.revokeObjectURL(preview.url));
        navigate('/listings');
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            imagePreviews.forEach(preview => URL.revokeObjectURL(preview.url));
        };
    }, []);

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Create New Listing</h1>

            <div className="card">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
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
                            Category *
                        </label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="form-input"
                            required
                        >
                            <option value="Electronics">Electronics</option>
                            <option value="Clothing">Clothing</option>
                            <option value="Home & Garden">Home & Garden</option>
                            <option value="Sports">Sports</option>
                            <option value="Books">Books</option>
                            <option value="Toys">Toys</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Condition *
                        </label>
                        <select
                            name="condition"
                            value={formData.condition}
                            onChange={handleChange}
                            className="form-input"
                            required
                        >
                            <option value="New">New</option>
                            <option value="Like New">Like New</option>
                            <option value="Used">Used</option>
                            <option value="Fair">Fair</option>
                            <option value="Poor">Poor</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Location
                        </label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="City, State"
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

                    <div className="mb-4">
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

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Images (Max 5 files, 5MB each)
                        </label>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                            className="form-input"
                        />

                        {/* Image Previews */}
                        {imagePreviews.length > 0 && (
                            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {imagePreviews.map((preview, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={preview.url}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-24 object-cover rounded border"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                                        >
                                            ×
                                        </button>
                                        <p className="text-xs text-gray-500 mt-1 truncate">
                                            {preview.name}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary flex-1"
                        >
                            {loading ? 'Creating...' : 'Create Listing'}
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="btn btn-secondary"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateListingPage;