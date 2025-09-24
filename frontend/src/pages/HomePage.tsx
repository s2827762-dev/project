import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const HomePage: React.FC = () => {
  const { t } = useTranslation();

  const quickActions = [
    {
      title: t('navigation.medicines'),
      icon: '💊',
      path: '/medicines',
      color: 'from-green-400 to-green-600',
      description: t('home.todaysMedicines')
    },
    {
      title: t('navigation.records'),
      icon: '📋',
      path: '/records',
      color: 'from-blue-400 to-blue-600',
      description: 'View health records'
    },
    {
      title: t('navigation.appointments'),
      icon: '📅',
      path: '/appointments',
      color: 'from-purple-400 to-purple-600',
      description: t('home.upcomingAppointments')
    },
    {
      title: t('navigation.points'),
      icon: '⭐',
      path: '/points',
      color: 'from-orange-400 to-orange-600',
      description: t('home.arogyaPoints')
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <div className="min-h-screen pb-24 px-4 pt-8">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8"
      >
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gradient">
                {t('app.name')}
              </h1>
              <p className="text-gray-600 mt-1">
                {t('app.tagline')}
              </p>
            </div>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-4xl"
            >
              🌿
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Welcome Message */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {t('home.welcome')}
        </h2>
        <p className="text-gray-600">
          Ready to take care of your health today?
        </p>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-2 gap-4 mb-8"
      >
        <div className="glass rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">3</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Today's</p>
              <p className="font-semibold text-gray-800">Medicines</p>
            </div>
          </div>
        </div>

        <div className="glass rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">1</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Upcoming</p>
              <p className="font-semibold text-gray-800">Appointment</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {t('home.quickActions')}
        </h3>
        
        {quickActions.map((action, index) => (
          <motion.div
            key={action.path}
            variants={itemVariants}
          >
            <Link to={action.path}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="glass rounded-2xl p-6 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 bg-gradient-to-r ${action.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <span className="text-2xl">{action.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-800 mb-1">
                      {action.title}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {action.description}
                    </p>
                  </div>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-gray-400"
                  >
                    →
                  </motion.div>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Health Tip of the Day */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8"
      >
        <div className="glass rounded-2xl p-6 bg-gradient-to-r from-primary-50/50 to-secondary-50/50">
          <div className="flex items-start space-x-3">
            <div className="text-2xl">💡</div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">
                Health Tip of the Day
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Remember to drink at least 8 glasses of water today to stay hydrated and maintain good health!
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;