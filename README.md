# Project Environment Configuration

This document outlines the environment variables required for running the Legit Soccer Tips application and best practices for managing them across different environments (development, staging, production).

## 1. .env.example File

A `.env.example` file is provided in the project root. This file lists all the necessary environment variables with placeholder values. It serves as a template for your actual `.env` files.

**Do NOT commit your actual `.env` files to version control.** These files contain sensitive information (like API keys and database credentials) and should be kept private.

## 2. Required Environment Variables

Here's a breakdown of the environment variables used in this project:

- **`NODE_ENV`**: Sets the application's environment.

  - `development`: For local development. Enables development-specific features (e.g., Prisma Studio, detailed error logging).
  - `production`: For production deployments. Optimizes build, disables development features, and ensures secure configurations.
  - `test`: For running tests.
  - **Example**: `NODE_ENV=development`

- **`NEXT_PUBLIC_APP_URL`**: The base URL of your application. This is a public environment variable and is accessible in both client-side and server-side code.

  - **Development Example**: `NEXT_PUBLIC_APP_URL=http://localhost:3000`
  - **Production Example**: `NEXT_PUBLIC_APP_URL=https://www.yourdomain.com`

- **`DATABASE_URL`**: The connection string for your PostgreSQL database.

  - **Example**: `DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"`
  - **Note**: Ensure your database server is running and accessible.

- **`NEXTAUTH_SECRET`**: A secret key used by NextAuth.js for signing and encrypting session tokens. **Generate a strong, random string for this.**

  - You can generate one using `openssl rand -base64 32` or by visiting [generate-secret.now.sh](https://generate-secret.now.sh/).

- **`GOOGLE_CLIENT_ID`** & **`GOOGLE_CLIENT_SECRET`**: Credentials for Google OAuth provider, used with NextAuth.js. Obtain these from the Google Cloud Console.

- **`FACEBOOK_CLIENT_ID`** & **`FACEBOOK_CLIENT_SECRET`**: Credentials for Facebook OAuth provider, used with NextAuth.js. Obtain these from the Facebook Developer Portal.

- **`STRIPE_SECRET_KEY`**: Your Stripe secret API key for processing payments. Obtain this from your Stripe Dashboard.

- **`CRON_SECRET`**: A secret key used to secure internal API endpoints triggered by cron jobs (e.g., Vercel Cron). This should be a strong, random string.

## 3. Setting Up Environment Configurations

To manage configurations for different environments, follow these steps:

1.  **Local Development (`.env.development.local` / `.env.local`):**

    - Create a file named `.env.local` or `.env.development.local` in your project root.
    - Copy the contents from `.env.example` into this file.
    - Replace the placeholder values with your actual development credentials and URLs.
    - For `DATABASE_URL`, ensure it points to your local PostgreSQL instance.

2.  **Staging/Production:**
    - **Do NOT** create `.env` files directly in your repository for staging or production.
    - Instead, configure these environment variables directly within your hosting provider's (e.g., Vercel, Netlify, AWS, Heroku) dashboard or CI/CD pipeline settings.
    - Each hosting provider has a secure way to manage environment variables for deployed applications. This keeps sensitive data out of your codebase.

### Secure API Key Management

- **Never hardcode API keys or sensitive information** directly into your source code.
- Always use environment variables for sensitive data.
- Ensure your `
