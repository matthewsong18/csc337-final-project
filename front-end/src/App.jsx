import './App.css';
import { Router, Routes, Route } from "react-router";

// Import page components
import Home from './pages/Home';
import Login from './pages/Login';
import Chat from './pages/Chat';
import Profile from './pages/Profile';

function App() {

  return (
    <Router>
      <div>
        {/* Add a Navbar or other common components here */}
        <Routes>
          {/* Define routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
