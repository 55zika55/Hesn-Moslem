import { Language } from '../types';

export interface HijriDateInfo {
  dayName: string;
  hijriDay: number;
  hijriMonthName: string;
  hijriYear: number;
  formattedHijri: string;
  formattedGregorian: string;
}

const ARABIC_DAYS = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const ENGLISH_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const GREGORIAN_MONTHS_AR = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];

const GREGORIAN_MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function getHijriAndGregorianDate(date: Date, offsetDays: number = 0, lang: Language = 'ar'): HijriDateInfo {
  const targetDate = new Date(date);
  if (offsetDays !== 0) {
    targetDate.setDate(targetDate.getDate() + offsetDays);
  }

  const isAr = lang === 'ar';
  const dayName = isAr ? ARABIC_DAYS[targetDate.getDay()] : ENGLISH_DAYS[targetDate.getDay()];
  const gregDay = targetDate.getDate();
  const gregMonth = isAr ? GREGORIAN_MONTHS_AR[targetDate.getMonth()] : GREGORIAN_MONTHS_EN[targetDate.getMonth()];
  const gregYear = targetDate.getFullYear();
  const formattedGregorian = isAr
    ? `${gregDay} ${gregMonth} ${gregYear}`
    : `${gregMonth} ${gregDay}, ${gregYear}`;

  let hijriDay = 26;
  let hijriMonthName = isAr ? 'ربيع الأول' : 'Rabiʻ I';
  let hijriYear = 1448;

  try {
    const locale = isAr ? 'ar-SA-u-ca-islamic-umalqura' : 'en-US-u-ca-islamic-umalqura';
    const formatter = new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    const parts = formatter.formatToParts(targetDate);
    for (const part of parts) {
      if (part.type === 'day') {
        const num = parseInt(part.value.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString()), 10);
        if (!isNaN(num)) hijriDay = num;
      }
      if (part.type === 'month') {
        hijriMonthName = part.value;
      }
      if (part.type === 'year') {
        const num = parseInt(part.value.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString()), 10);
        if (!isNaN(num)) hijriYear = num;
      }
    }
  } catch {
    hijriDay = 26;
    hijriMonthName = isAr ? 'ربيع الأول' : 'Rabiʻ I';
    hijriYear = 1448;
  }

  const formattedHijri = isAr
    ? `${dayName}، ${hijriDay} ${hijriMonthName} ${hijriYear} هـ`
    : `${dayName}, ${hijriDay} ${hijriMonthName} ${hijriYear} AH`;

  return {
    dayName,
    hijriDay,
    hijriMonthName,
    hijriYear,
    formattedHijri,
    formattedGregorian
  };
}
