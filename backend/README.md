This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-index`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js index is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.

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
