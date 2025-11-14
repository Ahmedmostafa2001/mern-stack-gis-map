# Backend Service

This is the backend service for the GIS application. It is built using Node.js, TypeScript, and Prisma ORM.

## Prerequisites

Ensure you have the following installed on your system:

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL (or any other database supported by Prisma)

## Getting Started

### 1. Install Dependencies

Run the following command to install the required dependencies:

```bash
npm install
# or
yarn install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory and add the required environment variables. Refer to the `prisma.config.ts` file for database configuration details.

### 3. Run Database Migrations

To apply the Prisma migrations, run:

```bash
npx prisma migrate dev
```

### 4. Start the Development Server

Run the following command to start the development server:

```bash
npm run dev
# or
yarn dev
```

The server will start on [http://localhost:3000](http://localhost:3000).

## Project Structure

- **src/**: Contains the source code for the backend service.
  - **controller/**: Handles the business logic for various routes.
  - **middleware/**: Contains middleware functions for request handling.
  - **routes/**: Defines the API routes.
  - **utils/**: Utility functions used across the application.
  - **config/**: Configuration files, including database setup.
- **prisma/**: Contains the Prisma schema and migration files.

## Scripts

- `npm run dev`: Start the development server.
- `npm run build`: Build the project for production.
- `npm run start`: Start the production server.
- `npx prisma studio`: Open Prisma Studio to manage the database.

## Learn More

- [Prisma Documentation](https://www.prisma.io/docs) - Learn about Prisma ORM.
- [Node.js Documentation](https://nodejs.org/en/docs/) - Learn about Node.js features and API.

## License

This project is licensed under the MIT License.
