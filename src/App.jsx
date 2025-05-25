// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminDashBoard from './pages/AdminDashBoard';
import UserDashboard from './pages/UserDashBoard';
import ManagerDashboard from './pages/ManagerDashboard';
import FinanceDashboard from './pages/FinanceDashboard';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/*" element={<AdminDashBoard />} />
        <Route path="/dashboard/*" element={<UserDashboard />} />
        <Route path="/manager/*" element={<ManagerDashboard />} />
        <Route path="/finance/*" element={<FinanceDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;


