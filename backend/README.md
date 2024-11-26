## Motivation
MVC structure just makes it's easier to read and understand the flow of the project: requests go through routers, routers call controllers, controllers handle logic, interact with db, and send back data to the frontend.
## File Structure
```code
backend/
├── models/                 // Schemas for MongoDB objects
│   ├── User.js
│   ├── Chat.js
│   ├── Message.js
│   ├── Poll.js
│   ├── PollOption.js
├── routes/                 // Define route handlers
│   ├── authRoutes.js       // For login/signup
│   ├── chatRoutes.js       // For chat, messaging, and poll
│   ├── userRoutes.js       // For user-specific actions: join, create, help page, profile
├── controllers/            // Business logic for routes
│   ├── authController.js
│   ├── chatController.js
│   ├── pollController.js
│   ├── userController.js
├── utils/                  // Helper utilities (e.g., UUID)
│   ├── generateUUID.js
│   ├── validation.js
├── app.js                  // Main application entry point
├── package.json            // Dependencies and scripts
```