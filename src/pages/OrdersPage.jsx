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
            console.log('Fetching all orders...');
            const response = await ordersAPI.getAll();
            console.log('Orders response:', response);
            console.log('Orders data:', response.data);
            console.log('Is response.data an array?', Array.isArray(response.data));

            // Обработка разных форматов ответа от сервера
            let ordersArray = [];
            if (Array.isArray(response.data)) {
                ordersArray = response.data;
            } else if (response.data && Array.isArray(response.data.orders)) {
                ordersArray = response.data.orders;
            } else if (response.data && typeof response.data === 'object') {
                // Если это объект с заказами, преобразуем в массив
                console.log('Response data keys:', Object.keys(response.data));
                ordersArray = Object.values(response.data).filter(item =>
                    item && typeof item === 'object' && item.id
                );
            }

            console.log('Final orders array:', ordersArray);
            setOrders(ordersArray);
            setError('');
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError('Failed to load orders');
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (orderId) => {
        console.log('View Details clicked for order ID:', orderId);
        console.log('Order ID type:', typeof orderId);
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
            // Обновить список заказов
            fetchOrders();
        } catch (error) {
            console.error('Error cancelling order:', error);
            alert('Failed to cancel order. Please try again.');
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            confirmed: 'bg-blue-100 text-blue-800',
            shipped: 'bg-purple-100 text-purple-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading orders...</p>
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
                    {orders.map((order) => {
                        console.log('Rendering order:', order); // Debug log
                        return (
                            <div key={order.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-4">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Order #{order.id}
                                            </h3>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                                {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Unknown'}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-bold text-gray-900">
                                                €{order.totalPrice || '0.00'}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {formatDate(order.createdAt)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Listing ID</p>
                                            <p className="font-medium">{order.listingId || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Quantity</p>
                                            <p className="font-medium">{order.quantity || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Order Date</p>
                                            <p className="font-medium">{formatDate(order.createdAt)}</p>
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
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default OrdersPage;