import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: string;
  completed: boolean;
  progress?: number;
}

const PointsPage: React.FC = () => {
  const { t } = useTranslation();

  // Mock data
  const userPoints = {
    total: 1250,
    thisWeek: 180,
    thisMonth: 720
  };

  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'Medicine Master',
      description: 'Take medicines on time for 7 days straight',
      points: 100,
      icon: '💊',
      completed: true
    },
    {
      id: '2',
      title: 'Health Tracker',
      description: 'Log symptoms for 5 consecutive days',
      points: 75,
      icon: '📊',
      completed: false,
      progress: 60
    },
    {
      id: '3',
      title: 'Appointment Keeper',
      description: 'Attend 3 appointments without missing',
      points: 150,
      icon: '📅',
      completed: true
    },
    {
      id: '4',
      title: 'Wellness Warrior',
      description: 'Complete daily health activities for 30 days',
      points: 300,
      icon: '🏆',
      completed: false,
      progress: 40
    }
  ];

  const leaderboard = [
    { rank: 1, name: 'Rajesh Kumar', points: 2150, avatar: '👨' },
    { rank: 2, name: 'Priya Sharma', points: 1890, avatar: '👩' },
    { rank: 3, name: 'You', points: 1250, avatar: '🌟' },
    { rank: 4, name: 'Amit Patel', points: 1100, avatar: '👨' },
    { rank: 5, name: 'Sunita Devi', points: 950, avatar: '👩' }
  ];

  const recentActivities = [
    { activity: 'Took morning medicines', points: 10, time: '2 hours ago' },
    { activity: 'Logged blood pressure', points: 15, time: '1 day ago' },
    { activity: 'Attended appointment', points: 50, time: '2 days ago' },
    { activity: 'Completed health survey', points: 25, time: '3 days ago' }
  ];

  return (
    <div className="min-h-screen pb-24 px-4 pt-8">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-gradient mb-2">
          {t('points.title')}
        </h1>
        <p className="text-gray-600">
          Earn points for healthy habits
        </p>
      </motion.div>

      {/* Points Summary */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="glass rounded-2xl p-6 bg-gradient-to-r from-primary-50/50 to-secondary-50/50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold text-gradient">
                {userPoints.total}
              </h2>
              <p className="text-gray-600">{t('points.totalPoints')}</p>
            </div>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-4xl"
            >
              ⭐
            </motion.div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-white/50 rounded-xl">
              <div className="text-xl font-bold text-primary-600">
                {userPoints.thisWeek}
              </div>
              <div className="text-sm text-gray-600">{t('points.thisWeek')}</div>
            </div>
            <div className="text-center p-3 bg-white/50 rounded-xl">
              <div className="text-xl font-bold text-secondary-600">
                {userPoints.thisMonth}
              </div>
              <div className="text-sm text-gray-600">{t('points.thisMonth')}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {t('points.achievements')}
        </h3>
        <div className="space-y-3">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`glass rounded-xl p-4 ${
                achievement.completed ? 'bg-green-50/50' : 'bg-white/50'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                  achievement.completed 
                    ? 'bg-green-100 border-2 border-green-300' 
                    : 'bg-gray-100 border-2 border-gray-300'
                }`}>
                  {achievement.icon}
                </div>
                
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">
                    {achievement.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {achievement.description}
                  </p>
                  
                  {!achievement.completed && achievement.progress && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${achievement.progress}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      />
                    </div>
                  )}
                </div>
                
                <div className="text-right">
                  <div className={`text-lg font-bold ${
                    achievement.completed ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    +{achievement.points}
                  </div>
                  {achievement.completed && (
                    <div className="text-green-600 text-sm">✓ Complete</div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Leaderboard */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-6"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {t('points.leaderboard')}
        </h3>
        <div className="glass rounded-2xl p-4">
          {leaderboard.map((user, index) => (
            <motion.div
              key={user.rank}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className={`flex items-center justify-between p-3 rounded-xl mb-2 last:mb-0 ${
                user.name === 'You' 
                  ? 'bg-gradient-to-r from-primary-100/50 to-secondary-100/50 border-2 border-primary-200' 
                  : 'bg-white/30'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  user.rank === 1 ? 'bg-yellow-400 text-yellow-800' :
                  user.rank === 2 ? 'bg-gray-300 text-gray-700' :
                  user.rank === 3 ? 'bg-orange-400 text-orange-800' :
                  'bg-gray-200 text-gray-600'
                }`}>
                  {user.rank}
                </div>
                <div className="text-2xl">{user.avatar}</div>
                <div>
                  <div className={`font-medium ${
                    user.name === 'You' ? 'text-primary-700' : 'text-gray-800'
                  }`}>
                    {user.name}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-800">
                  {user.points}
                </div>
                <div className="text-sm text-gray-600">points</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Activities */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mb-6"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Recent Activities
        </h3>
        <div className="space-y-3">
          {recentActivities.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="glass rounded-xl p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">
                    {activity.activity}
                  </p>
                  <p className="text-sm text-gray-600">
                    {activity.time}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">
                    +{activity.points}
                  </div>
                  <div className="text-sm text-gray-600">points</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default PointsPage;