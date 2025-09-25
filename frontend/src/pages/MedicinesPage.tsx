import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { api, Medicine as APIMedicine } from '../services/api';
import ReminderManager from '../components/ReminderManager';
import { notificationService } from '../services/notifications';

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  instructions: string;
  time: 'morning' | 'afternoon' | 'night';
  taken: boolean;
  image?: string;
}

const MedicinesPage: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'morning' | 'afternoon' | 'night'>('morning');
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReminderManager, setShowReminderManager] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);

  // Load medicines from API
  useEffect(() => {
    const loadMedicines = async () => {
      try {
        const apiMedicines = await api.getMedicines();
        // Transform API data to component format
        const transformedMedicines: Medicine[] = apiMedicines.flatMap(med => {
          const times: Array<'morning' | 'afternoon' | 'night'> = [];
          if (med.morning_time) times.push('morning');
          if (med.afternoon_time) times.push('afternoon');
          if (med.night_time) times.push('night');
          
          return times.map(time => ({
            id: `${med.id}-${time}`,
            name: med.name,
            dosage: med.dosage,
            instructions: med.instructions,
            time,
            taken: false, // This would come from medicine logs in real implementation
            image: '💊'
          }));
        });
        setMedicines(transformedMedicines);
      } catch (error) {
        console.error('Failed to load medicines:', error);
        // Fallback to mock data
        setMedicines(mockMedicines);
      } finally {
        setLoading(false);
      }
    };

    loadMedicines();
  }, []);

  // Listen for medicine reminder events
  useEffect(() => {
    const handleMedicineReminder = (event: CustomEvent) => {
      const { medicineId, frequency, action } = event.detail;
      if (action === 'taken') {
        markMedicineAsTaken(medicineId, frequency);
      }
    };

    window.addEventListener('medicineReminder', handleMedicineReminder as EventListener);
    return () => {
      window.removeEventListener('medicineReminder', handleMedicineReminder as EventListener);
    };
  }, []);

  // Function to open reminder manager
  const openReminderManager = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setShowReminderManager(true);
  };

  // Function to close reminder manager
  const closeReminderManager = () => {
    setShowReminderManager(false);
    setSelectedMedicine(null);
  };

  // Mock data fallback
  const mockMedicines: Medicine[] = [
    {
      id: '1',
      name: 'Paracetamol',
      dosage: '500mg',
      instructions: 'Take after meals',
      time: 'morning',
      taken: false,
      image: '💊'
    },
    {
      id: '2',
      name: 'Vitamin D',
      dosage: '1000 IU',
      instructions: 'Take with water',
      time: 'morning',
      taken: true,
      image: '🟡'
    },
    {
      id: '3',
      name: 'Blood Pressure Medicine',
      dosage: '5mg',
      instructions: 'Take before meals',
      time: 'afternoon',
      taken: false,
      image: '🔴'
    },
    {
      id: '4',
      name: 'Calcium',
      dosage: '600mg',
      instructions: 'Take with milk',
      time: 'night',
      taken: false,
      image: '⚪'
    }
  ];

  const tabs = [
    { key: 'morning', label: t('medicines.morning'), icon: '🌅' },
    { key: 'afternoon', label: t('medicines.afternoon'), icon: '☀️' },
    { key: 'night', label: t('medicines.night'), icon: '🌙' }
  ] as const;

  const filteredMedicines = medicines.filter(med => med.time === activeTab);

  const handleMarkAsTaken = async (medicineId: string) => {
    try {
      // Extract the actual medicine ID from the composite ID
      const actualMedicineId = parseInt(medicineId.split('-')[0]);
      await api.logMedicine(actualMedicineId, 'taken');
      
      // Update local state
      setMedicines(prev => prev.map(med => 
        med.id === medicineId ? { ...med, taken: true } : med
      ));
      
      console.log(`Medicine ${medicineId} marked as taken`);
    } catch (error) {
      console.error('Failed to log medicine:', error);
      // Still update local state for offline functionality
      setMedicines(prev => prev.map(med => 
        med.id === medicineId ? { ...med, taken: true } : med
      ));
    }
  };

  // Helper function for reminder system
  const markMedicineAsTaken = (medicineId: string, frequency: string) => {
    // Find the medicine with matching ID and frequency
    const medicine = medicines.find(med => 
      med.id.includes(medicineId) && med.time === frequency
    );
    
    if (medicine) {
      handleMarkAsTaken(medicine.id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pb-24 px-4 pt-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 px-4 pt-8">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-gradient mb-2">
          {t('medicines.title')}
        </h1>
        <p className="text-gray-600">
          Keep track of your daily medications
        </p>
      </motion.div>

      {/* Time Tabs */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="glass rounded-2xl p-2">
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 relative py-3 px-4 rounded-xl transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'text-primary-700'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {activeTab === tab.key && (
                  <motion.div
                    layoutId="activeTabBg"
                    className="absolute inset-0 bg-primary-100 rounded-xl"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30
                    }}
                  />
                )}
                <div className="relative flex flex-col items-center space-y-1">
                  <span className="text-lg">{tab.icon}</span>
                  <span className="text-sm font-medium">{tab.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Medicines List */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          {filteredMedicines.length > 0 ? (
            filteredMedicines.map((medicine, index) => (
              <motion.div
                key={medicine.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`glass rounded-2xl p-6 ${
                  medicine.taken ? 'bg-green-50/50' : 'bg-white/50'
                }`}
              >
                <div className="flex items-center space-x-4">
                  {/* Medicine Image/Icon */}
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl ${
                    medicine.taken 
                      ? 'bg-green-100 border-2 border-green-300' 
                      : 'bg-gray-100 border-2 border-gray-300'
                  }`}>
                    {medicine.image}
                  </div>

                  {/* Medicine Details */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                      {medicine.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">{t('medicines.dosage')}:</span> {medicine.dosage}
                    </p>
                    <p className="text-sm text-gray-600">
                      {medicine.instructions}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col items-center space-y-2">
                    <div className="flex items-center space-x-2">
                      {/* Reminder Button */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => openReminderManager(medicine)}
                        className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg"
                        title={t('reminders.title')}
                      >
                        <span className="text-white text-sm">🔔</span>
                      </motion.button>

                      {/* Mark as Taken Button */}
                      {medicine.taken ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center"
                        >
                          <span className="text-white text-xl">✓</span>
                        </motion.div>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleMarkAsTaken(medicine.id)}
                          className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-lg glow-green"
                        >
                          <span className="text-white text-xl">+</span>
                        </motion.button>
                      )}
                    </div>
                    
                    <span className={`text-xs font-medium ${
                      medicine.taken ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {medicine.taken ? t('medicines.taken') : t('medicines.markAsTaken')}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass rounded-2xl p-8 text-center"
            >
              <div className="text-4xl mb-4">💊</div>
              <p className="text-gray-600">
                {t('medicines.noMedicines')}
              </p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Progress Summary */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8"
      >
        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Today's Progress
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {medicines.filter(m => m.taken).length}
                </div>
                <div className="text-sm text-gray-600">{t('medicines.taken')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {medicines.filter(m => !m.taken).length}
                </div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-1">Adherence Rate</div>
              <div className="text-xl font-bold text-primary-600">
                {Math.round((medicines.filter(m => m.taken).length / medicines.length) * 100)}%
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Reminder Manager Modal */}
      <AnimatePresence>
        {showReminderManager && selectedMedicine && (
          <ReminderManager
            medicineId={selectedMedicine.id}
            medicineName={selectedMedicine.name}
            dosage={selectedMedicine.dosage}
            onClose={closeReminderManager}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MedicinesPage;