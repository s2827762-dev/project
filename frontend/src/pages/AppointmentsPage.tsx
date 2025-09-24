import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { api, Appointment as APIAppointment } from '../services/api';

interface Appointment {
  id: string;
  doctor: string;
  date: string;
  time: string;
  type: 'in-person' | 'tele-consult';
  status: 'upcoming' | 'completed' | 'cancelled';
  meetLink?: string;
  location?: string;
}

const AppointmentsPage: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  // Load appointments from API
  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const apiAppointments = await api.getAppointments();
        // Transform API data to component format
        const transformedAppointments: Appointment[] = apiAppointments.map(apt => {
          const date = new Date(apt.appointment_date);
          return {
            id: apt.id.toString(),
            doctor: apt.doctor_name,
            date: date.toISOString().split('T')[0],
            time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            type: apt.appointment_type,
            status: apt.status as 'upcoming' | 'completed' | 'cancelled',
            meetLink: apt.meet_link,
            location: apt.clinic_name
          };
        });
        setAppointments(transformedAppointments);
      } catch (error) {
        console.error('Failed to load appointments:', error);
        // Fallback to mock data
        setAppointments(mockAppointments);
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, []);

  // Mock data fallback
  const mockAppointments: Appointment[] = [
    {
      id: '1',
      doctor: 'Dr. Sharma',
      date: '2024-09-25',
      time: '10:00 AM',
      type: 'tele-consult',
      status: 'upcoming',
      meetLink: 'https://meet.google.com/abc-defg-hij'
    },
    {
      id: '2',
      doctor: 'Dr. Patel',
      date: '2024-09-28',
      time: '2:30 PM',
      type: 'in-person',
      status: 'upcoming',
      location: 'City Health Center'
    },
    {
      id: '3',
      doctor: 'Dr. Kumar',
      date: '2024-09-20',
      time: '11:00 AM',
      type: 'tele-consult',
      status: 'completed'
    }
  ];

  const filteredAppointments = appointments.filter(apt => 
    activeTab === 'upcoming' ? apt.status === 'upcoming' : apt.status !== 'upcoming'
  );

  const handleJoinConsultation = (meetLink: string) => {
    window.open(meetLink, '_blank');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
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
          {t('appointments.title')}
        </h1>
        <p className="text-gray-600">
          Manage your healthcare appointments
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="glass rounded-2xl p-2">
          <div className="flex space-x-1">
            {[
              { key: 'upcoming', label: t('appointments.upcoming'), icon: '📅' },
              { key: 'past', label: t('appointments.past'), icon: '📋' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as 'upcoming' | 'past')}
                className={`flex-1 relative py-3 px-4 rounded-xl transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'text-primary-700'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {activeTab === tab.key && (
                  <motion.div
                    layoutId="activeAppointmentTab"
                    className="absolute inset-0 bg-primary-100 rounded-xl"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30
                    }}
                  />
                )}
                <div className="relative flex items-center justify-center space-x-2">
                  <span>{tab.icon}</span>
                  <span className="font-medium">{tab.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.map((appointment, index) => (
          <motion.div
            key={appointment.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {appointment.doctor.split(' ')[1]?.[0] || 'D'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {appointment.doctor}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                      <span className="text-sm text-gray-600">
                        {appointment.type === 'tele-consult' ? t('appointments.teleConsult') : t('appointments.inPerson')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <span>📅</span>
                    <span>{new Date(appointment.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>⏰</span>
                    <span>{appointment.time}</span>
                  </div>
                  {appointment.location && (
                    <div className="flex items-center space-x-2">
                      <span>📍</span>
                      <span>{appointment.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="ml-4 flex flex-col space-y-2">
                {appointment.status === 'upcoming' && appointment.type === 'tele-consult' && appointment.meetLink && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleJoinConsultation(appointment.meetLink!)}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium shadow-lg glow-green"
                  >
                    <div className="flex items-center space-x-2">
                      <span>📞</span>
                      <span className="text-sm">{t('appointments.joinConsultation')}</span>
                    </div>
                  </motion.button>
                )}
                
                {appointment.status === 'upcoming' && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium shadow-lg"
                    >
                      <div className="flex items-center space-x-2">
                        <span>📝</span>
                        <span className="text-sm">{t('appointments.reschedule')}</span>
                      </div>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium shadow-lg"
                    >
                      <div className="flex items-center space-x-2">
                        <span>❌</span>
                        <span className="text-sm">{t('appointments.cancel')}</span>
                      </div>
                    </motion.button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredAppointments.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-2xl p-8 text-center"
        >
          <div className="text-4xl mb-4">📅</div>
          <p className="text-gray-600">
            {t('appointments.noAppointments')}
          </p>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8"
      >
        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium shadow-lg"
            >
              <div className="flex flex-col items-center space-y-2">
                <span className="text-2xl">➕</span>
                <span className="text-sm">Book Appointment</span>
              </div>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white rounded-xl font-medium shadow-lg"
            >
              <div className="flex flex-col items-center space-y-2">
                <span className="text-2xl">🔍</span>
                <span className="text-sm">Find Doctor</span>
              </div>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AppointmentsPage;