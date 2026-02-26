import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { CollegeDashboard } from './pages/CollegeDashboard';
import { RecruiterDashboard } from './pages/RecruiterDashboard';
import { DashboardLayout } from './layouts/DashboardLayout';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Student Routes */}
        <Route path="/student" element={
          <DashboardLayout>
            <StudentDashboard />
          </DashboardLayout>
        } />
        <Route path="/student/:tab" element={
          <DashboardLayout>
            <StudentDashboard />
          </DashboardLayout>
        } />

        {/* College Routes */}
        <Route path="/college" element={
          <DashboardLayout>
            <CollegeDashboard />
          </DashboardLayout>
        } />

        {/* Recruiter Routes */}
        <Route path="/recruiter" element={
          <DashboardLayout>
            <RecruiterDashboard />
          </DashboardLayout>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
