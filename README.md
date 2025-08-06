# E-Learning Frontend

A modern, responsive e-learning platform built with React, Tailwind CSS, and Vite.

## Features

### 🎯 Core Features
- **Landing Page**: Beautiful, responsive landing page with hero section and features
- **Authentication**: Register/Login with role-based access (Admin/Student)
- **Admin Dashboard**: Complete course management system
- **Student Dashboard**: Browse and purchase courses
- **Video Learning**: Watch course videos with progress tracking
- **Mobile Responsive**: Works perfectly on all devices

### 👑 Admin Features
- Create, edit, and delete courses
- Add multiple video URLs per course
- Course pricing management
- Dashboard with statistics
- User management

### 🎓 Student Features
- Browse available courses
- Purchase courses
- Access enrolled courses
- Video lesson player
- Progress tracking
- Course completion certificates

## Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **State Management**: React Context API

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend API running on port 5000

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd e-learning-frontend
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Backend Setup
Make sure your backend is running on `http://localhost:5000` with the following endpoints:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create course (Admin only)
- `PUT /api/courses/:id` - Update course (Admin only)
- `DELETE /api/courses/:id` - Delete course (Admin only)
- `POST /api/courses/buy/:id` - Purchase course
- `GET /api/courses/my` - Get purchased courses
- `GET /api/courses/lessons/:id` - Get course lessons

## Demo Accounts

### Admin Account
- **Email**: admin@demo.com
- **Password**: admin123

### Student Account
- **Email**: student@demo.com
- **Password**: student123

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Layout.jsx      # Main layout with navigation
│   └── ProtectedRoute.jsx # Route protection
├── context/            # React Context providers
│   └── AuthContext.jsx # Authentication context
├── pages/              # Page components
│   ├── LandingPage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── AdminDashboard.jsx
│   ├── CoursesPage.jsx
│   ├── MyCoursesPage.jsx
│   └── CourseLessonsPage.jsx
├── services/           # API services
│   └── api.js         # Axios configuration and API calls
├── App.jsx            # Main app component with routing
└── main.jsx           # App entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features Overview

### 📱 Mobile Responsive Design
- Mobile-first approach
- Responsive navigation with hamburger menu
- Touch-friendly interface
- Optimized for all screen sizes

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control
- Protected routes
- Automatic token management

### 🎥 Video Learning Platform
- Support for YouTube and direct video URLs
- Video progress tracking
- Lesson completion marking
- Course progress visualization

### 🎨 Modern UI/UX
- Clean, modern design
- Smooth animations and transitions
- Loading states and error handling
- Intuitive user experience

## Environment Configuration

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please contact the development team or create an issue in the repository.+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
