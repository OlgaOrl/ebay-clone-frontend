import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
                Welcome to eBay Clone
            </h1>
            <p className="text-xl text-gray-600 mb-8">
                Buy and sell items online
            </p>
            <div className="space-x-4">
                <Link to="/listings" className="btn btn-primary">
                    Start Shopping
                </Link>
                <Link to="/listings/create" className="btn btn-secondary">
                    Create Listing
                </Link>
            </div>
        </div>
    );
};

export default HomePage;