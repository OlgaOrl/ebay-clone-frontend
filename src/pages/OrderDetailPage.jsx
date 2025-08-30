import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ordersAPI } from '../services/api';

const OrderDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        console.log('OrderDetailPage mounted, ID from useParams:', id);
        
        if (id && id !== 'undefined') {
            fetchOrderDetails();
        } else {
            console.error('No valid order ID found in URL!');
            setError('No order ID provided');
            setLoading(false);
        }
    }, [id]);

    const fetchOrderDetails = async () => {
        if (!id || id === 'undefined') {
            setError('No order ID provided');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError('');
            console.log('Fetching order details for ID:', id);
            
            const response = await ordersAPI.getById(id);
            console.log('Order details response:', response);
            
            if (response.data) {
                setOrder(response.data);
            } else {
                setError('Order data not found');
            }
        } catch (error) {
            console.error('Error fetching order details:', error);
            
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
                return;
            } else if (error.response?.status === 404) {
                setError('Order not found');
            } else {
                setError(`Failed to load order details: ${error.response?.status || 'Unknown error'}`);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async () => {
        if (!window.confirm('Are you sure you want to cancel this order?')) {
            return;
        }

        try {
            console.log('Cancelling order with ID:', id);
            await ordersAPI.cancel(id, { cancelReason: 'Customer request' });
            alert('Order cancelled successfully!');
            // Refresh order details
            fetchOrderDetails();
        } catch (error) {
            console.error('Error cancelling order:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }
            alert('Failed to cancel order. Please try again.');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'text-yellow-600 bg-yellow-100';
            case 'confirmed': return 'text-blue-600 bg-blue-100';
            case 'shipped': return 'text-purple-600 bg-purple-100';
            case 'delivered': return 'text-green-600 bg-green-100';
            case 'cancelled': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const formatPrice = (price) => {
        // Ensure we have a valid number
        const numPrice = parseFloat(price);
        if (isNaN(numPrice)) {
            console.warn('Invalid price value:', price);
            return '0.00';
        }
        return numPrice.toFixed(2);
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto py-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto py-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
                <div className="flex space-x-4">
                    <button
                        onClick={fetchOrderDetails}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Try Again
                    </button>
                    <button
                        onClick={() => navigate('/orders')}
                        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                    >
                        Back to Orders
                    </button>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="max-w-4xl mx-auto py-8">
                <div className="text-center">
                    <p className="text-gray-600">Order not found</p>
                    <button
                        onClick={() => navigate('/orders')}
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Back to Orders
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Order #{order.id}</h1>
                    <p className="text-gray-600">Placed on {formatDate(order.createdAt)}</p>
                </div>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                </span>
            </div>

            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">Order Details</h2>
                </div>
                
                <div className="px-6 py-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-sm font-medium text-gray-900 mb-2">Order Information</h3>
                            <dl className="space-y-1">
                                <div className="flex justify-between">
                                    <dt className="text-sm text-gray-600">Listing ID:</dt>
                                    <dd className="text-sm text-gray-900">{order.listingId}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-sm text-gray-600">Quantity:</dt>
                                    <dd className="text-sm text-gray-900">{order.quantity}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-sm text-gray-600">Total Price:</dt>
                                    <dd className="text-sm font-medium text-gray-900">${formatPrice(order.totalPrice)}</dd>
                                </div>
                            </dl>
                        </div>

                        {order.shippingAddress && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-900 mb-2">Shipping Address</h3>
                                <div className="text-sm text-gray-600">
                                    <p>{order.shippingAddress.street}</p>
                                    <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                                    <p>{order.shippingAddress.country}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {order.buyerNotes && (
                        <div>
                            <h3 className="text-sm font-medium text-gray-900 mb-2">Buyer Notes</h3>
                            <p className="text-sm text-gray-600">{order.buyerNotes}</p>
                        </div>
                    )}

                    {order.cancelReason && (
                        <div>
                            <h3 className="text-sm font-medium text-gray-900 mb-2">Cancellation Reason</h3>
                            <p className="text-sm text-gray-600">{order.cancelReason}</p>
                            <p className="text-xs text-gray-500">Cancelled on {formatDate(order.cancelledAt)}</p>
                        </div>
                    )}

                    {order.shippedAt && (
                        <div>
                            <h3 className="text-sm font-medium text-gray-900 mb-2">Shipping Information</h3>
                            <p className="text-sm text-gray-600">Shipped on {formatDate(order.shippedAt)}</p>
                        </div>
                    )}
                </div>

                <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
                    <button
                        onClick={() => navigate('/orders')}
                        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                    >
                        Back to Orders
                    </button>
                    
                    {(order.status === 'pending' || order.status === 'confirmed') && (
                        <button
                            onClick={handleCancelOrder}
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                        >
                            Cancel Order
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;
