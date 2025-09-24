import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const SettingsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'हिंदी (Hindi)', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ் (Tamil)', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు (Telugu)', flag: '🇮🇳' }
  ];

  const settingsOptions = [
    {
      id: 'notifications',
      title: t('settings.notifications'),
      icon: '🔔',
      type: 'toggle',
      value: true
    },
    {
      id: 'privacy',
      title: t('settings.privacy'),
      icon: '🔒',
      type: 'navigation'
    },
    {
      id: 'help',
      title: t('settings.help'),
      icon: '❓',
      type: 'navigation'
    },
    {
      id: 'about',
      title: t('settings.about'),
      icon: 'ℹ️',
      type: 'navigation'
    }
  ];

  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    i18n.changeLanguage(languageCode);
    localStorage.setItem('language', languageCode);
  };

  return (
    <div className="min-h-screen pb-24 px-4 pt-8">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-gradient mb-2">
          {t('settings.title')}
        </h1>
        <p className="text-gray-600">
          Customize your app experience
        </p>
      </motion.div>

      {/* Language Selection */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
            <span>🌐</span>
            <span>{t('settings.language')}</span>
          </h3>
          <div className="space-y-3">
            {languages.map((language, index) => (
              <motion.button
                key={language.code}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                onClick={() => handleLanguageChange(language.code)}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
                  selectedLanguage === language.code
                    ? 'bg-primary-100 border-2 border-primary-300'
                    : 'bg-white/50 hover:bg-white/70'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{language.flag}</span>
                  <span className="font-medium text-gray-800">
                    {language.name}
                  </span>
                </div>
                {selectedLanguage === language.code && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center"
                  >
                    <span className="text-white text-sm">✓</span>
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Settings Options */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <div className="glass rounded-2xl p-6">
          <div className="space-y-4">
            {settingsOptions.map((option, index) => (
              <motion.div
                key={option.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-center justify-between p-4 bg-white/50 rounded-xl hover:bg-white/70 transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{option.icon}</span>
                  <span className="font-medium text-gray-800">
                    {option.title}
                  </span>
                </div>
                
                {option.type === 'toggle' ? (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className={`w-12 h-6 rounded-full transition-all duration-200 ${
                      option.value ? 'bg-primary-500' : 'bg-gray-300'
                    }`}
                  >
                    <motion.div
                      className="w-5 h-5 bg-white rounded-full shadow-md"
                      animate={{
                        x: option.value ? 26 : 2
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30
                      }}
                    />
                  </motion.button>
                ) : (
                  <span className="text-gray-400">→</span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* App Info */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mb-6"
      >
        <div className="glass rounded-2xl p-6 text-center">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-4xl mb-4"
          >
            🌿
          </motion.div>
          <h3 className="text-lg font-semibold text-gradient mb-2">
            {t('app.name')}
          </h3>
          <p className="text-gray-600 mb-4">
            {t('app.tagline')}
          </p>
          <div className="text-sm text-gray-500">
            Version 1.0.0
          </div>
        </div>
      </motion.div>

      {/* Sync Status */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mb-6"
      >
        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
            <span>🔄</span>
            <span>Sync Status</span>
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">
                {t('offline.lastSync')}: 2 minutes ago
              </p>
              <p className="text-sm text-gray-600">
                All data is up to date
              </p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </motion.div>

      {/* Logout Button */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full p-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl font-medium shadow-lg"
        >
          <div className="flex items-center justify-center space-x-2">
            <span>🚪</span>
            <span>{t('settings.logout')}</span>
          </div>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default SettingsPage;