// Medicine Reminder Notification Service
export interface ReminderNotification {
  id: string;
  medicineId: string;
  medicineName: string;
  dosage: string;
  time: string;
  frequency: 'morning' | 'afternoon' | 'night';
  enabled: boolean;
  sound: boolean;
  snoozeMinutes?: number;
}

export interface NotificationPermission {
  granted: boolean;
  denied: boolean;
  default: boolean;
}

class NotificationService {
  private reminders: Map<string, ReminderNotification> = new Map();
  private activeTimeouts: Map<string, NodeJS.Timeout> = new Map();
  private audioContext: AudioContext | null = null;
  private alarmSound: HTMLAudioElement | null = null;

  constructor() {
    this.initializeAudio();
    this.loadReminders();
  }

  // Initialize audio for alarm sounds
  private initializeAudio() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.alarmSound = new Audio();
      // Create a simple beep sound using Web Audio API
      this.createAlarmTone();
    } catch (error) {
      console.warn('Audio context not supported:', error);
    }
  }

  // Create alarm tone using Web Audio API
  private createAlarmTone() {
    if (!this.audioContext) return;

    const canvas = document.createElement('canvas');
    const canvasCtx = canvas.getContext('2d');
    
    // Create a data URL for alarm sound
    const sampleRate = 44100;
    const duration = 1; // 1 second
    const samples = sampleRate * duration;
    const buffer = new ArrayBuffer(samples * 2);
    const view = new DataView(buffer);

    for (let i = 0; i < samples; i++) {
      const t = i / sampleRate;
      const frequency = 800; // 800Hz tone
      const sample = Math.sin(2 * Math.PI * frequency * t) * 0.3;
      const intSample = Math.max(-32767, Math.min(32767, sample * 32767));
      view.setInt16(i * 2, intSample, true);
    }

    const blob = new Blob([buffer], { type: 'audio/wav' });
    const audioUrl = URL.createObjectURL(blob);
    
    if (this.alarmSound) {
      this.alarmSound.src = audioUrl;
      this.alarmSound.loop = false;
      this.alarmSound.volume = 0.7;
    }
  }

  // Request notification permission
  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      return { granted: false, denied: true, default: false };
    }

    const permission = await Notification.requestPermission();
    
    return {
      granted: permission === 'granted',
      denied: permission === 'denied',
      default: permission === 'default'
    };
  }

  // Check current permission status
  getPermissionStatus(): NotificationPermission {
    if (!('Notification' in window)) {
      return { granted: false, denied: true, default: false };
    }

    const permission = Notification.permission;
    return {
      granted: permission === 'granted',
      denied: permission === 'denied',
      default: permission === 'default'
    };
  }

  // Add or update a reminder
  setReminder(reminder: ReminderNotification): void {
    this.reminders.set(reminder.id, reminder);
    this.saveReminders();
    
    if (reminder.enabled) {
      this.scheduleReminder(reminder);
    }
  }

  // Remove a reminder
  removeReminder(reminderId: string): void {
    this.reminders.delete(reminderId);
    this.clearReminderTimeout(reminderId);
    this.saveReminders();
  }

  // Get all reminders
  getReminders(): ReminderNotification[] {
    return Array.from(this.reminders.values());
  }

  // Get reminders for a specific medicine
  getMedicineReminders(medicineId: string): ReminderNotification[] {
    return this.getReminders().filter(r => r.medicineId === medicineId);
  }

  // Schedule a reminder
  private scheduleReminder(reminder: ReminderNotification): void {
    this.clearReminderTimeout(reminder.id);

    const now = new Date();
    const [hours, minutes] = reminder.time.split(':').map(Number);
    
    const reminderTime = new Date();
    reminderTime.setHours(hours, minutes, 0, 0);

    // If the time has passed today, schedule for tomorrow
    if (reminderTime <= now) {
      reminderTime.setDate(reminderTime.getDate() + 1);
    }

    const timeUntilReminder = reminderTime.getTime() - now.getTime();

    const timeout = setTimeout(() => {
      this.triggerReminder(reminder);
      // Reschedule for next day
      this.scheduleReminder(reminder);
    }, timeUntilReminder);

    this.activeTimeouts.set(reminder.id, timeout);
  }

  // Trigger a reminder notification
  private async triggerReminder(reminder: ReminderNotification): Promise<void> {
    const permission = this.getPermissionStatus();
    
    if (!permission.granted) {
      console.warn('Notification permission not granted');
      return;
    }

    // Play alarm sound if enabled
    if (reminder.sound && this.alarmSound) {
      try {
        await this.alarmSound.play();
      } catch (error) {
        console.warn('Could not play alarm sound:', error);
      }
    }

    // Show browser notification
    const notification = new Notification(`💊 Medicine Reminder`, {
      body: `Time to take ${reminder.medicineName} (${reminder.dosage})`,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: reminder.id,
      requireInteraction: true,
      actions: [
        { action: 'taken', title: '✅ Taken' },
        { action: 'snooze', title: '⏰ Snooze 10min' }
      ]
    });

    // Handle notification clicks
    notification.onclick = () => {
      window.focus();
      notification.close();
      // Navigate to medicines page
      window.location.hash = '/medicines';
    };

    // Handle notification actions (if supported)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.action === 'taken') {
          this.markMedicineAsTaken(reminder.medicineId, reminder.frequency);
          notification.close();
        } else if (event.data.action === 'snooze') {
          this.snoozeReminder(reminder);
          notification.close();
        }
      });
    }

    // Auto-close after 30 seconds
    setTimeout(() => {
      notification.close();
    }, 30000);
  }

  // Snooze a reminder
  private snoozeReminder(reminder: ReminderNotification): void {
    const snoozeMinutes = reminder.snoozeMinutes || 10;
    const snoozeTime = new Date();
    snoozeTime.setMinutes(snoozeTime.getMinutes() + snoozeMinutes);

    const snoozeTimeout = setTimeout(() => {
      this.triggerReminder(reminder);
    }, snoozeMinutes * 60 * 1000);

    this.activeTimeouts.set(`${reminder.id}_snooze`, snoozeTimeout);
  }

  // Mark medicine as taken (integrate with existing medicine tracker)
  private markMedicineAsTaken(medicineId: string, frequency: string): void {
    // This will integrate with the existing medicine tracking system
    const event = new CustomEvent('medicineReminder', {
      detail: { medicineId, frequency, action: 'taken' }
    });
    window.dispatchEvent(event);
  }

  // Clear reminder timeout
  private clearReminderTimeout(reminderId: string): void {
    const timeout = this.activeTimeouts.get(reminderId);
    if (timeout) {
      clearTimeout(timeout);
      this.activeTimeouts.delete(reminderId);
    }

    // Also clear snooze timeout
    const snoozeTimeout = this.activeTimeouts.get(`${reminderId}_snooze`);
    if (snoozeTimeout) {
      clearTimeout(snoozeTimeout);
      this.activeTimeouts.delete(`${reminderId}_snooze`);
    }
  }

  // Save reminders to localStorage
  private saveReminders(): void {
    const remindersArray = Array.from(this.reminders.values());
    localStorage.setItem('healthaxis_reminders', JSON.stringify(remindersArray));
  }

  // Load reminders from localStorage
  private loadReminders(): void {
    try {
      const saved = localStorage.getItem('healthaxis_reminders');
      if (saved) {
        const remindersArray: ReminderNotification[] = JSON.parse(saved);
        remindersArray.forEach(reminder => {
          this.reminders.set(reminder.id, reminder);
          if (reminder.enabled) {
            this.scheduleReminder(reminder);
          }
        });
      }
    } catch (error) {
      console.error('Error loading reminders:', error);
    }
  }

  // Enable/disable all reminders
  setRemindersEnabled(enabled: boolean): void {
    this.reminders.forEach(reminder => {
      reminder.enabled = enabled;
      if (enabled) {
        this.scheduleReminder(reminder);
      } else {
        this.clearReminderTimeout(reminder.id);
      }
    });
    this.saveReminders();
  }

  // Get next reminder time
  getNextReminderTime(): Date | null {
    const enabledReminders = this.getReminders().filter(r => r.enabled);
    if (enabledReminders.length === 0) return null;

    const now = new Date();
    let nextTime: Date | null = null;

    enabledReminders.forEach(reminder => {
      const [hours, minutes] = reminder.time.split(':').map(Number);
      const reminderTime = new Date();
      reminderTime.setHours(hours, minutes, 0, 0);

      if (reminderTime <= now) {
        reminderTime.setDate(reminderTime.getDate() + 1);
      }

      if (!nextTime || reminderTime < nextTime) {
        nextTime = reminderTime;
      }
    });

    return nextTime;
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
export default notificationService;