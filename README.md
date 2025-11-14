# MERN Stack GIS Map

## Overview

This project is a Geographic Information System (GIS) application built using the MERN stack (MongoDB, Express.js, React, Node.js). It provides an interactive map interface with features for managing and visualizing geospatial data. The application is designed to be scalable, modular, and user-friendly.

## Features

- **Frontend**: Built with Next.js for server-side rendering and optimized performance.
  - Interactive map visualization using Cesium.js.
  - Multi-language support with `next-i18next`.
  - Modular components for authentication, dashboard, and layouts.
  - Responsive design with reusable styles.

- **Backend**: Powered by Node.js and Express.js.
  - Prisma ORM for database management.
  - RESTful API endpoints for authentication, user management, and dashboard data.
  - Middleware for authentication and request validation.

- **Database**: 
  - Prisma schema for defining and managing database models.
  - Migration scripts for database versioning.

- **GIS Integration**:
  - Cesium.js for 3D map rendering.
  - Utilities for geospatial calculations.

## Folder Structure

### Backend
- `src/`: Contains the main application logic, including controllers, routes, middleware, and utilities.
- `prisma/`: Database schema and migration files.
- `config/`: Configuration files for database and other services.

### Frontend
- `src/`: Contains React components, pages, services, and utilities.
- `public/`: Static assets, including Cesium.js resources and images.
- `styles/`: Global CSS styles.

## Prerequisites

- Node.js (v16+)
- MongoDB
- Prisma CLI
- Yarn or npm

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/mern-stack-gis-map.git
   cd mern-stack-gis-map
   ```

2. Install dependencies:
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

3. Configure environment variables:
   - Backend: Create a `.env` file in the `backend` directory and add your database connection string and other secrets.
   - Frontend: Create a `.env.local` file in the `frontend` directory for frontend-specific configurations.

4. Run database migrations:
   ```bash
   cd backend
   npx prisma migrate dev
   ```

5. Start the development servers:
   ```bash
   # Backend
   cd backend
   npm run dev

   # Frontend
   cd ../frontend
   npm run dev
   ```

6. Open the application in your browser:
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.