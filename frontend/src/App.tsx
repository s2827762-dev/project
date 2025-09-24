import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

// Import pages
import HomePage from './pages/HomePage';
import MedicinesPage from './pages/MedicinesPage';
import RecordsPage from './pages/RecordsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import PointsPage from './pages/PointsPage';
import SettingsPage from './pages/SettingsPage';

// Import components
import Navigation from './components/Navigation';
import OfflineIndicator from './components/OfflineIndicator';

function App() {
  const { t } = useTranslation();

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        {/* Background decorative elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-200/30 to-secondary-200/30 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-accent-200/30 to-primary-200/30 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>

        {/* Offline indicator */}
        <OfflineIndicator />

        {/* Main content */}
        <div className="relative z-10">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/medicines" element={<MedicinesPage />} />
            <Route path="/records" element={<RecordsPage />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/points" element={<PointsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>

        {/* Bottom navigation */}
        <Navigation />
      </div>
    </Router>
  );
}

export default App;