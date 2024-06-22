import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//import Home from './pages/Home';
//import Dashboard from './pages/Dashboard';
import Login from "./components/Auth/Login.jsx";
import Register from "./components/Auth/Register.jsx";
import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import LocationSelect from "./components/Location/LocationSelect.jsx";
import 'react-toastify/dist/ReactToastify.css';
import Header from "./components/Header.jsx";
import {AuthProvider} from "./components/Auth/AuthContext.jsx";
import Profile from "./pages/Profile.jsx";

function App() {
    return (
        <AuthProvider>
        <Router>
            <div>
                <Header/>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/location-select" element={<LocationSelect />} />
                    <Route path="/profile" element={<Profile />} /> {/* Add route for Profile */}
                </Routes>
            </div>
        </Router>
        </AuthProvider>
    );
}

export default App;
