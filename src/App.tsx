import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import LandingPage from './pages/LandingPage';
import CalendarPage from './pages/CalendarPage';
import PrivateRoute from './utils/PrivateRoute';

const RedirectIfAuthenticated: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const accessToken = localStorage.getItem('access_token');
    return accessToken && accessToken !== 'null' ? <Navigate to="/calendar" /> : <>{children}</>;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        <RedirectIfAuthenticated>
                            <LandingPage />
                        </RedirectIfAuthenticated>
                    }
                />
                <Route path="/calendar" element={<PrivateRoute element={<CalendarPage />} />} />
            </Routes>
        </Router>
    );
}

export default App;
