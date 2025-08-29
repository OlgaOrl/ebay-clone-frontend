import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-12">
            <div className="max-w-5xl mx-auto px-8 text-center">
                <p className="text-lg font-medium mb-6">© 2025 eBay Clone by Olga Orlova</p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-8 mb-8">
                    <a
                        href="https://github.com/OlgaOrl/ebay-clone-frontend"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 transition-colors duration-200 font-medium flex items-center gap-3"
                    >
                        <span>📱</span> Frontend Repository
                    </a>
                    <span className="hidden sm:block text-gray-400 text-lg">|</span>
                    <a
                        href="https://github.com/OlgaOrl/ebay-clone-api"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 transition-colors duration-200 font-medium flex items-center gap-3"
                    >
                        <span>⚡</span> Backend Repository
                    </a>
                </div>
                <div className="pt-6 border-t border-gray-700 text-center">
                    <p className="text-gray-400">
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
