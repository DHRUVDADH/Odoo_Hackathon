# ReWear Backend API

A Node.js/Express backend for the ReWear sustainable fashion platform.

## Features

- 🔐 JWT Authentication
- 👥 User Management
- 👕 Item Management
- 🔄 Swap System
- 📧 Email Notifications
- 🖼️ Image Upload (Cloudinary)
- 🛡️ Security Middleware
- 📊 MongoDB Database
- ⚡ Rate Limiting

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- pnpm (recommended) or npm

## Installation

1. **Clone the repository**

   ```bash
   cd backend
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp env.example .env
   ```

   Edit `.env` with your configuration:

   - MongoDB connection string
   - JWT secret
   - Cloudinary credentials (optional)
   - Email settings (optional)

4. **Start the development server**
   ```bash
   pnpm dev
   ```

## Environment Variables

Create a `.env` file in the backend root with these variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/rewear_db

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload (Cloudinary) - Optional
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration - Optional
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/logout` - Logout user
- `GET /api/v1/auth/profile` - Get user profile
- `PUT /api/v1/auth/profile` - Update user profile
- `PUT /api/v1/auth/change-password` - Change password
- `POST /api/v1/auth/refresh-token` - Refresh JWT token

### Users

- `GET /api/v1/users/:id` - Get user by ID (placeholder)

### Items

- `GET /api/v1/items` - Get all items (placeholder)

### Swaps

- `GET /api/v1/swaps` - Get swaps (placeholder)

## Database Models

### User

- Authentication fields (username, email, password)
- Profile information (firstName, lastName, bio, location)
- Preferences and settings
- Statistics and points

### Item

- Item details (title, description, category, size, condition)
- Pricing and images
- Owner and status
- Swap preferences

### Swap

- Swap request details
- Status tracking
- Shipping information
- Ratings and reviews

### Notification

- User notifications
- Email and push notification tracking
- Expiration handling

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   └── auth.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   └── validation.middleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Item.js
│   │   ├── Swap.js
│   │   └── Notification.js
│   └── routes/
│       ├── auth.routes.js
│       ├── user.routes.js
│       ├── item.routes.js
│       └── swap.routes.js
├── app.js
├── constants.js
├── index.js
├── package.json
└── env.example
```

## Scripts

- `pnpm dev` - Start development server with nodemon
- `pnpm start` - Start production server
- `pnpm test` - Run tests
- `pnpm lint` - Run ESLint

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation
- File upload restrictions

## Development

### Adding New Routes

1. Create controller in `src/controllers/`
2. Create route file in `src/routes/`
3. Add route to `app.js`

### Adding New Models

1. Create model in `src/models/`
2. Add validation rules
3. Create indexes for performance

### Testing

```bash
pnpm test
```

## Deployment

1. Set `NODE_ENV=production`
2. Configure production MongoDB
3. Set secure JWT secret
4. Configure CORS for production domain
5. Set up environment variables

## Contributing

1. Follow the existing code structure
2. Add validation for all inputs
3. Include error handling
4. Write tests for new features
5. Update documentation

## License

MIT
