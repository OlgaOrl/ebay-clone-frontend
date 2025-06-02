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

    if (loading) {
        return (
            <div className="text-center py-8">
                <p>Loading listings...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Listings</h1>
                <Link to="/listings/create" className="btn btn-primary">
                    Create New Listing
                </Link>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                    <div key={listing.id} className="card hover:shadow-lg transition-shadow">
                        <h3 className="text-xl font-bold mb-2">{listing.title}</h3>
                        <p className="text-gray-600 mb-4">{listing.description}</p>
                        <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-green-600">
                ${listing.price}
              </span>
                            <Link to={`/listings/${listing.id}`} className="btn btn-primary">
                                View Details
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {listings.length === 0 && !loading && !error && (
                <div className="text-center py-8">
                    <p className="text-gray-500">No listings found.</p>
                </div>
            )}
        </div>
    );
};

export default ListingsPage;