# eBay Clone Frontend
A modern web application for buying and selling items online, built with React and Vite.
## Features

- User registration and authentication
- Browse and search listings
- Create, edit, and delete listings
- Place orders
- User profile management
- Responsive design

## Installation

1. Clone the repository:
```bash
git clone <your-repository-url>
cd ebay-clone-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
# The .env file is already configured for production deployment
# API URL: https://ebayclone.olga-orlova.me
```

4. Start the development server:
```bash
npm run dev
```
The application will be available at http://localhost:5173

## Build for Production
```bash
npm run build
```
The built files will be in the dist/ directory.

## API Integration
This frontend connects to the eBay Clone API running on the production server.
**Production API URL:** https://ebayclone.olga-orlova.me

**Note:** This configuration is set for production deployment. Local development will connect to the remote API server.

## Deployment
The application is configured to connect to the production API server at https://ebayclone.olga-orlova.me
