import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThreatProvider } from './context/ThreatContext';

// Import Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import UserLayout from './layouts/UserLayout';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import ThreatAlerts from './pages/admin/ThreatAlerts';
import UserMonitoring from './pages/admin/UserMonitoring';
import Analytics from './pages/admin/Analytics';
import DetectionLogic from './pages/admin/DetectionLogic';

// User Pages
import UserDashboard from './pages/user/Dashboard';

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-brand-background text-brand-primary">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (requireAdmin && user.role !== 'admin') return <Navigate to="/user/dashboard" replace />;
  
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThreatProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/landing" element={<Navigate to="/" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="alerts" element={<ThreatAlerts />} />
              <Route path="users" element={<UserMonitoring />} />
              <Route path="logic" element={<DetectionLogic />} />
              <Route path="analytics" element={<Analytics />} />
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
            </Route>

            {/* User Routes */}
            <Route 
              path="/user" 
              element={
                <ProtectedRoute requireAdmin={false}>
                  <UserLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<UserDashboard />} />
              <Route index element={<Navigate to="/user/dashboard" replace />} />
            </Route>

            {/* Catch All */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ThreatProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
