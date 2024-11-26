import './App.css';
import { BrowserRouter, Routes, Route } from "react-router";

// Import page components
import Home from './pages/Home';
import Login from './pages/Login';
import Chat from './pages/Chat';
import Profile from './pages/Profile';

function App() {

  return (
    <BrowserRouter>
        <div>
          {/* Add a Navbar or other common components here */}
          <h3>This is common components across pages</h3>
          <Routes>
            {/* Define routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
    </BrowserRouter>
    
  )
}

export default App
