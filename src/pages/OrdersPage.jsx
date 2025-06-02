import React, { useState, useEffect } from 'react';
import { ordersAPI } from '../services/api';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await ordersAPI.getAll();
            setOrders(response.data);
        } catch (error) {
            setError('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center">Loading orders...</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">My Orders</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                {orders.map((order) => (
                    <div key={order.id} className="card">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-bold">Order #{order.id}</h3>
                                <p className="text-gray-600">Listing ID: {order.listingId}</p>
                                <p className="text-gray-600">Quantity: {order.quantity}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-green-600">
                                    ${order.totalPrice}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {orders.length === 0 && !loading && (
                <div className="text-center py-8">
                    <p className="text-gray-500">No orders found.</p>
                </div>
            )}
        </div>
    );
};

export default OrdersPage;