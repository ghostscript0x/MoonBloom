# Moon Bloom Tracker - Backend

Express.js backend for the Moon Bloom menstrual cycle tracking app.

## Features

- User authentication with JWT
- Menstrual cycle tracking and analytics
- Health metrics logging
- AI-powered insights
- Email notifications
- Rate limiting and security middleware

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/moon-bloom-tracker
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=30d
EMAIL_SERVICE=gmail
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

3. Start the development server:
```bash
npm run dev
```

4. For production:
```bash
npm start
```

## Scripts

- `npm start` - Start production server (automatically kills processes on port 5000)
- `npm run dev` - Start development server with nodemon
- `npm run kill` - Kill any processes running on port 5000
- `npm run restart` - Kill processes on port 5000 and restart server
- `npm test` - Run tests
- `npm run audit` - Run security audit

## Port Management

The backend automatically handles port conflicts:

- **Prestart Script**: `npm start` will automatically kill any processes using port 5000 before starting
- **Manual Kill**: Use `npm run kill` to manually free port 5000
- **Error Handling**: If port 5000 is still in use, the server will attempt to kill the conflicting process and restart

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)
- `POST /api/auth/verify-otp` - Verify email with OTP

### Cycles
- `GET /api/cycles` - Get user's cycles
- `POST /api/cycles` - Create new cycle entry
- `PUT /api/cycles/:id` - Update cycle
- `DELETE /api/cycles/:id` - Delete cycle

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/settings` - Update user settings

### Analytics
- `GET /api/analytics` - Get cycle analytics and insights

## Security

- Rate limiting (5 requests per 15min for auth, 20 for user verification)
- Input sanitization and validation
- CORS configuration
- Helmet security headers
- JWT authentication
- Password hashing with bcrypt

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment mode | development |
| PORT | Server port | 5000 |
| MONGO_URI | MongoDB connection string | mongodb://localhost:27017/moon-bloom-tracker |
| JWT_SECRET | JWT signing secret | Required |
| JWT_EXPIRE | JWT expiration time | 30d |
| EMAIL_SERVICE | Email service provider | gmail |
| EMAIL_USERNAME | Email username | Required |
| EMAIL_PASSWORD | Email password/app password | Required |

## Testing

Run tests with:
```bash
npm test
```

## Deployment

The app is configured for deployment on platforms like Render, Heroku, or Vercel with proper environment variable setup.</content>
<parameter name="filePath">C:\Users\ghost\Downloads\moon-bloom-tracker-2cae526b-main\moon-bloom-tracker-2cae526b-main\backend\README.md