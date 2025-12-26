# Auth MFE - Setup Instructions

## Installation

```bash
cd mfe-auth
npm install
npm start
```

The auth MFE will run on **http://localhost:3004**

## Features

✅ **Login** - Email/password authentication
✅ **Sign Up** - User registration
✅ **User Profile** - Display user information
✅ **Session Management** - Persistent login via localStorage
✅ **Auth Context** - Shared authentication state
✅ **Protected Routes** - Component for protecting routes
✅ **Custom Events** - Broadcasts auth events to other MFEs

## Usage in Other MFEs

Import the AuthContext in any MFE:

```tsx
import { useAuth } from "auth/useAuth";
import { ProtectedRoute } from "auth/ProtectedRoute";

const MyComponent = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <ProtectedRoute>
      <div>Protected content for {user?.name}</div>
    </ProtectedRoute>
  );
};
```

## Quick Start

1. Start all MFEs:

   - `cd mfe-products && npm start` (port 3001)
   - `cd mfe-cart && npm start` (port 3002)
   - `cd mfe-checkout && npm start` (port 3003)
   - `cd mfe-auth && npm start` (port 3004)
   - `cd mfe-ui && npm start` (port 3005)
   - `cd mfe-store-host && npm start` (port 3000)

2. Open http://localhost:3000
3. Click "Account" to login/signup
4. Use any email and password (6+ chars) for demo

## Port Updates

⚠️ **Note**: `mfe-ui` port changed from 3004 → 3005
