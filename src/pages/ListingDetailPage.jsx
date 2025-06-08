import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { listingsAPI, ordersAPI } from '../services/api';

const ListingDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [orderQuantity, setOrderQuantity] = useState(1);
    const [orderLoading, setOrderLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    useEffect(() => {
        fetchListing().catch(console.error);
    }, [id]);

    const fetchListing = async () => {
        try {
            const response = await listingsAPI.getById(id);
            setListing(response.data);
        } catch (error) {
            setError('Listing not found');
        } finally {
            setLoading(false);
        }
    };

    const getImageUrl = (image) => {
        if (!image) return null;

        // If it's an external URL (starts with http/https)
        if (image.url && (image.url.startsWith('http://') || image.url.startsWith('https://'))) {
            return image.url;
        }

        // If it's a local file (starts with /uploads)
        if (image.url && image.url.startsWith('/uploads')) {
            return `http://localhost:3000${image.url}`;
        }

        return null;
    };

    const handleDelete = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login to delete listings');
            return;
        }

        if (!confirm('Are you sure you want to delete this listing?')) {
            return;
        }

        try {
            setDeleteLoading(true);
            await listingsAPI.delete(id);
            alert('Listing deleted successfully!');
            navigate('/listings');
        } catch (error) {
            alert('Failed to delete listing: ' + (error.response?.data?.error || error.message));
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleOrder = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            setOrderLoading(true);
            const orderData = {
                userId: 1, // In real app get from token
                listingId: parseInt(id),
                quantity: orderQuantity,
                totalPrice: listing.price * orderQuantity
            };

            await ordersAPI.create(orderData);
            alert('Order created successfully!');
            navigate('/orders');
        } catch (error) {
            alert('Failed to create order');
        } finally {
            setOrderLoading(false);
        }
    };

    const renderImageGallery = () => {
        if (!listing.images || listing.images.length === 0) {
            return (
                <div className="w-full h-96 bg-gray-200 flex items-center justify-center mb-6">
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
            );
        }

        const selectedImage = listing.images[selectedImageIndex];
        const imageUrl = getImageUrl(selectedImage);

        return (
            <div className="mb-6">
                {/* Main Image */}
                <div className="w-full h-96 bg-gray-200 overflow-hidden rounded-lg mb-4">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={listing.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                            }}
                        />
                    ) : null}
                    <div className="hidden w-full h-full bg-gray-200 items-center justify-center">
                        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                </div>

                {/* Thumbnail Gallery */}
                {listing.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto">
                        {listing.images.map((image, index) => {
                            const thumbUrl = getImageUrl(image);
                            return (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImageIndex(index)}
                                    className={`flex-shrink-0 w-20 h-20 rounded border-2 overflow-hidden ${
                                        index === selectedImageIndex
                                            ? 'border-blue-500'
                                            : 'border-gray-300 hover:border-gray-400'
                                    }`}
                                >
                                    {thumbUrl ? (
                                        <img
                                            src={thumbUrl}
                                            alt={`${listing.title} ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="text-center py-8">
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-error">
                {error}
            </div>
        );
    }

    if (!listing) {
        return (
            <div className="alert alert-error">
                Listing not found
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <Link to="/listings" className="text-blue-600 hover:underline mb-4 inline-block">
                ← Back to Listings
            </Link>

            <div className="card">
                {/* Image Gallery */}
                {renderImageGallery()}

                {/* Title and Details */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>

                        {/* Category, Condition, Location */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {listing.category && (
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                    {listing.category}
                                </span>
                            )}
                            {listing.condition && (
                                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                    {listing.condition}
                                </span>
                            )}
                            {listing.location && (
                                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                                    📍 {listing.location}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                        <Link to={`/listings/${id}/edit`} className="btn btn-secondary">
                            Edit Listing
                        </Link>
                        <button
                            onClick={handleDelete}
                            disabled={deleteLoading}
                            className="btn bg-red-600 hover:bg-red-700 text-white"
                        >
                            {deleteLoading ? 'Deleting...' : 'Delete Listing'}
                        </button>
                    </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-gray-600 whitespace-pre-line">{listing.description}</p>
                </div>

                {/* Price and Order Section */}
                <div className="border-t pt-6">
                    <div className="flex items-center justify-between mb-6">
                        <span className="text-4xl font-bold text-green-600">
                            ${listing.price}
                        </span>
                    </div>

                    <h3 className="text-lg font-bold mb-4">Place Order</h3>
                    <div className="flex items-center gap-4 mb-4">
                        <label className="font-medium">Quantity:</label>
                        <input
                            type="number"
                            min="1"
                            value={orderQuantity}
                            onChange={(e) => setOrderQuantity(parseInt(e.target.value) || 1)}
                            className="form-input w-24"
                        />
                        <span className="text-gray-600">
                            Total: ${(listing.price * orderQuantity).toFixed(2)}
                        </span>
                    </div>

                    <button
                        onClick={handleOrder}
                        disabled={orderLoading}
                        className="btn btn-primary"
                    >
                        {orderLoading ? 'Creating Order...' : 'Create Order'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ListingDetailPage;