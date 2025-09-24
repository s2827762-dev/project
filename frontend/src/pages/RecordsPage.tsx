import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface HealthRecord {
  id: string;
  date: string;
  doctor: string;
  type: string;
  locked: boolean;
  summary?: string;
  audioUrl?: string;
  transcript?: string;
}

const RecordsPage: React.FC = () => {
  const { t } = useTranslation();
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null);

  // Mock data
  const records: HealthRecord[] = [
    {
      id: '1',
      date: '2024-09-20',
      doctor: 'Dr. Sharma',
      type: 'General Consultation',
      locked: false,
      summary: 'Patient reported mild headache and fatigue. Prescribed rest and hydration.',
      audioUrl: '/audio/consultation-1.mp3',
      transcript: 'Doctor: How are you feeling today? Patient: I have been having mild headaches...'
    },
    {
      id: '2',
      date: '2024-09-15',
      doctor: 'Dr. Patel',
      type: 'Follow-up',
      locked: true
    },
    {
      id: '3',
      date: '2024-09-10',
      doctor: 'Dr. Kumar',
      type: 'Blood Test Results',
      locked: true
    }
  ];

  const handleUnlockRecord = (recordId: string) => {
    // In real app, this would scan QR code and unlock
    console.log(`Unlocking record ${recordId}`);
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
          {t('records.title')}
        </h1>
        <p className="text-gray-600">
          Your secure health records
        </p>
      </motion.div>

      {/* Records List */}
      <div className="space-y-4">
        {records.map((record, index) => (
          <motion.div
            key={record.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {record.type}
                  </h3>
                  {record.locked && (
                    <div className="flex items-center space-x-1 text-amber-600">
                      <span className="text-lg">🔒</span>
                      <span className="text-sm font-medium">
                        {t('records.locked')}
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">{t('records.doctor')}:</span> {record.doctor}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">{t('records.date')}:</span> {new Date(record.date).toLocaleDateString()}
                </p>
                
                {!record.locked && record.summary && (
                  <div className="mt-4 p-4 bg-blue-50/50 rounded-xl">
                    <h4 className="font-medium text-blue-800 mb-2">
                      {t('records.aiSummary')}
                    </h4>
                    <p className="text-sm text-blue-700">
                      {record.summary}
                    </p>
                  </div>
                )}
              </div>

              <div className="ml-4">
                {record.locked ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleUnlockRecord(record.id)}
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-medium shadow-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <span>📱</span>
                      <span className="text-sm">Scan QR</span>
                    </div>
                  </motion.button>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium shadow-lg"
                    >
                      <div className="flex items-center space-x-2">
                        <span>🎵</span>
                        <span className="text-sm">{t('records.playAudio')}</span>
                      </div>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium shadow-lg"
                    >
                      <div className="flex items-center space-x-2">
                        <span>📄</span>
                        <span className="text-sm">{t('records.fullTranscript')}</span>
                      </div>
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {records.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-2xl p-8 text-center"
        >
          <div className="text-4xl mb-4">📋</div>
          <p className="text-gray-600">
            {t('records.noRecords')}
          </p>
        </motion.div>
      )}

      {/* Digital Safe Info */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8"
      >
        <div className="glass rounded-2xl p-6 bg-gradient-to-r from-purple-50/50 to-blue-50/50">
          <div className="flex items-start space-x-3">
            <div className="text-2xl">🔐</div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">
                Digital Safe
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Your health records are encrypted and secure. Use the QR code from your doctor to unlock and view consultation details.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RecordsPage;