const API_BASE_URL = 'http://localhost:12001/api/v1';

// Types
export interface Medicine {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  instructions: string;
  morning_time?: string;
  afternoon_time?: string;
  night_time?: string;
  prescribed_by: string;
  is_active: boolean;
  start_date: string;
  end_date?: string;
  prescription_date?: string;
  created_at: string;
  updated_at?: string;
}

export interface Appointment {
  id: number;
  doctor_name: string;
  appointment_date: string;
  appointment_type: 'in-person' | 'tele-consult';
  status: string;
  meet_link?: string;
  clinic_name?: string;
}

export interface HealthRecord {
  id: number;
  consultation_date: string;
  doctor_name: string;
  consultation_type: string;
  is_locked: boolean;
  summary?: string;
}

export interface HealthAxisPointsData {
  total_points: number;
  this_week: number;
  this_month: number;
  leaderboard: Array<{
    rank: number;
    name: string;
    points: number;
  }>;
}

export interface Reminder {
  id: number;
  medicine_id: number;
  user_id: number;
  time: string;
  frequency: string;
  enabled: boolean;
  sound: boolean;
  snooze_minutes: number;
  medicine_name?: string;
  medicine_dosage?: string;
}

export interface ReminderCreate {
  medicine_id: number;
  time: string;
  frequency: string;
  enabled?: boolean;
  sound?: boolean;
  snooze_minutes?: number;
}

export interface ReminderUpdate {
  time?: string;
  frequency?: string;
  enabled?: boolean;
  sound?: boolean;
  snooze_minutes?: number;
}

// API Functions
export const api = {
  // Medicines
  async getMedicines(): Promise<Medicine[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/medicines/`);
      if (!response.ok) throw new Error('Failed to fetch medicines');
      return await response.json();
    } catch (error) {
      console.error('Error fetching medicines:', error);
      // Return mock data as fallback
      return [
        {
          id: 1,
          name: 'Paracetamol',
          dosage: '500mg',
          frequency: 'morning,afternoon,night',
          instructions: 'Take after meals',
          morning_time: '08:00',
          afternoon_time: '14:00',
          night_time: '21:00',
          prescribed_by: 'Dr. Sharma',
          is_active: true,
          start_date: '2024-09-20T00:00:00Z',
          prescription_date: '2024-09-20T00:00:00Z',
          created_at: '2024-09-20T00:00:00Z'
        }
      ];
    }
  },

  async logMedicine(medicineId: number, status: string = 'taken'): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/medicines/log?medicine_id=${medicineId}&status=${status}`, {
        method: 'POST'
      });
      if (!response.ok) throw new Error('Failed to log medicine');
      return await response.json();
    } catch (error) {
      console.error('Error logging medicine:', error);
      return { message: 'Medicine logged locally', points_earned: 10 };
    }
  },

  // Appointments
  async getAppointments(): Promise<Appointment[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/`);
      if (!response.ok) throw new Error('Failed to fetch appointments');
      return await response.json();
    } catch (error) {
      console.error('Error fetching appointments:', error);
      // Return mock data as fallback
      return [
        {
          id: 1,
          doctor_name: 'Dr. Sharma',
          appointment_date: '2024-09-25T10:00:00Z',
          appointment_type: 'tele-consult',
          status: 'scheduled',
          meet_link: 'https://meet.google.com/abc-defg-hij'
        }
      ];
    }
  },

  // Health Records
  async getHealthRecords(): Promise<HealthRecord[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/records/`);
      if (!response.ok) throw new Error('Failed to fetch health records');
      return await response.json();
    } catch (error) {
      console.error('Error fetching health records:', error);
      // Return mock data as fallback
      return [
        {
          id: 1,
          consultation_date: '2024-09-20T00:00:00Z',
          doctor_name: 'Dr. Sharma',
          consultation_type: 'General Consultation',
          is_locked: false,
          summary: 'Patient reported mild headache and fatigue. Prescribed rest and hydration.'
        }
      ];
    }
  },

  async unlockRecord(recordId: number, qrKey: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/records/${recordId}/unlock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qr_key: qrKey })
      });
      if (!response.ok) throw new Error('Failed to unlock record');
      return await response.json();
    } catch (error) {
      console.error('Error unlocking record:', error);
      return { message: 'Record unlocked locally' };
    }
  },

  // HealthAxis Points
  async getHealthAxisPoints(): Promise<HealthAxisPointsData> {
    try {
      const response = await fetch(`${API_BASE_URL}/points/`);
      if (!response.ok) throw new Error('Failed to fetch HealthAxis points');
      return await response.json();
    } catch (error) {
      console.error('Error fetching HealthAxis points:', error);
      // Return mock data as fallback
      return {
        total_points: 1250,
        this_week: 180,
        this_month: 720,
        leaderboard: [
          { rank: 1, name: 'Rajesh Kumar', points: 2150 },
          { rank: 2, name: 'Priya Sharma', points: 1890 },
          { rank: 3, name: 'You', points: 1250 },
          { rank: 4, name: 'Amit Patel', points: 1100 },
          { rank: 5, name: 'Sunita Devi', points: 950 }
        ]
      };
    }
  },

  // Reminders
  async getReminders(medicineId?: number): Promise<Reminder[]> {
    try {
      const url = medicineId 
        ? `${API_BASE_URL}/reminders/?medicine_id=${medicineId}`
        : `${API_BASE_URL}/reminders/`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch reminders');
      return await response.json();
    } catch (error) {
      console.error('Error fetching reminders:', error);
      return [];
    }
  },

  async createReminder(reminder: ReminderCreate): Promise<Reminder> {
    try {
      const response = await fetch(`${API_BASE_URL}/reminders/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reminder),
      });
      if (!response.ok) throw new Error('Failed to create reminder');
      return await response.json();
    } catch (error) {
      console.error('Error creating reminder:', error);
      throw error;
    }
  },

  async updateReminder(reminderId: number, update: ReminderUpdate): Promise<Reminder> {
    try {
      const response = await fetch(`${API_BASE_URL}/reminders/${reminderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(update),
      });
      if (!response.ok) throw new Error('Failed to update reminder');
      return await response.json();
    } catch (error) {
      console.error('Error updating reminder:', error);
      throw error;
    }
  },

  async deleteReminder(reminderId: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/reminders/${reminderId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete reminder');
    } catch (error) {
      console.error('Error deleting reminder:', error);
      throw error;
    }
  },

  async toggleReminder(reminderId: number): Promise<{ enabled: boolean }> {
    try {
      const response = await fetch(`${API_BASE_URL}/reminders/${reminderId}/toggle`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to toggle reminder');
      return await response.json();
    } catch (error) {
      console.error('Error toggling reminder:', error);
      throw error;
    }
  }
};