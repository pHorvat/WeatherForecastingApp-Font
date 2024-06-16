import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//import Home from './pages/Home';
//import Dashboard from './pages/Dashboard';
import Login from "./components/Auth/Login.jsx";
import Register from "./components/Auth/Register.jsx";
import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import LocationSelect from "./components/Location/LocationSelect.jsx";

function App() {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/location-select" element={<LocationSelect />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
