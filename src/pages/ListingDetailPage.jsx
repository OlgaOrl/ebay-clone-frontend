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
    const [currentUser, setCurrentUser] = useState(null);
    const [showOrderForm, setShowOrderForm] = useState(false);
    
    // Structured shipping address
    const [shippingData, setShippingData] = useState({
        fullName: '',
        street: '',
        city: '',
        country: ''
    });

    useEffect(() => {
        fetchListing().catch(console.error);
        fetchCurrentUser().catch(console.error);
    }, [id]);

    const fetchCurrentUser = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            // Assuming user ID is stored in token or we have a way to get current user
            // For now, using hardcoded user ID 1 as seen in handleOrder
            setCurrentUser({ id: 1 });
        } catch (error) {
            console.error('Failed to fetch current user:', error);
        }
    };

    const isOwner = currentUser && listing && listing.userId === currentUser.id;

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
        if (!image || !image.url) return null;

        // Return URL as is (without modifications)
        return image.url;
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
            
            // Ensure we have valid data
            if (!listing || !listing.id) {
                alert('Listing data not available');
                return;
            }

            if (!orderQuantity || orderQuantity < 1) {
                alert('Please enter a valid quantity');
                return;
            }

            // Validate all shipping fields
            if (!shippingData.fullName.trim()) {
                alert('Please enter your full name');
                return;
            }
            if (!shippingData.street.trim()) {
                alert('Please enter street address');
                return;
            }
            if (!shippingData.city.trim()) {
                alert('Please enter city');
                return;
            }
            if (!shippingData.country.trim()) {
                alert('Please enter country');
                return;
            }

            // Create order data with nested shippingAddress structure
            const orderData = {
                listingId: parseInt(listing.id),
                quantity: parseInt(orderQuantity) || 1,
                shippingAddress: {
                    street: shippingData.street.trim(),
                    city: shippingData.city.trim(),
                    country: shippingData.country.trim()
                }
            };

            console.log('Order request data:', orderData);

            const response = await ordersAPI.create(orderData);
            
            console.log('Order creation response:', response);
            
            alert('Order created successfully!');
            setShowOrderForm(false);
            setShippingData({
                fullName: '',
                street: '',
                city: '',
                country: ''
            });
            navigate('/orders');
        } catch (error) {
            console.error('Order creation error:', error);
            console.error('Error response data:', error.response?.data);
            
            // Handle specific error cases
            if (error.response?.status === 400) {
                const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Invalid request data';
                alert(`Failed to create order: ${errorMessage}`);
            } else if (error.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
            } else if (error.response?.status === 404) {
                alert('Listing not found or no longer available');
            } else {
                alert('Failed to create order. Please try again.');
            }
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
                        {isOwner && (
                            <>
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
                            </>
                        )}
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
                    
                    {!showOrderForm ? (
                        <div>
                            <div className="flex items-center gap-4 mb-4">
                                <label className="font-medium">Quantity:</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="999"
                                    value={orderQuantity}
                                    onChange={(e) => {
                                        const value = parseInt(e.target.value) || 1;
                                        setOrderQuantity(Math.max(1, value));
                                    }}
                                    className="form-input w-24"
                                />
                                <span className="text-gray-600">
                                    Total: ${(listing.price * orderQuantity).toFixed(2)}
                                </span>
                            </div>

                            <button
                                onClick={() => setShowOrderForm(true)}
                                disabled={!listing}
                                className="btn btn-primary"
                            >
                                Proceed to Order
                            </button>
                        </div>
                    ) : (
                        <div>
                            <div className="mb-4">
                                <div className="flex items-center gap-4 mb-4">
                                    <label className="font-medium">Quantity:</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="999"
                                        value={orderQuantity}
                                        onChange={(e) => {
                                            const value = parseInt(e.target.value) || 1;
                                            setOrderQuantity(Math.max(1, value));
                                        }}
                                        className="form-input w-24"
                                    />
                                    <span className="text-gray-600">
                                        Total: ${(listing.price * orderQuantity).toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h4 className="text-md font-semibold mb-3">Shipping Information</h4>
                                
                                <div className="mb-3">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={shippingData.fullName}
                                        onChange={(e) => setShippingData({...shippingData, fullName: e.target.value})}
                                        placeholder="Enter your full name"
                                        className="form-input"
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Street Address *
                                    </label>
                                    <input
                                        type="text"
                                        value={shippingData.street}
                                        onChange={(e) => setShippingData({...shippingData, street: e.target.value})}
                                        placeholder="Enter street address (e.g., Vilja tn 6)"
                                        className="form-input"
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        City *
                                    </label>
                                    <input
                                        type="text"
                                        value={shippingData.city}
                                        onChange={(e) => setShippingData({...shippingData, city: e.target.value})}
                                        placeholder="Enter city (e.g., Tartu)"
                                        className="form-input"
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Country *
                                    </label>
                                    <input
                                        type="text"
                                        value={shippingData.country}
                                        onChange={(e) => setShippingData({...shippingData, country: e.target.value})}
                                        placeholder="Enter country (e.g., Estonia)"
                                        className="form-input"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={handleOrder}
                                    disabled={orderLoading || !listing || 
                                        !shippingData.fullName.trim() || 
                                        !shippingData.street.trim() || 
                                        !shippingData.city.trim() || 
                                        !shippingData.country.trim()}
                                    className="btn btn-primary"
                                >
                                    {orderLoading ? 'Creating Order...' : 'Create Order'}
                                </button>
                                <button
                                    onClick={() => {
                                        setShowOrderForm(false);
                                        setShippingData({
                                            fullName: '',
                                            street: '',
                                            city: '',
                                            country: ''
                                        });
                                    }}
                                    disabled={orderLoading}
                                    className="btn btn-secondary"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ListingDetailPage;
