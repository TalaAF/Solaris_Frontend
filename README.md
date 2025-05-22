# Solaris LMS Frontend

## Overview

This is the frontend application for Solaris, a full-featured Learning Management System (LMS) designed for universities and educational institutions. Built with React and Vite, it provides a modern, responsive user interface for students, instructors, and administrators.

![Solaris LMS](./src/assets/logo.png)

## Features

- **Role-based interfaces** for students, instructors, and administrators
- **Course management** - browsing, enrollment, content delivery
- **Interactive assessments** with real-time feedback
- **Progress tracking** for students and instructors
- **User profile management**
- **Notifications and messaging** system
- **Calendar integration** for scheduling
- **Responsive design** that works on desktop and mobile devices
- **Modern UI** built with Material UI components

## Technology Stack

- **React 18** - UI library
- **Vite** - Build tool and development server
- **Material UI** - Component library
- **Lucide Icons** - Icon set
- **Axios** - HTTP client for API requests
- **React Router** - Routing
- **React Hot Toast** - Toast notifications
- **React Context API** - State management

## Project Structure

```
src/
├── assets/               # Static assets (images, icons, etc.)
├── components/
│   ├── admin/            # Admin pages/components
│   ├── auth/             # Login, register, password reset, etc.
│   ├── courses/          # Course views, modules, content
│   ├── layout/           # Sidebar, header, layout
│   ├── pages/            # Main pages (dashboard, calendar, VRLab, etc.)
│   ├── notifications/    # Notification context, detail, simulator
│   ├── community/        # Forums, chat, collaboration
│   ├── resources/        # Resource/material management
│   ├── progress/         # Progress tracking, analytics
│   └── ...               # Other feature components
├── context/              # React Context providers (Auth, Notification, etc.)
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── mocks/                # Mock data for development
├── services/             # API service wrappers (CourseService, UserService, etc.)
├── types/                # Type definitions
├── utils/                # Utility functions
├── App.jsx               # Main app and routing
├── App.css               # Global styles
├── main.jsx              # Entry point
└── index.css             # Global styles
```

## Prerequisites

- Node.js (v16+)
- npm or yarn
- Backend API service running (see main project README)

## Setup and Installation

1. Clone the repository
   ```bash
   git clone https://github.com/your-org/solaris-lms.git
   cd solaris-lms/Solaris
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Configure environment variables
   - Create a `.env` file in the root directory
   - Add the following variables:
     ```
     VITE_API_BASE_URL=http://localhost:8080/api
     VITE_APP_NAME=Solaris LMS
     ```

4. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3001](http://localhost:3001) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run test` - Run tests (if configured)

## Connecting to the Backend

The frontend connects to the backend through:

- **API Proxy**: Vite is configured to proxy API requests to the backend
- **Authentication**: JWT tokens are stored in localStorage and attached to API requests via Axios interceptors
- **Service Layer**: API calls are abstracted in `src/services/` (e.g., `CourseService.js`, `UserService.js`)
- **Data Flow**: Components fetch data using the service layer and update UI state accordingly

## Role-Based Access

The application implements role-based routing and UI rendering:

- **Admin**: Full system management (users, courses, departments)
- **Instructor**: Course creation, content management, student assessment
- **Student**: Course enrollment, content consumption, quiz taking

Routes are protected based on user roles through the authentication context.

## Development Guidelines

1. **Component Structure**
   - Create functional components with hooks
   - Use PascalCase for component names
   - Keep components focused and reusable

2. **State Management**
   - Use React Context for global state
   - Use local state for component-specific data
   - Extract reusable logic into custom hooks

3. **Styling**
   - Use Material UI components where possible
   - Create custom themes in `src/themes/`
   - Use CSS modules for component-specific styles

4. **API Integration**
   - All API calls should go through the services layer
   - Handle loading states and errors consistently
   - Use React Query for complex data fetching (optional)

5. **Form Handling**
   - Use Formik or React Hook Form for complex forms
   - Implement consistent validation patterns
   - Show clear error messages to users

## Deployment

1. Build the production version:
   ```bash
   npm run build
   # or
   yarn build
   ```

2. The built files will be in the `dist` directory, which can be deployed to any static hosting service.

3. For production, ensure the backend API is accessible and CORS is properly configured.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Material UI](https://mui.com/)
- [Axios](https://axios-http.com/)
- [React Router](https://reactrouter.com/)