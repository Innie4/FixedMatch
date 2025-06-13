# Football Predictions Platform

A real-time football predictions platform with VIP access, payment processing, and admin dashboard.

## Features

- Real-time predictions updates
- VIP subscription system
- Payment confirmation workflow
- Admin dashboard
- User authentication
- Email notifications
- File uploads
- Rate limiting
- Security features

## Tech Stack

- Next.js 14
- TypeScript
- Prisma
- PostgreSQL
- AWS S3
- SendGrid
- WebSocket
- Tailwind CSS
- Framer Motion

## Prerequisites

- Node.js 18+
- PostgreSQL
- AWS Account (for S3)
- SendGrid Account
- Redis (for rate limiting)

## Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/predicts"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret"

# AWS
AWS_REGION="your-region"
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_S3_BUCKET="your-bucket"

# Email
SENDGRID_API_KEY="your-api-key"
EMAIL_FROM="noreply@predicts.com"

# Redis
REDIS_URL="redis://localhost:6379"

# WebSocket
NEXT_PUBLIC_WS_URL="ws://localhost:8090/ws"
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/predicts.git
cd predicts
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
npx prisma migrate dev
```

4. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── app/                 # Next.js app directory
├── components/          # React components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── services/           # External services
├── types/              # TypeScript types
└── __tests__/          # Test files
```

## API Routes

### Authentication
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Predictions
- `GET /api/predictions` - Get predictions
- `POST /api/predictions` - Create prediction
- `PUT /api/predictions/:id` - Update prediction
- `DELETE /api/predictions/:id` - Delete prediction

### VIP
- `GET /api/vip/access` - Check VIP access
- `POST /api/vip/subscribe` - Subscribe to VIP
- `GET /api/vip/predictions` - Get VIP predictions

### Payment
- `POST /api/payment-confirmations` - Submit payment confirmation
- `GET /api/payment-confirmations` - Get payment confirmations
- `PUT /api/payment-confirmations/:id` - Update payment confirmation

## WebSocket Events

### Client Events
- `PREDICTIONS_UPDATED` - New predictions available
- `PACKAGES_UPDATED` - Package updates
- `PAYMENT_CONFIRMED` - Payment confirmation status
- `VIP_ACTIVATED` - VIP access activated

### Admin Events
- `ADMIN_UPDATE` - Admin dashboard updates
- `USER_ACTIVITY` - User activity updates
- `SYSTEM_ALERT` - System alerts

## Development

### Code Style
- Use TypeScript for type safety
- Follow ESLint rules
- Use Prettier for formatting
- Write meaningful commit messages

### Testing
```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run e2e tests
npm run test:e2e
```

### Deployment
```bash
# Build for production
npm run build

# Start production server
npm start
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT

## Support

For support, email support@predicts.com or join our Discord server.
