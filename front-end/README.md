# **React + Vite Project Setup**

This repository provides a streamlined setup for building a React application using Vite, with Hot Module Replacement (HMR) and customizable ESLint rules.

## **Key Features**
- **Fast Development**: Utilizes Vite's blazing-fast development server with HMR.
- **Flexible Configuration**: Includes official plugins to choose between Babel or SWC for Fast Refresh:
  - [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md): Uses Babel.
  - [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc): Uses SWC.

---

## **Folder Structure Overview**
This project follows a clean and modular folder structure for ease of development and scalability:

### **Root Directory**
- **`public/`**  
  Stores static assets (e.g., images, files) that are referenced by absolute URLs or excluded from Vite's build pipeline.

- **`src/`**  
  Contains the application code. Key subdirectories and files:
  - **`src/assets/`**: Assets processed and optimized by Vite during the build process (e.g., images, fonts).
  - **`src/components/`**: Reusable UI components (e.g., Navbar, Footer).
  - **`src/pages/`**: Contains React components representing different pages of the app.
    - Examples: `Home.jsx`, `Login.jsx`, `Chat.jsx`, `Profile.jsx`.
  - **`src/styles/`**: Global styles (CSS or SCSS).
  - **`src/App.jsx`**: Defines the main component structure and routing logic of the application.
  - **`src/main.jsx`**: Entry point to the app. Initializes React and renders `App.jsx` into the DOM.

### **Configuration Files**
- **`eslint.config.js`**: Configures ESLint to enforce coding standards, catch potential issues, and apply project-specific rules.
- **`index.html`**: The main HTML file for the app. Provides the structure and serves as the mount point for the React application.
- **`vite.config.js`**: Contains Vite's configuration for build and development. Customize settings like plugins, paths, server options, and build optimizations.

---

## **Detailed File and Folder Structure**
```plaintext
/src
  ├── assets/           // Static assets processed by Vite
  ├── components/       // Reusable UI components
  ├── pages/            // Page-specific components
      ├── Home.jsx      // Home page
      ├── Login.jsx     // Login page
      ├── Signup.jsx    // Signup page
      ├── Chat.jsx      // Chat feature
      ├── Profile.jsx   // User profile page
  ├── App.jsx           // Main component with routing logic
  ├── main.jsx          // React entry point
  ├── styles/           // All styles (CSS/SCSS)
```


## Getting Started
1. Clone the repository:
```bash
git clone <repository-url> 
```
2. Install dependencies:
```bash
npm install
```
3. Start the development server:
```bash
npm run dev
```
4. Build for production:
```bash
npm run build
```