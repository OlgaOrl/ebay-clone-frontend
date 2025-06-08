import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-blue-500 to-blue-600 text-white py-32">
                <div className="max-w-5xl mx-auto px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-12">
                        Welcome to{' '}
                        <span className="text-blue-100">eBay Clone</span>
                    </h1>
                    <p className="text-lg md:text-xl text-blue-50 mb-16 max-w-3xl mx-auto leading-relaxed">
                        Buy and sell items online with ease. Join thousands of users in our marketplace.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-start max-w-lg ml-12 mr-auto">
                        <Link
                            to="/listings"
                            className="bg-white text-blue-600 hover:bg-blue-50 font-semibold py-4 px-8 rounded-lg transition-colors duration-200 shadow-md border-2 border-white"
                        >
                            🛍️ Start Shopping
                        </Link>
                        <Link
                            to="/listings/create"
                            className="bg-blue-300 hover:bg-blue-200 text-blue-700 font-semibold py-4 px-8 rounded-lg transition-colors duration-200 shadow-md border-2 border-blue-200"
                        >
                            📦 Create Listing
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-32 bg-gray-50">
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <div className="mb-20">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">
                            Why Choose Our Platform?
                        </h2>
                        <p className="text-lg text-gray-600">
                            Everything you need for successful online trading
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                        <div className="bg-white p-10 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center">
                            <div className="text-5xl mb-8">🛒</div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-6">Easy Shopping</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Browse thousands of items and find exactly what you're looking for with our advanced search and filtering.
                            </p>
                        </div>

                        <div className="bg-white p-10 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center">
                            <div className="text-5xl mb-8">💰</div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-6">Sell Anything</h3>
                            <p className="text-gray-600 leading-relaxed">
                                List your items quickly and reach buyers around the world. Simple listing process with powerful tools.
                            </p>
                        </div>

                        <div className="bg-white p-10 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center">
                            <div className="text-5xl mb-8">🔒</div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-6">Secure Trading</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Safe and secure transactions with buyer protection and fraud prevention systems.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-24 bg-gray-100">
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">Join Our Growing Community</h2>
                        <p className="text-lg text-gray-600">Trusted by thousands of users worldwide</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="bg-white p-10 rounded-xl shadow-md text-center">
                            <div className="text-4xl font-bold text-blue-600 mb-4">1000+</div>
                            <div className="text-gray-600 font-medium">Active Listings</div>
                        </div>
                        <div className="bg-white p-10 rounded-xl shadow-md text-center">
                            <div className="text-4xl font-bold text-blue-600 mb-4">500+</div>
                            <div className="text-gray-600 font-medium">Happy Users</div>
                        </div>
                        <div className="bg-white p-10 rounded-xl shadow-md text-center">
                            <div className="text-4xl font-bold text-blue-600 mb-4">98%</div>
                            <div className="text-gray-600 font-medium">Satisfaction Rate</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-white">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-8">
                        Ready to Get Started?
                    </h2>
                    <p className="text-lg text-gray-600 mb-12">
                        Join thousands of users who are already buying and selling on our platform
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Link
                            to="/register"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200 shadow-md"
                        >
                            Sign Up Now
                        </Link>
                        <Link
                            to="/listings"
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-4 px-8 rounded-lg transition-colors duration-200"
                        >
                            Browse Listings
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;