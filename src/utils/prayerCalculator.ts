import { CalculationMethod, AsrMadhhab, PrayerTimeItem, Language } from '../types';

export interface CityPreset {
  name: string;
  country: string;
  lat: number;
  lng: number;
  timezone: number; // default standard timezone (or detected)
  method: CalculationMethod;
}

export const CITIES_PRESETS: CityPreset[] = [
  // مصر
  { name: 'القاهرة', country: 'مصر', lat: 30.0444, lng: 31.2357, timezone: 2, method: 'Egypt' },
  { name: 'الإسكندرية', country: 'مصر', lat: 31.2001, lng: 29.9187, timezone: 2, method: 'Egypt' },
  { name: 'الجيزة', country: 'مصر', lat: 30.0131, lng: 31.2089, timezone: 2, method: 'Egypt' },
  { name: 'المنصورة', country: 'مصر', lat: 31.0409, lng: 31.3785, timezone: 2, method: 'Egypt' },
  { name: 'طنطا', country: 'مصر', lat: 30.7865, lng: 31.0004, timezone: 2, method: 'Egypt' },
  { name: 'أسوان', country: 'مصر', lat: 24.0889, lng: 32.8998, timezone: 2, method: 'Egypt' },
  { name: 'الأقصر', country: 'مصر', lat: 25.6872, lng: 32.6396, timezone: 2, method: 'Egypt' },
  { name: 'بورسعيد', country: 'مصر', lat: 31.2653, lng: 32.3019, timezone: 2, method: 'Egypt' },
  { name: 'السويس', country: 'مصر', lat: 29.9668, lng: 32.5498, timezone: 2, method: 'Egypt' },
  { name: 'شرم الشيخ', country: 'مصر', lat: 27.9158, lng: 34.3299, timezone: 2, method: 'Egypt' },

  // السعودية
  { name: 'مكة المكرمة', country: 'المملكة العربية السعودية', lat: 21.4225, lng: 39.8262, timezone: 3, method: 'Makkah' },
  { name: 'المدينة المنورة', country: 'المملكة العربية السعودية', lat: 24.5247, lng: 39.5692, timezone: 3, method: 'Makkah' },
  { name: 'الرياض', country: 'المملكة العربية السعودية', lat: 24.7136, lng: 46.6753, timezone: 3, method: 'Makkah' },
  { name: 'جدة', country: 'المملكة العربية السعودية', lat: 21.5433, lng: 39.1728, timezone: 3, method: 'Makkah' },
  { name: 'الدمام', country: 'المملكة العربية السعودية', lat: 26.4207, lng: 50.0888, timezone: 3, method: 'Makkah' },

  // العالم العربي والإسلامي
  { name: 'القدس الشريف', country: 'فلسطين', lat: 31.7683, lng: 35.2137, timezone: 2, method: 'MWL' },
  { name: 'دبي', country: 'الإمارات', lat: 25.2048, lng: 55.2708, timezone: 4, method: 'MWL' },
  { name: 'أبو ظبي', country: 'الإمارات', lat: 24.4539, lng: 54.3773, timezone: 4, method: 'MWL' },
  { name: 'مدينة الكويت', country: 'الكويت', lat: 29.3759, lng: 47.9774, timezone: 3, method: 'Kuwait' },
  { name: 'الدوحة', country: 'قطر', lat: 25.2854, lng: 51.5310, timezone: 3, method: 'Makkah' },
  { name: 'عمّان', country: 'الأردن', lat: 31.9454, lng: 35.9284, timezone: 3, method: 'MWL' },
  { name: 'بيروت', country: 'لبنان', lat: 33.8938, lng: 35.5018, timezone: 2, method: 'MWL' },
  { name: 'دمشق', country: 'سوريا', lat: 33.5138, lng: 36.2765, timezone: 3, method: 'MWL' },
  { name: 'بغداد', country: 'العراق', lat: 33.3152, lng: 44.3661, timezone: 3, method: 'MWL' },
  { name: 'مسقط', country: 'عمان', lat: 23.5880, lng: 58.3829, timezone: 4, method: 'MWL' },
  { name: 'المنامة', country: 'البحرين', lat: 26.2285, lng: 50.5860, timezone: 3, method: 'Makkah' },
  { name: 'الرباط', country: 'المغرب', lat: 34.0209, lng: -6.8416, timezone: 1, method: 'MWL' },
  { name: 'الدار البيضاء', country: 'المغرب', lat: 33.5731, lng: -7.5898, timezone: 1, method: 'MWL' },
  { name: 'الجزائر العاصمة', country: 'الجزائر', lat: 36.7538, lng: 3.0588, timezone: 1, method: 'MWL' },
  { name: 'تونس العاصمة', country: 'تونس', lat: 36.8065, lng: 10.1815, timezone: 1, method: 'MWL' },
  { name: 'طرابلس', country: 'ليبيا', lat: 32.8872, lng: 13.1913, timezone: 2, method: 'MWL' },
  { name: 'الخرطوم', country: 'السودان', lat: 15.5007, lng: 32.5599, timezone: 2, method: 'MWL' },
  { name: 'إسطنبول', country: 'تركيا', lat: 41.0082, lng: 28.9784, timezone: 3, method: 'MWL' },
  { name: 'لندن', country: 'المملكة المتحدة', lat: 51.5074, lng: -0.1278, timezone: 0, method: 'MWL' },
  { name: 'نيويورك', country: 'الولايات المتحدة', lat: 40.7128, lng: -74.0060, timezone: -5, method: 'ISNA' }
];

export interface CalculationMethodParams {
  name: string;
  arabicName: string;
  fajrAngle: number;
  ishaAngle: number;
  ishaInterval?: number; // minutes after Maghrib (e.g. 90m for Umm Al-Qura)
}

export const METHOD_PARAMS: Record<CalculationMethod, CalculationMethodParams> = {
  Egypt: {
    name: 'Egypt',
    arabicName: 'الهيئة المصرية العامة للمساحة',
    fajrAngle: 19.5,
    ishaAngle: 17.5
  },
  MWL: {
    name: 'MWL',
    arabicName: 'رابطة العالم الإسلامي',
    fajrAngle: 18.0,
    ishaAngle: 17.0
  },
  Makkah: {
    name: 'Makkah',
    arabicName: 'جامعة أم القرى - مكة المكرمة',
    fajrAngle: 18.5,
    ishaAngle: 0,
    ishaInterval: 90 // 90 min after Maghrib
  },
  ISNA: {
    name: 'ISNA',
    arabicName: 'الجمعية الإسلامية لأمريكا الشمالية',
    fajrAngle: 15.0,
    ishaAngle: 15.0
  },
  Karachi: {
    name: 'Karachi',
    arabicName: 'جامعة العلوم الإسلامية بكراتشي',
    fajrAngle: 18.0,
    ishaAngle: 18.0
  },
  Kuwait: {
    name: 'Kuwait',
    arabicName: 'طريقة دولة الكويت',
    fajrAngle: 18.0,
    ishaAngle: 17.5
  }
};

// Trigonometric helpers with degrees
const d2r = (deg: number) => (deg * Math.PI) / 180;
const r2d = (rad: number) => (rad * 180) / Math.PI;
const sinDeg = (deg: number) => Math.sin(d2r(deg));
const cosDeg = (deg: number) => Math.cos(d2r(deg));
const tanDeg = (deg: number) => Math.tan(d2r(deg));
const acosDeg = (val: number) => r2d(Math.acos(Math.max(-1, Math.min(1, val))));
const atan2Deg = (y: number, x: number) => r2d(Math.atan2(y, x));

// Fix angle into range [0, 360)
const fixAngle = (angle: number): number => {
  let a = angle % 360;
  if (a < 0) a += 360;
  return a;
};

// Fix hour into range [0, 24)
const fixHour = (hour: number): number => {
  let h = hour % 24;
  if (h < 0) h += 24;
  return h;
};

// Solar position calculation
function getSunPosition(julianDate: number) {
  const D = julianDate - 2451545.0;
  const g = fixAngle(357.529 + 0.98560028 * D);
  const q = fixAngle(280.459 + 0.98564736 * D);
  const L = fixAngle(q + 1.915 * sinDeg(g) + 0.020 * sinDeg(2 * g));

  const e = 23.439 - 0.00000036 * D;
  const RA = fixAngle(atan2Deg(cosDeg(e) * sinDeg(L), cosDeg(L))) / 15;
  const declination = r2d(Math.asin(sinDeg(e) * sinDeg(L)));

  let eqOfTime = q / 15 - RA;
  if (eqOfTime > 12) eqOfTime -= 24;
  if (eqOfTime < -12) eqOfTime += 24;

  return { declination, equationOfTime: eqOfTime };
}

function getJulianDate(date: Date): number {
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  const day = date.getDate();

  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }

  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);

  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + B - 1524.5;
}

export interface ComputedPrayers {
  fajr: Date;
  sunrise: Date;
  duha: Date; // Sunrise + 25 minutes exactly
  dhuhr: Date;
  asr: Date;
  maghrib: Date;
  isha: Date;
}

export function calculatePrayerTimes(
  date: Date,
  lat: number,
  lng: number,
  method: CalculationMethod = 'Egypt',
  madhhab: AsrMadhhab = 'Standard',
  minuteAdjustments = { fajr: 0, sunrise: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 }
): ComputedPrayers {
  const jd = getJulianDate(date);
  const { declination, equationOfTime } = getSunPosition(jd);
  const tz = -date.getTimezoneOffset() / 60; // Local timezone offset in hours

  // Midday in hours
  const midDay = fixHour(12 + tz - lng / 15 - equationOfTime);

  // Hour angle helper
  const hourAngle = (angle: number): number => {
    const cosH = (sinDeg(angle) - sinDeg(lat) * sinDeg(declination)) / (cosDeg(lat) * cosDeg(declination));
    if (cosH > 1) return 0; // Sun never rises
    if (cosH < -1) return 12; // Sun never sets
    return acosDeg(cosH) / 15;
  };

  const methodParams = METHOD_PARAMS[method] || METHOD_PARAMS.Egypt;

  // Fajr
  const fajrH = hourAngle(-methodParams.fajrAngle);
  const fajrHours = midDay - fajrH;

  // Sunrise (altitude -0.8333 degrees)
  const sunriseH = hourAngle(-0.8333);
  const sunriseHours = midDay - sunriseH;

  // Sunset / Maghrib
  const maghribHours = midDay + sunriseH;

  // Asr
  const shadowRatio = madhhab === 'Hanafi' ? 2 : 1;
  const asrAlt = r2d(Math.atan(1 / (shadowRatio + tanDeg(Math.abs(lat - declination)))));
  const asrH = hourAngle(asrAlt);
  const asrHours = midDay + asrH;

  // Isha
  let ishaHours: number;
  if (methodParams.ishaInterval) {
    ishaHours = maghribHours + methodParams.ishaInterval / 60;
  } else {
    const ishaH = hourAngle(-methodParams.ishaAngle);
    ishaHours = midDay + ishaH;
  }

  // Dhuhr has slight safety addition (2 minutes) according to traditional survey tables
  const dhuhrHours = midDay + 2 / 60;

  const toDate = (hours: number, addMinutes: number = 0): Date => {
    const result = new Date(date);
    const totalMinutes = Math.round(hours * 60) + addMinutes;
    const h = Math.floor(totalMinutes / 60) % 24;
    const m = Math.floor(totalMinutes % 60);
    result.setHours(h, m, 0, 0);
    return result;
  };

  const fajr = toDate(fajrHours, minuteAdjustments.fajr);
  const sunrise = toDate(sunriseHours, minuteAdjustments.sunrise);
  // القاعدة الشرعية الصريحة المحددة: وقت الضحى = وقت الشروق + 25 دقيقة بالضبط!
  const duha = new Date(sunrise.getTime() + 25 * 60 * 1000);
  const dhuhr = toDate(dhuhrHours, minuteAdjustments.dhuhr);
  const asr = toDate(asrHours, minuteAdjustments.asr);
  const maghrib = toDate(maghribHours, minuteAdjustments.maghrib);
  const isha = toDate(ishaHours, minuteAdjustments.isha);

  return { fajr, sunrise, duha, dhuhr, asr, maghrib, isha };
}

export function formatTime(date: Date, format: '12h' | '24h' = '12h', lang: Language = 'ar'): string {
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');

  if (format === '24h') {
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  }

  const period = lang === 'en' ? (hours >= 12 ? 'PM' : 'AM') : (hours >= 12 ? 'م' : 'ص');
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${period}`;
}

export interface NextPrayerInfo {
  name: string;
  arabicName: string;
  englishName?: string;
  timeString: string;
  targetDate: Date;
  remainingSeconds: number;
  formattedCountdown: string;
  isToday: boolean;
}

export function getNextPrayer(prayers: ComputedPrayers, now: Date, timeFormat: '12h' | '24h' = '12h', lang: Language = 'ar'): NextPrayerInfo {
  // Ordered sequence of main congregational & sunnah markers
  const prayerList = [
    { key: 'fajr', arabic: 'صلاة الفجر', english: 'Fajr Prayer', date: prayers.fajr },
    { key: 'sunrise', arabic: 'شروق الشمس', english: 'Sunrise', date: prayers.sunrise },
    { key: 'duha', arabic: 'صلاة الضحى', english: 'Duha Prayer', date: prayers.duha },
    { key: 'dhuhr', arabic: 'صلاة الظهر', english: 'Dhuhr Prayer', date: prayers.dhuhr },
    { key: 'asr', arabic: 'صلاة العصر', english: 'Asr Prayer', date: prayers.asr },
    { key: 'maghrib', arabic: 'صلاة المغرب', english: 'Maghrib Prayer', date: prayers.maghrib },
    { key: 'isha', arabic: 'صلاة العشاء', english: 'Isha Prayer', date: prayers.isha }
  ];

  for (const item of prayerList) {
    const diff = item.date.getTime() - now.getTime();
    if (diff > 0) {
      const remainingSec = Math.floor(diff / 1000);
      const h = Math.floor(remainingSec / 3600);
      const m = Math.floor((remainingSec % 3600) / 60);
      const s = remainingSec % 60;
      const formatted = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;

      return {
        name: item.key,
        arabicName: item.arabic,
        englishName: item.english,
        timeString: formatTime(item.date, timeFormat, lang),
        targetDate: item.date,
        remainingSeconds: remainingSec,
        formattedCountdown: formatted,
        isToday: true
      };
    }
  }

  // If all prayers today have passed, the next is tomorrow's Fajr
  const tomorrowFajr = new Date(prayers.fajr.getTime() + 24 * 60 * 60 * 1000);
  const diff = tomorrowFajr.getTime() - now.getTime();
  const remainingSec = Math.max(0, Math.floor(diff / 1000));
  const h = Math.floor(remainingSec / 3600);
  const m = Math.floor((remainingSec % 3600) / 60);
  const s = remainingSec % 60;
  const formatted = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;

  return {
    name: 'fajr',
    arabicName: 'صلاة الفجر غداً',
    englishName: 'Fajr Prayer Tomorrow',
    timeString: formatTime(tomorrowFajr, timeFormat, lang),
    targetDate: tomorrowFajr,
    remainingSeconds: remainingSec,
    formattedCountdown: formatted,
    isToday: false
  };
}

export function getPrayerTimesList(prayers: ComputedPrayers, now: Date, timeFormat: '12h' | '24h' = '12h', lang: Language = 'ar'): PrayerTimeItem[] {
  const nextInfo = getNextPrayer(prayers, now, timeFormat, lang);

  const items = [
    { key: 'fajr', arabic: 'الفجر', english: 'Fajr', date: prayers.fajr, isDuha: false },
    { key: 'sunrise', arabic: 'الشروق', english: 'Sunrise', date: prayers.sunrise, isDuha: false },
    { key: 'duha', arabic: 'الضحى (الشروق + 25د)', english: 'Duha (Sunrise + 25m)', date: prayers.duha, isDuha: true },
    { key: 'dhuhr', arabic: 'الظهر', english: 'Dhuhr', date: prayers.dhuhr, isDuha: false },
    { key: 'asr', arabic: 'العصر', english: 'Asr', date: prayers.asr, isDuha: false },
    { key: 'maghrib', arabic: 'المغرب', english: 'Maghrib', date: prayers.maghrib, isDuha: false },
    { key: 'isha', arabic: 'العشاء', english: 'Isha', date: prayers.isha, isDuha: false }
  ];

  return items.map(item => ({
    name: item.key,
    arabicName: item.arabic,
    englishName: item.english,
    time: formatTime(item.date, timeFormat, lang),
    rawDate: item.date,
    isPassed: item.date.getTime() < now.getTime(),
    isNext: item.key === nextInfo.name && nextInfo.isToday,
    isDuha: item.isDuha
  }));
}
