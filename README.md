# Paw Protection - Pet Adoption Platform

A comprehensive pet adoption platform built with Next.js, featuring JWT-based authentication, role-based access control, and a content-based recommendation system.

## Features

### Authentication & Authorization
- **JWT-based Authentication**: Secure token-based authentication with HTTP-only cookies
- **Role-based Access Control**: Two roles (Admin and User) with protected routes
- **Fixed Admin Credentials**: Admin login with environment-based credentials
- **User Registration**: PostgreSQL-based user registration and management

### User Features
- **User Dashboard**: Personalized dashboard with activity tracking
- **Pet Recommendations**: Content-based filtering algorithm for pet matching
- **Advanced Search & Filtering**: Comprehensive pet search with multiple filters
- **Favorites System**: Save and manage favorite pets
- **Preferences Management**: Set and update pet preferences and location

### Admin Features
- **Admin Dashboard**: Comprehensive admin panel with statistics
- **Pet Management**: CRUD operations for pet listings
- **User Management**: View and manage user accounts
- **Analytics**: Platform statistics and adoption trends

### Technical Features
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Real-time Updates**: Dynamic content updates and filtering
- **Database Integration**: PostgreSQL with proper schema design
- **API Routes**: RESTful API endpoints for all operations
- **Middleware Protection**: Route protection with JWT verification

## Tech Stack

- **Frontend**: Next.js 13, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Authentication**: JWT with HTTP-only cookies
- **Database**: PostgreSQL with pg driver
- **Icons**: Lucide React
- **State Management**: React Context API

## Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd paw-protection
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Database Configuration
   DATABASE_URL=postgresql://username:password@localhost:5432/paw_protection

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d

   # Admin Credentials (Fixed)
   ADMIN_EMAIL=admin@pawprotection.com
   ADMIN_PASSWORD=admin123secure

   # Next.js Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret-key
   ```

4. **Set up the database**
   ```bash
   # Create the database
   createdb paw_protection

   # Run the initialization script
   psql -d paw_protection -f sql/init.sql
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Admin Login: admin@pawprotection.com / admin123secure

## Database Schema

### Users Table
- `id`: Primary key
- `name`: User's full name
- `email`: Unique email address
- `password`: Hashed password
- `location`: User's location
- `preferences`: JSON preferences data
- `created_at`, `updated_at`: Timestamps

### Pets Table
- `id`: Primary key
- `name`: Pet's name
- `species`: Dog, Cat, etc.
- `breed`: Pet breed
- `age`: Pet age in years
- `gender`: Male/Female
- `size`: Small, Medium, Large, Extra Large
- `temperament`: Array of personality traits
- `activity_level`: Low, Moderate, High, Very High
- `health_status`: Current health status
- `adoption_requirements`: Array of requirements
- `description`: Detailed description
- `images`: Array of image URLs
- `location_*`: Location-related fields
- `diet_*`: Diet requirements
- `toys`: Recommended toys
- `space_requirements`: JSON space needs
- `compatibility`: JSON compatibility data
- `adoption_fee`: Adoption fee amount
- `availability_status`: Available, Pending, Adopted

### Additional Tables
- `adoption_applications`: Track adoption applications
- `user_favorites`: User's saved pets

## API Endpoints

### Authentication
- `POST /api/auth/login` - User/Admin login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user info

### Protected Routes
- `/admin/*` - Admin-only routes
- `/dashboard/*` - User-only routes
- `/preferences` - User preferences
- `/recommendations` - User recommendations
- `/favorites` - User favorites

## Role-Based Access

### Admin Role
- Access to `/admin` dashboard
- Pet management (CRUD operations)
- User management
- Platform analytics
- Fixed credentials (no registration)

### User Role
- Access to `/dashboard`
- Pet browsing and search
- Recommendations based on preferences
- Favorites management
- Profile and preferences management

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **HTTP-only Cookies**: Prevent XSS attacks
- **Password Hashing**: bcrypt for secure password storage
- **Route Protection**: Middleware-based route protection
- **Role Verification**: Server-side role checking
- **Input Validation**: Comprehensive input validation
- **SQL Injection Prevention**: Parameterized queries

## Deployment

### Environment Setup
1. Set up PostgreSQL database
2. Configure environment variables
3. Run database migrations
4. Build and deploy the application

### Production Considerations
- Use strong JWT secrets
- Enable HTTPS
- Configure proper CORS settings
- Set up database backups
- Monitor application performance
- Implement rate limiting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.