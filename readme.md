# Real-Time Chat Application 💬⚡

A full-stack real-time chat application built with modern web technologies. Features instant messaging, user authentication, and real-time updates.

## Features ✨

- 🔒 JWT Authentication & Authorization
- ⚡ Real-time messaging with Socket.io
- 🟢 Online user status indicators
- 🌈 Modern UI with TailwindCSS + DaisyUI
- � Comprehensive error handling
- 📱 Responsive design
- 🔄 Global state management with Zustand
- 🚀 Free deployment configuration

## Tech Stack 🛠️

**Client:**

- React.js
- TailwindCSS
- DaisyUI
- Zustand
- Socket.io-client

**Server:**

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Socket.io

**Environment Variables**

Create `.env` file in server directory:

```env
# Database Configuration
MONGODB_URI=your_mongodb_connection_string
PORT=5001

# Authentication
JWT_SECRET=your_jwt_secret_key

# Cloudinary Configuration (for image storage)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Environment Mode
NODE_ENV=development
```
