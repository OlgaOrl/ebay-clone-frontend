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

    const handleOrder = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            setOrderLoading(true);
            const orderData = {
                userId: 1, // В реальном приложении получать из токена
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
        <div className="max-w-2xl mx-auto">
            <Link to="/listings" className="text-blue-600 hover:underline mb-4 inline-block">
                ← Back to Listings
            </Link>

            <div className="card">
                <h1 className="text-3xl font-bold mb-4">{listing.title}</h1>
                <p className="text-gray-600 mb-6">{listing.description}</p>

                <div className="flex items-center justify-between mb-6">
          <span className="text-3xl font-bold text-green-600">
            ${listing.price}
          </span>
                    <Link to={`/listings/${id}/edit`} className="btn btn-secondary">
                        Edit Listing
                    </Link>
                </div>

                <div className="border-t pt-6">
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