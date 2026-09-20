export type ActiveTab = 'dashboard' | 'morning' | 'evening' | 'quran' | 'qibla' | 'settings';

export interface SurahMeta {
  number: number;
  name: string; // Arabic name with tashkeel, e.g. "الفَاتِحَة"
  englishName: string; // e.g. "Al-Faatiha"
  englishNameTranslation: string; // e.g. "The Opening"
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
  juz: number;
  page: number;
}

export interface AyahItem {
  numberInSurah: number;
  text: string;
  translation?: string;
  juz?: number;
  page?: number;
}

export interface QuranBookmark {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  timestamp: number;
}

export interface ZikrItem {
  id: string;
  category: 'morning' | 'evening';
  isBaseSource: boolean; // True for the core source (Hisn al-Muslim primary chart)
  text: string;
  source: string;
  virtue?: string;
  targetCount: number;
  order: number;
}

export interface AzkarDayProgress {
  dateKey: string; // YYYY-MM-DD
  morningCounts: Record<string, number>;
  eveningCounts: Record<string, number>;
  favorites: string[]; // list of zikr IDs
}

export interface LocationConfig {
  country: string;
  city: string;
  latitude: number;
  longitude: number;
  isAuto: boolean;
}

export type CalculationMethod = 'Egypt' | 'MWL' | 'Makkah' | 'ISNA' | 'Karachi' | 'Kuwait';
export type AsrMadhhab = 'Standard' | 'Hanafi'; // Standard: Shafi'i, Maliki, Hanbali (shadow ratio 1)
export type TimeFormat = '12h' | '24h';
export type ThemeMode = 'light' | 'dark' | 'auto';

export interface PrayerTimeItem {
  name: string;
  arabicName: string;
  englishName?: string;
  time: string; // e.g. "04:32" or "4:32 ص"
  rawDate: Date;
  isPassed: boolean;
  isNext: boolean;
  isDuha?: boolean;
}

export type Language = 'ar' | 'en';

export type AdhanSoundType = 'takbeer_file' | 'takbeer_double' | 'full_adhan' | 'custom_file' | 'synth';

export interface SettingsState {
  location: LocationConfig;
  calculationMethod: CalculationMethod;
  asrMadhhab: AsrMadhhab;
  timeFormat: TimeFormat;
  minuteAdjustments: {
    fajr: number;
    sunrise: number;
    dhuhr: number;
    asr: number;
    maghrib: number;
    isha: number;
  };
  hijriOffset: number; // -2 to +2 days
  notifications: {
    enabled: boolean;
    fajr: boolean;
    sunrise: boolean;
    dhuhr: boolean;
    asr: boolean;
    maghrib: boolean;
    isha: boolean;
    morningAzkar: boolean;
    morningTime: string; // e.g. "06:30"
    eveningAzkar: boolean;
    eveningTime: string; // e.g. "17:00"
    subhanAllahPrePrayer: boolean; // التنبيه بسبحان الله وبحمده قبل الصلوات
    prePrayerMinutes: number; // e.g. 15 minutes before
  };
  sound: {
    enabled: boolean;
    volume: number; // 0.0 - 1.0
    adhanSoundType: AdhanSoundType;
    customFileName?: string;
  };
  appearance: {
    theme: ThemeMode;
    fontSizeOffset: number; // -2 to +6 pt
  };
  azkarDisplay: {
    showSource: boolean;
    showTargetCount: boolean;
    autoAdvance: boolean;
    vibrateOnCount: boolean;
    soundOnCount: boolean;
  };
  qiblaDisplay: {
    showDegrees: boolean;
    showDistance: boolean;
  };
  language: Language;
}
