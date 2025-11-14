# GIS Application

This repository contains the GIS application, which is divided into two main parts:

1. **Backend**: Built with Node.js, TypeScript, and Prisma ORM.
2. **Frontend**: Built with Next.js and TypeScript.

## Prerequisites

Ensure you have the following installed on your system:

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL (or any other database supported by Prisma)

## Backend

### Getting Started

1. **Navigate to the Backend Directory**:

   ```bash
   cd backend
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure Environment Variables**:

   Create a `.env` file in the `backend` directory and add the required environment variables. Refer to the `prisma.config.ts` file for database configuration details.

4. **Run Database Migrations**:

   ```bash
   npx prisma migrate dev
   ```

5. **Start the Development Server**:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The server will start on [http://localhost:3000](http://localhost:3000).

### Project Structure

- **src/**: Contains the source code for the backend service.
  - **controller/**: Handles the business logic for various routes.
  - **middleware/**: Contains middleware functions for request handling.
  - **routes/**: Defines the API routes.
  - **utils/**: Utility functions used across the application.
  - **config/**: Configuration files, including database setup.
- **prisma/**: Contains the Prisma schema and migration files.

### Scripts

- `npm run dev`: Start the development server.
- `npm run build`: Build the project for production.
- `npm run start`: Start the production server.
- `npx prisma studio`: Open Prisma Studio to manage the database.

## Frontend

### Getting Started

1. **Navigate to the Frontend Directory**:

   ```bash
   cd frontend
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the Development Server**:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The application will be available at [http://localhost:3000](http://localhost:3000).

### Project Structure

- **src/**: Contains the source code for the frontend application.
  - **components/**: Reusable UI components.
  - **context/**: Context providers for state management.
  - **layouts/**: Layout components for different pages.
  - **pages/**: Next.js pages, including API routes.
  - **services/**: Handles API calls and business logic.
  - **styles/**: Global and component-specific styles.
  - **utils/**: Utility functions used across the application.

### Scripts

- `npm run dev`: Start the development server.
- `npm run build`: Build the project for production.
- `npm run start`: Start the production server.

## Learn More

- [Prisma Documentation](https://www.prisma.io/docs) - Learn about Prisma ORM.
- [Node.js Documentation](https://nodejs.org/en/docs/) - Learn about Node.js features and API.
- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API.

## License

This project is licensed under the MIT License.