import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ordersAPI } from '../services/api';

const OrdersPage = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError('');
            console.log('Fetching orders...');
            
            const response = await ordersAPI.getAll();
            console.log('Orders API response:', response);
            
            // Handle the response properly - expect orders array directly or in data.orders
            let ordersArray = [];
            if (response.data) {
                if (Array.isArray(response.data)) {
                    ordersArray = response.data;
                } else if (response.data.orders && Array.isArray(response.data.orders)) {
                    ordersArray = response.data.orders;
                } else if (typeof response.data === 'object') {
                    // If it's a single order object, wrap in array
                    ordersArray = [response.data];
                }
            }
            
            // Debug price information for each order
            ordersArray.forEach((order, index) => {
                console.log(`Order ${index + 1} price data:`, {
                    id: order.id,
                    totalPrice: order.totalPrice,
                    priceType: typeof order.totalPrice,
                    quantity: order.quantity,
                    listingId: order.listingId
                });
            });
            
            console.log('Final orders array:', ordersArray);
            setOrders(ordersArray);
        } catch (error) {
            console.error('Error fetching orders:', error);
            if (error.response?.status === 401) {
                // Unauthorized - redirect to login
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }
            setError('Failed to load orders');
            setOrders([]); // Ensure empty array on error
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (orderId) => {
        console.log('View Details clicked for order ID:', orderId);
        navigate(`/orders/${orderId}`);
    };

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to cancel this order?')) {
            return;
        }

        try {
            console.log('Cancelling order with ID:', orderId);
            await ordersAPI.cancel(orderId, { cancelReason: 'Customer request' });
            alert('Order cancelled successfully!');
            // Refresh orders list
            fetchOrders();
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
                    <p className="mt-4 text-gray-600">Loading orders...</p>
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
                <button
                    onClick={fetchOrders}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
                <div className="text-sm text-gray-500">
                    {orders.length} order{orders.length !== 1 ? 's' : ''}
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📦</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-500 mb-4">Start shopping to see your orders here!</p>
                    <button
                        onClick={() => navigate('/listings')}
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                    >
                        Browse Listings
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Order #{order.id}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            Listing ID: {order.listingId}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                        <p className="text-lg font-bold text-gray-900 mt-1">
                                            ${formatPrice(order.totalPrice)}
                                        </p>
                                        {/* Debug info - remove in production */}
                                        {process.env.NODE_ENV === 'development' && (
                                            <p className="text-xs text-gray-400">
                                                Raw: {JSON.stringify(order.totalPrice)}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Quantity:</span> {order.quantity || 1}
                                        </p>
                                        {order.shippingAddress && (
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Shipping to:</span> {order.shippingAddress.city}, {order.shippingAddress.country}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        {order.buyerNotes && (
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Notes:</span> {order.buyerNotes}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                    <div className="text-sm text-gray-500">
                                        Order placed on {formatDate(order.createdAt)}
                                    </div>
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={() => handleViewDetails(order.id)}
                                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                        >
                                            View Details
                                        </button>
                                        {(order.status === 'pending' || order.status === 'confirmed') && (
                                            <button
                                                onClick={() => handleCancelOrder(order.id)}
                                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                                            >
                                                Cancel Order
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrdersPage;
