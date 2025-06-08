import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { listingsAPI } from '../services/api';

const ListingsPage = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchListings = async () => {
        try {
            setLoading(true);
            const response = await listingsAPI.getAll();
            setListings(response.data || []);
            setError('');
        } catch (error) {
            console.error('Error fetching listings:', error);
            setError('Failed to load listings');
            setListings([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchListings().catch(console.error);
    }, []);

    const getImageUrl = (image) => {
        if (!image || !image.url) return null;

        // Return URL as is (without modifications)
        return image.url;
    };

    const renderListingImage = (listing) => {
        const firstImage = listing.images && listing.images.length > 0 ? listing.images[0] : null;
        const imageUrl = getImageUrl(firstImage);

        if (imageUrl) {
            return (
                <div className="h-48 bg-gray-200 overflow-hidden relative">
                    <img
                        src={imageUrl}
                        alt={listing.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                        }}
                    />
                    <div className="hidden h-full w-full bg-gray-200 items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    {listing.images && listing.images.length > 1 && (
                        <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                            +{listing.images.length - 1} more
                        </div>
                    )}
                </div>
            );
        }

        return (
            <div className="h-48 bg-gray-200 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading listings...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Listings</h1>
                <Link
                    to="/listings/create"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                >
                    Create New Listing
                </Link>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    <p className="font-medium">Error:</p>
                    <p>{error}</p>
                </div>
            )}

            {/* Listings Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {listings.map((listing) => (
                    <div
                        key={listing.id}
                        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200"
                    >
                        {/* Image */}
                        {renderListingImage(listing)}

                        {/* Content */}
                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                {listing.title}
                            </h3>

                            {/* Category and Condition */}
                            <div className="flex gap-2 mb-2">
                                {listing.category && (
                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                        {listing.category}
                                    </span>
                                )}
                                {listing.condition && (
                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                        {listing.condition}
                                    </span>
                                )}
                            </div>

                            {/* Location */}
                            {listing.location && (
                                <p className="text-sm text-gray-500 mb-2">
                                    📍 {listing.location}
                                </p>
                            )}

                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                {listing.description}
                            </p>

                            {/* Price and Button */}
                            <div className="flex justify-between items-center">
                                <span className="text-xl font-bold text-green-600">
                                    ${listing.price}
                                </span>
                                <Link
                                    to={`/listings/${listing.id}`}
                                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors duration-200"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {listings.length === 0 && !loading && !error && (
                <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📦</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No listings found</h3>
                    <p className="text-gray-500 mb-6">Get started by creating your first listing!</p>
                    <Link
                        to="/listings/create"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-200"
                    >
                        Create First Listing
                    </Link>
                </div>
            )}
        </div>
    );
};

export default ListingsPage;