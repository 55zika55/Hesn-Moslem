import { SettingsState, AzkarDayProgress } from '../types';

export const DEFAULT_SETTINGS: SettingsState = {
  location: {
    country: 'مصر',
    city: 'القاهرة',
    latitude: 30.0444,
    longitude: 31.2357,
    isAuto: false
  },
  calculationMethod: 'Egypt',
  asrMadhhab: 'Standard',
  timeFormat: '12h',
  minuteAdjustments: {
    fajr: 0,
    sunrise: 0,
    dhuhr: 0,
    asr: 0,
    maghrib: 0,
    isha: 0
  },
  hijriOffset: 0,
  notifications: {
    enabled: true,
    fajr: true,
    sunrise: true,
    dhuhr: true,
    asr: true,
    maghrib: true,
    isha: true,
    morningAzkar: true,
    morningTime: '06:30',
    eveningAzkar: true,
    eveningTime: '17:00',
    subhanAllahPrePrayer: true,
    prePrayerMinutes: 15
  },
  sound: {
    enabled: true,
    volume: 0.8,
    adhanSoundType: 'takbeer_file'
  },
  appearance: {
    theme: 'dark',
    fontSizeOffset: 0
  },
  azkarDisplay: {
    showSource: true,
    showTargetCount: true,
    autoAdvance: false,
    vibrateOnCount: true,
    soundOnCount: true
  },
  qiblaDisplay: {
    showDegrees: true,
    showDistance: true
  },
  language: 'ar'
};

const SETTINGS_KEY = 'hisn_muslim_settings_v1';
const PROGRESS_KEY = 'hisn_muslim_progress_v1';

export function getTodayKey(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function loadSettings(): SettingsState {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      localStorage.setItem('hisn_muslim_dark_mode_applied_v1', 'true');
      return DEFAULT_SETTINGS;
    }
    const parsed = JSON.parse(raw);
    
    // Ensure dark mode is active by default as requested
    const hasAppliedDarkDefault = localStorage.getItem('hisn_muslim_dark_mode_applied_v1');
    let themeToUse = parsed.appearance?.theme || 'dark';
    if (!hasAppliedDarkDefault) {
      themeToUse = 'dark';
      localStorage.setItem('hisn_muslim_dark_mode_applied_v1', 'true');
    }

    const loadedSettings: SettingsState = {
      ...DEFAULT_SETTINGS,
      ...parsed,
      location: { ...DEFAULT_SETTINGS.location, ...(parsed.location || {}) },
      minuteAdjustments: { ...DEFAULT_SETTINGS.minuteAdjustments, ...(parsed.minuteAdjustments || {}) },
      notifications: { ...DEFAULT_SETTINGS.notifications, ...(parsed.notifications || {}) },
      sound: { ...DEFAULT_SETTINGS.sound, ...(parsed.sound || {}) },
      appearance: {
        ...DEFAULT_SETTINGS.appearance,
        ...(parsed.appearance || {}),
        theme: themeToUse
      },
      azkarDisplay: { ...DEFAULT_SETTINGS.azkarDisplay, ...(parsed.azkarDisplay || {}) },
      qiblaDisplay: { ...DEFAULT_SETTINGS.qiblaDisplay, ...(parsed.qiblaDisplay || {}) },
      language: parsed.language === 'en' ? 'en' : 'ar'
    };
    saveSettings(loadedSettings);
    return loadedSettings;
  } catch (e) {
    console.warn('Failed to load settings from storage:', e);
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: SettingsState): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save settings:', e);
  }
}

export function loadDayProgress(): AzkarDayProgress {
  const today = getTodayKey();
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) {
      return {
        dateKey: today,
        morningCounts: {},
        eveningCounts: {},
        favorites: []
      };
    }
    const parsed = JSON.parse(raw);
    // If progress is from a previous day, keep favorites but reset today's counts
    if (parsed.dateKey !== today) {
      return {
        dateKey: today,
        morningCounts: {},
        eveningCounts: {},
        favorites: Array.isArray(parsed.favorites) ? parsed.favorites : []
      };
    }
    return {
      dateKey: today,
      morningCounts: parsed.morningCounts || {},
      eveningCounts: parsed.eveningCounts || {},
      favorites: Array.isArray(parsed.favorites) ? parsed.favorites : []
    };
  } catch {
    return {
      dateKey: today,
      morningCounts: {},
      eveningCounts: {},
      favorites: []
    };
  }
}

export function saveDayProgress(progress: AzkarDayProgress): void {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch (e) {
    console.warn('Failed to save progress:', e);
  }
}
