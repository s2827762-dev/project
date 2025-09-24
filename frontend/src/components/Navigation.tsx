import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Navigation: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const navItems = [
    {
      path: '/',
      icon: '🏠',
      label: t('navigation.home'),
      key: 'home'
    },
    {
      path: '/medicines',
      icon: '💊',
      label: t('navigation.medicines'),
      key: 'medicines'
    },
    {
      path: '/records',
      icon: '📋',
      label: t('navigation.records'),
      key: 'records'
    },
    {
      path: '/appointments',
      icon: '📅',
      label: t('navigation.appointments'),
      key: 'appointments'
    },
    {
      path: '/points',
      icon: '⭐',
      label: t('navigation.points'),
      key: 'points'
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="glass mx-4 mb-4 rounded-2xl p-2">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.key}
                to={item.path}
                className="relative flex flex-col items-center p-3 rounded-xl transition-all duration-200"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary-500/20 rounded-xl"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30
                    }}
                  />
                )}
                
                <motion.div
                  className={`text-2xl mb-1 ${
                    isActive ? 'scale-110' : 'scale-100'
                  }`}
                  animate={{
                    scale: isActive ? 1.1 : 1,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25
                  }}
                >
                  {item.icon}
                </motion.div>
                
                <span
                  className={`text-xs font-medium transition-colors duration-200 ${
                    isActive
                      ? 'text-primary-700'
                      : 'text-gray-600'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;