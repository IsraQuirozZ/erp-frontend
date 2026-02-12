# IQ-ERP Frontend

A modern, responsive Enterprise Resource Planning (ERP) system frontend built with React and Vite. This application provides a comprehensive interface for managing business operations including inventory, purchases, customers, suppliers, and more.

## 🚀 Overview

IQ-ERP is a full-featured ERP solution designed to streamline business processes and improve operational efficiency. The frontend application communicates with a Node.js/Express backend API with MySQL database to deliver a seamless user experience for managing various aspects of an enterprise.

## ✨ Features

- **User Authentication & Authorization**
  - Secure login and registration system
  - Role-based access control (Admin and User roles)
  - JWT token-based authentication
  - Protected routes and components

- **Dashboard**
  - Centralized overview of business metrics
  - Real-time data visualization
  - Quick access to key modules

- **Customer Management**
  - View and manage customer information
  - Customer status tracking (active/inactive)
  - Pagination and sorting capabilities
  - Advanced search and filtering

- **Supplier Management**
  - Comprehensive supplier database
  - Supplier order tracking
  - Status management and organization

- **Inventory Management**
  - Product and component tracking
  - Warehouse management
  - Stock level monitoring
  - Inventory organization

- **Purchase Management**
  - Purchase order creation and tracking
  - Supplier order items management
  - Invoice processing
  - Purchase history and analytics

- **User Management** (Admin only)
  - Create and manage user accounts
  - Role assignment and permissions
  - User activity tracking

## 🛠️ Tech Stack

### Frontend
- **React 19.2.0** - Modern UI library with latest features
- **Vite 7.2.4** - Next-generation frontend build tool
- **React Router DOM 7.13.0** - Client-side routing
- **Axios 1.13.3** - HTTP client for API communication
- **React Icons 5.5.0** - Comprehensive icon library

### Development Tools
- **ESLint** - Code linting and quality assurance
- **Vite Plugin React** - Fast Refresh and optimized builds
- **Google Fonts (Inter)** - Modern typography

### Backend (separate repository)
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **MySQL** - Relational database management system

## 📋 Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** (v16.0.0 or higher)
- **npm** (v7.0.0 or higher) or **yarn**
- **Backend API** running on `http://localhost:3000` (see Backend Setup section)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/IsraQuirozZ/erp-frontend.git
   cd erp-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

## ⚙️ Configuration

### API Configuration

The application is configured to connect to the backend API at `http://localhost:3000/api`. To modify this:

1. Open `src/api/axios.js`
2. Update the `baseURL` property:
   ```javascript
   const api = axios.create({
     baseURL: "http://your-api-url/api",
   });
   ```

### Environment Variables (Optional)

For production deployments, you can create a `.env` file to manage environment-specific configurations:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

Then update `src/api/axios.js` to use the environment variable:
```javascript
baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api"
```

## 🎯 Usage

### Development Mode

Start the development server with hot module replacement:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Build

Create an optimized production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

### Linting

Run ESLint to check code quality:

```bash
npm run lint
```

## 📁 Project Structure

```
erp-frontend/
├── public/              # Static assets
├── src/
│   ├── api/            # API configuration and utilities
│   │   └── axios.js    # Axios instance with interceptors
│   ├── auth/           # Authentication components and context
│   │   ├── AuthContext.jsx
│   │   ├── RequireAuth.jsx
│   │   └── RequireRole.jsx
│   ├── components/     # Reusable UI components
│   │   ├── DataTable/  # Table components
│   │   ├── Forms/      # Form components
│   │   ├── Modals/     # Modal components
│   │   ├── fields/     # Form field components
│   │   ├── ui/         # UI components
│   │   ├── Navbar.jsx
│   │   └── Sidebar.jsx
│   ├── configs/        # Table configurations
│   │   ├── componentTable.config.jsx
│   │   ├── customerTable.config.jsx
│   │   ├── purchaseTable.config.jsx
│   │   ├── supplierTable.config.jsx
│   │   └── warehouseTable.config.jsx
│   ├── layouts/        # Layout components
│   ├── pages/          # Page components
│   │   ├── CreateUser.jsx
│   │   ├── Customers.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Inventory.jsx
│   │   ├── Login.jsx
│   │   ├── Purchases.jsx
│   │   ├── Register.jsx
│   │   └── Suppliers.jsx
│   ├── routes/         # Route definitions
│   │   └── AppRouter.jsx
│   ├── services/       # API service layer
│   │   ├── component.service.js
│   │   ├── customer.service.js
│   │   ├── invoice.service.js
│   │   ├── purchases.service.js
│   │   ├── suppliers.service.js
│   │   └── warehouse.service.js
│   ├── styles/         # Global styles
│   ├── App.jsx         # Main App component
│   └── main.jsx        # Application entry point
├── index.html          # HTML template
├── package.json        # Dependencies and scripts
├── vite.config.js      # Vite configuration
└── eslint.config.js    # ESLint configuration
```

## 🔌 API Integration

The application integrates with a RESTful API built with Node.js, Express, and MySQL. Key API endpoints include:

- **Authentication**: `/api/auth/login`, `/api/auth/register`
- **Customers**: `/api/clients`
- **Suppliers**: `/api/suppliers`
- **Warehouses**: `/api/warehouses`
- **Components**: `/api/components`
- **Purchases**: `/api/purchases`
- **Invoices**: `/api/invoices`

All API requests include JWT authentication tokens via request interceptors.

## 🔐 Authentication Flow

1. User logs in via `/login` page
2. Backend validates credentials and returns JWT token
3. Token is stored in localStorage
4. Axios interceptor adds token to all subsequent requests
5. Protected routes check for valid token and user role
6. Unauthorized access redirects to login page

## 👥 User Roles

- **Admin**: Full access to all modules including user management, customers, suppliers, inventory, and purchases
- **User**: Access to dashboard and limited functionality

## 🔧 Development

### Code Style

The project uses ESLint with React-specific rules. Configuration includes:
- React Hooks rules
- React Refresh rules
- ES6+ syntax support

### Adding New Features

1. Create new components in `src/components/`
2. Add service functions in `src/services/`
3. Create new pages in `src/pages/`
4. Update routes in `src/routes/AppRouter.jsx`
5. Add table configurations in `src/configs/` if needed

### State Management

The application uses:
- React Context API for authentication state
- Local component state with useState
- Custom hooks for data fetching and management

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is private and proprietary.

## 👨‍💻 Author

**Israel Quiroz**

## 🙏 Acknowledgments

- React team for the amazing framework
- Vite team for the blazing-fast build tool
- All contributors and maintainers

---

**Note**: Make sure the backend API is running before starting the frontend application. The backend should be accessible at `http://localhost:3000` by default.
