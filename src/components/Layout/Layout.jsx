import React from 'react';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Header - всегда вверху */}
            <Header />

            {/* Main content - растягивается и занимает доступное пространство */}
            <main className="flex-1 w-full">
                {children}
            </main>

            {/* Footer - всегда внизу */}
            <Footer />
        </div>
    );
};

export default Layout;