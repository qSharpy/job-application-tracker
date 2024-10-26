# Job Application Tracker

A full-stack application to help job seekers track and analyze their job applications. Features a freemium model with advanced analytics for premium users.

## Features

### Free Tier
- User authentication (register/login)
- Track job applications with details like:
    - Company name
    - Position
    - Application status
    - Notes
    - Important dates
- Basic CRUD operations for job applications
- Clean and intuitive dashboard interface

### Premium Tier ($9/month)
- Advanced analytics including:
    - Application status overview with visual charts
    - Application timeline analysis
    - Interview performance metrics
    - Personalized insights based on user's data
- More features planned (see Roadmap)

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- JWT for authentication
- Stripe for payment processing

### Frontend
- React
- React Router for navigation
- Formik for form handling
- Recharts for data visualization
- Stripe.js for payment integration

### Infrastructure
- Docker for containerization
- Environment variables for configuration

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Docker and Docker Compose
- MongoDB
- Stripe account (for payment processing)

### Environment Variables
Create `.env` files in both backend and frontend directories:

#### Backend (.env)
```
MONGODB_URI=mongodb://mongo:27017/job_tracker
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
FRONTEND_URL=http://localhost:3000
```

#### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

### Installation and Setup

1. Clone the repository
```bash
git clone https://github.com/qSharpy/job-application-tracker.git
cd job-application-tracker
```

2. Start the application using Docker Compose
```bash
docker-compose up --build
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### Development Setup

For local development without Docker:

1. Install backend dependencies
```bash
cd backend
npm install
npm run dev
```

2. Install frontend dependencies
```bash
cd frontend
npm install
npm start
```

## Testing
*To be implemented*
- Unit tests for backend services
- Integration tests for API endpoints
- Frontend component testing
- E2E testing

## Roadmap

### Short-term
- [ ] Complete advanced analytics implementation
- [ ] Add subscription management features
- [ ] Implement email reminders for application follow-ups
- [ ] Add interview preparation tips
- [ ] Improve error handling and loading states

### Long-term
- [ ] Mobile app development
- [ ] Integration with popular job boards
- [ ] Machine learning-based insights
- [ ] Social features (anonymous comparisons with other job seekers)
- [ ] Data export functionality
- [ ] Referral system

## Contributing
The project is currently not accepting contributions as it's in early development stages. This may change in the future.

## License
This project is licensed under the MIT License - see the LICENSE.md file for details.

## Acknowledgments
- Thanks to all the open-source libraries and tools that made this project possible
- Inspired by the challenges of managing multiple job applications efficiently

## Project Status
This project is currently in development. The basic features are implemented and working, but advanced features are still being developed. Development may be paused for extended periods.

## Contact
Bogdan Bujor - bogdan.bujor08@gmail.com
Project Link: https://github.com/qSharpy/job-application-tracker

## Support
If you found this project helpful, please give it a ⭐️!