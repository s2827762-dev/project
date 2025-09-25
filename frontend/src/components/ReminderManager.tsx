import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { notificationService, ReminderNotification } from '../services/notifications';

interface ReminderManagerProps {
  medicineId: string;
  medicineName: string;
  dosage: string;
  onClose: () => void;
}

const ReminderManager: React.FC<ReminderManagerProps> = ({
  medicineId,
  medicineName,
  dosage,
  onClose
}) => {
  const { t } = useTranslation();
  const [reminders, setReminders] = useState<ReminderNotification[]>([]);
  const [permissionStatus, setPermissionStatus] = useState(notificationService.getPermissionStatus());
  const [showAddForm, setShowAddForm] = useState(false);
  const [newReminder, setNewReminder] = useState({
    time: '09:00',
    frequency: 'morning' as 'morning' | 'afternoon' | 'night',
    sound: true,
    snoozeMinutes: 10
  });

  useEffect(() => {
    loadReminders();
  }, [medicineId]);

  const loadReminders = () => {
    const medicineReminders = notificationService.getMedicineReminders(medicineId);
    setReminders(medicineReminders);
  };

  const requestPermission = async () => {
    const permission = await notificationService.requestPermission();
    setPermissionStatus(permission);
  };

  const addReminder = () => {
    const reminder: ReminderNotification = {
      id: `${medicineId}_${newReminder.frequency}_${Date.now()}`,
      medicineId,
      medicineName,
      dosage,
      time: newReminder.time,
      frequency: newReminder.frequency,
      enabled: true,
      sound: newReminder.sound,
      snoozeMinutes: newReminder.snoozeMinutes
    };

    notificationService.setReminder(reminder);
    loadReminders();
    setShowAddForm(false);
  };

  const toggleReminder = (reminderId: string) => {
    const reminder = reminders.find(r => r.id === reminderId);
    if (reminder) {
      reminder.enabled = !reminder.enabled;
      notificationService.setReminder(reminder);
      loadReminders();
    }
  };

  const deleteReminder = (reminderId: string) => {
    notificationService.removeReminder(reminderId);
    loadReminders();
  };

  const getFrequencyIcon = (frequency: string) => {
    switch (frequency) {
      case 'morning': return '🌅';
      case 'afternoon': return '☀️';
      case 'night': return '🌙';
      default: return '💊';
    }
  };

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'morning': return t('medicines.morning');
      case 'afternoon': return t('medicines.afternoon');
      case 'night': return t('medicines.night');
      default: return frequency;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gradient">
              🔔 {t('reminders.title')}
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {medicineName} ({dosage})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Permission Status */}
        {!permissionStatus.granted && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-orange-500/20 border border-orange-500/30 rounded-xl p-4 mb-4"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div className="flex-1">
                <p className="font-medium text-orange-200">
                  {t('reminders.permissionRequired')}
                </p>
                <p className="text-sm text-orange-300 mt-1">
                  {t('reminders.permissionDescription')}
                </p>
              </div>
            </div>
            <button
              onClick={requestPermission}
              className="w-full mt-3 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition-colors"
            >
              {t('reminders.enableNotifications')}
            </button>
          </motion.div>
        )}

        {/* Existing Reminders */}
        <div className="space-y-3 mb-6">
          <h3 className="font-semibold text-gray-200">
            {t('reminders.activeReminders')} ({reminders.length})
          </h3>
          
          <AnimatePresence>
            {reminders.map((reminder) => (
              <motion.div
                key={reminder.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`glass rounded-xl p-4 ${
                  reminder.enabled ? 'border-green-500/30' : 'border-gray-500/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {getFrequencyIcon(reminder.frequency)}
                    </span>
                    <div>
                      <p className="font-medium">
                        {reminder.time} - {getFrequencyLabel(reminder.frequency)}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        {reminder.sound && <span>🔊</span>}
                        {reminder.snoozeMinutes && (
                          <span>⏰ {reminder.snoozeMinutes}min</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleReminder(reminder.id)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        reminder.enabled 
                          ? 'bg-green-500' 
                          : 'bg-gray-600'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          reminder.enabled ? 'translate-x-6' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                    
                    <button
                      onClick={() => deleteReminder(reminder.id)}
                      className="p-2 text-red-400 hover:text-red-300 transition-colors"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {reminders.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <span className="text-4xl mb-2 block">🔕</span>
              <p>{t('reminders.noReminders')}</p>
            </div>
          )}
        </div>

        {/* Add New Reminder */}
        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-4 rounded-xl transition-all duration-300 font-medium"
          >
            ➕ {t('reminders.addReminder')}
          </button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl p-4 space-y-4"
          >
            <h4 className="font-semibold text-gray-200">
              {t('reminders.newReminder')}
            </h4>

            {/* Time Input */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                {t('reminders.time')}
              </label>
              <input
                type="time"
                value={newReminder.time}
                onChange={(e) => setNewReminder({
                  ...newReminder,
                  time: e.target.value
                })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
              />
            </div>

            {/* Frequency Selection */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                {t('reminders.frequency')}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['morning', 'afternoon', 'night'].map((freq) => (
                  <button
                    key={freq}
                    onClick={() => setNewReminder({
                      ...newReminder,
                      frequency: freq as any
                    })}
                    className={`p-3 rounded-lg transition-colors ${
                      newReminder.frequency === freq
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    <div className="text-lg mb-1">
                      {getFrequencyIcon(freq)}
                    </div>
                    <div className="text-xs">
                      {getFrequencyLabel(freq)}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Options */}
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={newReminder.sound}
                  onChange={(e) => setNewReminder({
                    ...newReminder,
                    sound: e.target.checked
                  })}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm text-gray-300">
                  🔊 {t('reminders.playSound')}
                </span>
              </label>

              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  ⏰ {t('reminders.snoozeMinutes')}
                </label>
                <select
                  value={newReminder.snoozeMinutes}
                  onChange={(e) => setNewReminder({
                    ...newReminder,
                    snoozeMinutes: parseInt(e.target.value)
                  })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                >
                  <option value={5}>5 {t('common.minutes')}</option>
                  <option value={10}>10 {t('common.minutes')}</option>
                  <option value={15}>15 {t('common.minutes')}</option>
                  <option value={30}>30 {t('common.minutes')}</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={addReminder}
                disabled={!permissionStatus.granted}
                className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg transition-colors"
              >
                {t('common.add')}
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ReminderManager;