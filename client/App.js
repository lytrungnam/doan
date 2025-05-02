import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@material-ui/core';

// Layouts
import MainLayout from './components/layouts/MainLayout';
import AuthLayout from './components/layouts/AuthLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Main Pages
import Dashboard from './pages/dashboard/Dashboard';
import AnalyzeImage from './pages/analyze/AnalyzeImage';
import AnalyzeVideo from './pages/analyze/AnalyzeVideo';
import History from './pages/history/History';
import ReportDetail from './pages/reports/ReportDetail';
import Settings from './pages/settings/Settings';

// Utility Components
import PrivateRoute from './components/routing/PrivateRoute';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <Box>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<AuthLayout />}>
          <Route index element={<Navigate to="/login" replace />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* Main Application Routes */}
        <Route
          path="/app"
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="analyze">
            <Route path="image" element={<AnalyzeImage />} />
            <Route path="video" element={<AnalyzeVideo />} />
          </Route>
          <Route path="history" element={<History />} />
          <Route path="reports/:id" element={<ReportDetail />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Box>
  );
};

export default App;