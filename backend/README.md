backend/
├── models/                 // Schemas for MongoDB objects
│   ├── User.js
│   ├── Chat.js
│   ├── Message.js
│   ├── Poll.js
│   ├── PollOption.js
├── routes/                 // Define route handlers
│   ├── authRoutes.js       // For login/signup
│   ├── chatRoutes.js       // For chat and messaging
│   ├── pollRoutes.js       // For poll creation and voting
│   ├── helpRoutes.js       // For help-related endpoints
│   ├── userRoutes.js       // For user-specific actions
├── controllers/            // Business logic for routes
│   ├── authController.js
│   ├── chatController.js
│   ├── pollController.js
│   ├── userController.js
├── utils/                  // Helper utilities (e.g., UUID)
│   ├── generateUUID.js
│   ├── validation.js
├── config/                 // Configuration and environment files
│   ├── db.js               // MongoDB connection setup
│   ├── dotenv.config.js    // Load environment variables
├── app.js                  // Main application entry point
├── package.json            // Dependencies and scripts
