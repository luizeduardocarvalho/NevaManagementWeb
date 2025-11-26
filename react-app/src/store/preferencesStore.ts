import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';
export type DateFormat = 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
export type TimeFormat = '12h' | '24h';

interface NotificationPreferences {
  browser: boolean;
  email: boolean;
  emailOnSampleUpdate: boolean;
  emailOnEquipmentMaintenance: boolean;
  emailOnInvitation: boolean;
  emailOnRoutineAssignment: boolean;
}

interface DisplayPreferences {
  dateFormat: DateFormat;
  timeFormat: TimeFormat;
  showDecimals: number; // Number of decimal places for measurements
}

interface PreferencesState {
  theme: Theme;
  notifications: NotificationPreferences;
  display: DisplayPreferences;

  // Actions
  setTheme: (theme: Theme) => void;
  updateNotifications: (notifications: Partial<NotificationPreferences>) => void;
  updateDisplay: (display: Partial<DisplayPreferences>) => void;
  requestBrowserNotificationPermission: () => Promise<boolean>;
  resetPreferences: () => void;
}

const defaultNotifications: NotificationPreferences = {
  browser: false,
  email: true,
  emailOnSampleUpdate: true,
  emailOnEquipmentMaintenance: true,
  emailOnInvitation: true,
  emailOnRoutineAssignment: true,
};

const defaultDisplay: DisplayPreferences = {
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h',
  showDecimals: 2,
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      notifications: defaultNotifications,
      display: defaultDisplay,

      setTheme: (theme) => {
        set({ theme });
        applyTheme(theme);
      },

      updateNotifications: (notifications) =>
        set((state) => ({
          notifications: { ...state.notifications, ...notifications },
        })),

      updateDisplay: (display) =>
        set((state) => ({
          display: { ...state.display, ...display },
        })),

      requestBrowserNotificationPermission: async () => {
        if (!('Notification' in window)) {
          console.warn('This browser does not support notifications');
          return false;
        }

        if (Notification.permission === 'granted') {
          set((state) => ({
            notifications: { ...state.notifications, browser: true },
          }));
          return true;
        }

        if (Notification.permission !== 'denied') {
          const permission = await Notification.requestPermission();
          const granted = permission === 'granted';

          set((state) => ({
            notifications: { ...state.notifications, browser: granted },
          }));

          return granted;
        }

        return false;
      },

      resetPreferences: () =>
        set({
          theme: 'system',
          notifications: defaultNotifications,
          display: defaultDisplay,
        }),
    }),
    {
      name: 'user-preferences',
      partialize: (state) => ({
        theme: state.theme,
        notifications: state.notifications,
        display: state.display,
      }),
    }
  )
);

// Apply theme to document
function applyTheme(theme: Theme) {
  const root = window.document.documentElement;

  if (theme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
    root.classList.remove('light', 'dark');
    root.classList.add(systemTheme);
  } else {
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }
}

// Initialize theme on store creation
if (typeof window !== 'undefined') {
  const storedPreferences = localStorage.getItem('user-preferences');
  const theme = storedPreferences
    ? (JSON.parse(storedPreferences).state?.theme || 'system')
    : 'system';
  applyTheme(theme);

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const currentTheme = usePreferencesStore.getState().theme;
    if (currentTheme === 'system') {
      applyTheme('system');
    }
  });
}
