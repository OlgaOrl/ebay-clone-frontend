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
        console.log('ID type:', typeof id);

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
            console.log('Fetching order details for ID:', id);
            const response = await ordersAPI.getById(id);
            console.log('Order details response:', response);
            setOrder(response.data);
            setError('');
        } catch (error) {
            console.error('Error fetching order details:', error);
            console.error('Error response:', error.response);
            setError(`Failed to load order details: ${error.response?.status || 'Unknown error'}`);
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
            // Обновить детали заказа
            fetchOrderDetails();
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
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Debug информация в консоли
    console.log('Current render state:', { id, loading, error, order: !!order });

    if (loading) {
        return (
            <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading order details...</p>
                <p className="mt-1 text-sm text-gray-400">Order ID: {id}</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-2xl mx-auto py-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p><strong>Error:</strong> {error}</p>
                    <p className="text-sm mt-1">Order ID: {id || 'undefined'}</p>
                </div>
                <button
                    onClick={() => navigate('/orders')}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Back to Orders
                </button>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="max-w-2xl mx-auto py-8 text-center">
                <p className="text-gray-500">Order not found</p>
                <p className="text-sm text-gray-400">Attempted to load order ID: {id}</p>
                <button
                    onClick={() => navigate('/orders')}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Back to Orders
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => navigate('/orders')}
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Orders
                </button>

                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Unknown'}
                </span>
            </div>

            {/* Order Details Card */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b">
                    <h1 className="text-2xl font-bold text-gray-900">Order #{order.id}</h1>
                    <p className="text-gray-600">Placed on {formatDate(order.createdAt)}</p>
                </div>

                <div className="px-6 py-4 space-y-4">
                    {/* Order Summary */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-medium text-gray-900">Order Summary</h3>
                            <div className="mt-2 space-y-1 text-sm text-gray-600">
                                <p>Listing ID: {order.listingId || 'N/A'}</p>
                                <p>Quantity: {order.quantity || 'N/A'}</p>
                                <p className="text-lg font-bold text-green-600">
                                    Total: €{order.totalPrice || '0.00'}
                                </p>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-medium text-gray-900">Status Timeline</h3>
                            <div className="mt-2 space-y-1 text-sm text-gray-600">
                                <p>✅ Ordered: {formatDate(order.createdAt)}</p>
                                {order.confirmedAt && (
                                    <p>✅ Confirmed: {formatDate(order.confirmedAt)}</p>
                                )}
                                {order.shippedAt && (
                                    <p>🚚 Shipped: {formatDate(order.shippedAt)}</p>
                                )}
                                {order.deliveredAt && (
                                    <p>📦 Delivered: {formatDate(order.deliveredAt)}</p>
                                )}
                                {order.cancelledAt && (
                                    <p>❌ Cancelled: {formatDate(order.cancelledAt)}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    {order.shippingAddress && (
                        <div>
                            <h3 className="font-medium text-gray-900">Shipping Address</h3>
                            <div className="mt-2 text-sm text-gray-600">
                                <p>{order.shippingAddress.street}</p>
                                <p>
                                    {order.shippingAddress.city}
                                    {order.shippingAddress.state && `, ${order.shippingAddress.state}`}
                                    {order.shippingAddress.zipCode && ` ${order.shippingAddress.zipCode}`}
                                </p>
                                <p>{order.shippingAddress.country}</p>
                            </div>
                        </div>
                    )}

                    {/* Notes */}
                    {order.buyerNotes && (
                        <div>
                            <h3 className="font-medium text-gray-900">Order Notes</h3>
                            <p className="mt-2 text-sm text-gray-600">{order.buyerNotes}</p>
                        </div>
                    )}

                    {/* Cancel Reason */}
                    {order.cancelReason && (
                        <div>
                            <h3 className="font-medium text-gray-900">Cancellation Reason</h3>
                            <p className="mt-2 text-sm text-red-600">{order.cancelReason}</p>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="px-6 py-4 bg-gray-50 border-t">
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                            Order ID: {order.id}
                        </div>

                        <div className="space-x-3">
                            {(order.status === 'pending' || order.status === 'confirmed') && (
                                <button
                                    onClick={handleCancelOrder}
                                    className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
                                >
                                    Cancel Order
                                </button>
                            )}

                            <button
                                onClick={() => navigate('/orders')}
                                className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                            >
                                Back to Orders
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;