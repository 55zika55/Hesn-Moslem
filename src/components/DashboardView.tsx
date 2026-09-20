import React, { useState, useEffect } from 'react';
import { ActiveTab, SettingsState, PrayerTimeItem } from '../types';
import { ComputedPrayers, NextPrayerInfo } from '../utils/prayerCalculator';
import { HijriDateInfo } from '../utils/hijriCalendar';
import { QiblaResult } from '../utils/qiblaCalculator';
import { Sun, Moon, Compass, Clock, CheckCircle2, ChevronLeft, ChevronRight, Sparkles, MapPin, Volume2, BookOpen, Bookmark, Square } from 'lucide-react';
import { playAdhanAudio, stopAdhanAudio, subscribeAdhanState, playClickSound } from '../utils/audioAlert';
import { PRE_PRAYER_TASBEEH } from '../data/azkarData';
import { loadQuranBookmark } from '../utils/quranStorage';
import { useTranslation } from '../i18n';

interface DashboardProps {
  prayers: ComputedPrayers;
  prayerList: PrayerTimeItem[];
  nextPrayer: NextPrayerInfo;
  hijriDate: HijriDateInfo;
  currentTimeString: string;
  qibla: QiblaResult;
  morningPercent: number;
  morningCompletedCount: number;
  morningTotalCount: number;
  eveningPercent: number;
  eveningCompletedCount: number;
  eveningTotalCount: number;
  settings: SettingsState;
  setActiveTab: (tab: ActiveTab) => void;
}

export const DashboardView: React.FC<DashboardProps> = ({
  prayerList,
  nextPrayer,
  hijriDate,
  currentTimeString,
  qibla,
  morningPercent,
  morningCompletedCount,
  morningTotalCount,
  eveningPercent,
  eveningCompletedCount,
  eveningTotalCount,
  settings,
  setActiveTab
}) => {
  const { t, isRTL, language } = useTranslation();
  // Pre-prayer Tasbeeh quick counter
  const [tasbeehCount, setTasbeehCount] = useState(0);

  const handleTasbeehClick = () => {
    if (settings.azkarDisplay.soundOnCount) playClickSound(0.25);
    if (settings.azkarDisplay.vibrateOnCount && navigator.vibrate) navigator.vibrate(25);
    setTasbeehCount(prev => (prev + 1) % 34);
  };

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    return subscribeAdhanState(setIsPlayingAudio);
  }, []);

  const handleToggleAdhanAudio = () => {
    if (isPlayingAudio) {
      stopAdhanAudio();
    } else {
      playAdhanAudio(settings.sound.volume, settings.sound.adhanSoundType);
    }
  };

  const ForwardIcon = isRTL ? ChevronLeft : ChevronRight;

  return (
    <div id="dashboard-view" className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* 1. Large Current Time & Next Prayer Hero Banner */}
      <section
        id="next-prayer-hero"
        aria-label={t('nextPrayerTitle')}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-900 to-[#0c3a26] text-white p-6 md:p-8 shadow-xl shadow-emerald-950/20"
      >
        {/* Subtle decorative Islamic arch geometric elements */}
        <div className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 w-80 h-80 rounded-full bg-emerald-700/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-96 h-96 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Right/Left side: Next Prayer & Countdown */}
          <div className="text-center md:text-start space-y-2 flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-500/30 text-emerald-100 text-xs font-semibold backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>{t('nextPrayerTitle')}</span>
            </div>

            <div className="flex items-baseline justify-center md:justify-start gap-3">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-amber-300">
                {language === 'en' && nextPrayer.englishName ? nextPrayer.englishName : nextPrayer.arabicName}
              </h2>
              <span className="text-lg md:text-2xl font-bold text-emerald-100">
                {nextPrayer.timeString}
              </span>
            </div>

            <div className="pt-2">
              <div className="text-xs text-emerald-200/80 font-medium">{t('timeRemaining')}</div>
              <div
                dir="ltr"
                className="text-4xl md:text-5xl font-mono font-black tracking-wider text-white drop-shadow-md py-1"
              >
                {nextPrayer.formattedCountdown}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1 text-xs text-emerald-200/90">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-300" />
                {settings.location.city} ({settings.location.country})
              </span>
              <span>•</span>
              <span>
                {t('calcMethodLabel')}: {language === 'en' ? settings.calculationMethod : (settings.calculationMethod === 'Egypt' ? 'المساحة المصرية' : settings.calculationMethod)}
              </span>
            </div>
          </div>

          {/* Left/Right side: Current Clock & Today */}
          <div className="flex flex-col items-center md:items-end justify-center bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-2xl px-6 py-5 border border-white/15 min-w-[220px]">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-200 mb-1">
              <Clock className="w-4 h-4" />
              <span>{t('currentTime')}</span>
            </div>
            <div className="text-3xl md:text-4xl font-extrabold tracking-tight text-white font-mono">
              {currentTimeString}
            </div>
            <div className="text-xs font-medium text-emerald-100/90 mt-2 text-center md:text-start">
              {hijriDate.formattedHijri}
            </div>
            <div className="text-[11px] text-emerald-200/70">
              {hijriDate.formattedGregorian} {isRTL ? t('mSuffix') : ''}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Prayer Times Grid (Including Shurooq and Duha = Sunrise + 25m) */}
      <section
        id="prayer-times-grid"
        aria-label={t('dailyPrayerTimes')}
        className="bg-white dark:bg-[#15201A] rounded-3xl p-5 md:p-6 shadow-sm border border-emerald-900/10 dark:border-emerald-500/10"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-6 bg-emerald-700 rounded-full" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {t('dailyPrayerTimes')}
            </h3>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {t('autoUpdated')}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {prayerList.map((item) => {
            const displayName = language === 'en' && item.englishName ? item.englishName : item.arabicName;
            return (
              <div
                key={item.name}
                id={`prayer-card-${item.name}`}
                className={`relative flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-200 ${
                  item.isNext
                    ? 'bg-gradient-to-b from-emerald-800 to-emerald-900 text-white shadow-lg shadow-emerald-900/25 scale-[1.03] ring-2 ring-amber-400'
                    : item.isDuha
                    ? 'bg-amber-50/80 dark:bg-amber-950/20 text-slate-800 dark:text-slate-100 border border-amber-200/80 dark:border-amber-700/30'
                    : item.isPassed
                    ? 'bg-slate-50/80 dark:bg-slate-900/40 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800/60'
                    : 'bg-emerald-50/50 dark:bg-emerald-950/30 text-slate-800 dark:text-slate-100 border border-emerald-800/10 dark:border-emerald-500/10'
                }`}
              >
                {item.isNext && (
                  <span className="absolute -top-2.5 bg-amber-400 text-emerald-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
                    {t('upcoming')}
                  </span>
                )}

                {item.isDuha && !item.isNext && (
                  <span className="absolute -top-2 bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    {t('duhaBadge')}
                  </span>
                )}

                <span
                  className={`text-xs font-bold mb-1 text-center ${
                    item.isNext ? 'text-amber-300' : item.isDuha ? 'text-amber-800 dark:text-amber-300' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {displayName}
                </span>

                <span
                  className={`text-base md:text-lg font-extrabold tracking-tight ${
                    item.isNext ? 'text-white' : 'text-slate-800 dark:text-slate-100'
                  }`}
                >
                  {item.time}
                </span>

                {item.isPassed && !item.isNext && (
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    {t('passed')}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Shurooq and Duha clarification footnote */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap items-center justify-between gap-2">
          <span>
            {t('duhaTimingNote')}
          </span>
          <button
            onClick={() => setActiveTab('settings')}
            className="text-emerald-700 dark:text-emerald-400 font-semibold hover:underline inline-flex items-center gap-1"
          >
            <span>{t('editCalcMethod')}</span>
            <ForwardIcon className="w-3 h-3" />
          </button>
        </div>
      </section>

      {/* 3. Daily Azkar Progress Cards (Morning & Evening) */}
      <section
        id="azkar-status-section"
        aria-label="Daily Azkar Progress"
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Morning Azkar Card */}
        <div
          id="morning-azkar-card"
          className="bg-gradient-to-br from-amber-500/10 via-emerald-500/5 to-transparent bg-white dark:bg-[#15201A] rounded-3xl p-5 border border-amber-400/20 dark:border-amber-500/10 shadow-sm relative flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center">
                  <Sun className="w-5 h-5 stroke-[2.3]" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-base">
                    {t('morningAzkarTitle')}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t('morningAzkarTimeDesc')}
                  </p>
                </div>
              </div>

              <span
                className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                  morningPercent === 100
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}
              >
                {morningPercent === 100 ? t('completedBadge') : `${morningPercent}%`}
              </span>
            </div>

            {/* Progress bar */}
            <div className="space-y-1.5 my-3">
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 font-medium">
                <span>{t('completedAzkar')}: {morningCompletedCount} / {morningTotalCount}</span>
                <span>{morningPercent}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-emerald-600 rounded-full transition-all duration-500"
                  style={{ width: `${morningPercent}%` }}
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('morning')}
            className="w-full mt-3 py-2.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <span>{morningPercent === 100 ? t('reviewMorning') : t('readMorningNow')}</span>
            <ForwardIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Evening Azkar Card */}
        <div
          id="evening-azkar-card"
          className="bg-gradient-to-br from-indigo-500/10 via-emerald-500/5 to-transparent bg-white dark:bg-[#15201A] rounded-3xl p-5 border border-indigo-400/20 dark:border-indigo-500/10 shadow-sm relative flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center">
                  <Moon className="w-5 h-5 stroke-[2.3]" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-base">
                    {t('eveningAzkarTitle')}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t('eveningAzkarTimeDesc')}
                  </p>
                </div>
              </div>

              <span
                className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                  eveningPercent === 100
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                }`}
              >
                {eveningPercent === 100 ? t('completedBadge') : `${eveningPercent}%`}
              </span>
            </div>

            {/* Progress bar */}
            <div className="space-y-1.5 my-3">
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 font-medium">
                <span>{t('completedAzkar')}: {eveningCompletedCount} / {eveningTotalCount}</span>
                <span>{eveningPercent}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-600 rounded-full transition-all duration-500"
                  style={{ width: `${eveningPercent}%` }}
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('evening')}
            className="w-full mt-3 py-2.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <span>{eveningPercent === 100 ? t('reviewEvening') : t('readEveningNow')}</span>
            <ForwardIcon className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 4. Pre-Prayer Tasbeeh, Holy Quran & Qibla Quick Cards */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Pre-Prayer Tasbeeh widget */}
        <div
          id="pre-prayer-tasbeeh-widget"
          className="bg-white dark:bg-[#15201A] rounded-3xl p-5 border border-emerald-900/10 dark:border-emerald-500/10 shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>{t('prePrayerTasbeehTitle')}</span>
              </div>
              <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full font-semibold">
                {t('alertMinutesBefore')} {settings.notifications.prePrayerMinutes} {t('minAbbr')}
              </span>
            </div>

            <p className="font-amiri text-lg text-emerald-950 dark:text-emerald-100 font-bold leading-relaxed my-2" dir="rtl">
              {PRE_PRAYER_TASBEEH.text}
            </p>

            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {language === 'en'
                ? 'Virtue: Whoever recites this 100 times in the morning and evening, no one will come on the Day of Resurrection with anything better.'
                : PRE_PRAYER_TASBEEH.virtue}
            </p>
          </div>

          {/* Interactive Tap counter */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={handleTasbeehClick}
              className="flex-1 py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 active:scale-95 text-white font-bold text-sm transition-transform flex items-center justify-center gap-2 shadow-sm"
            >
              <span>{t('praiseAndTap')}</span>
              <span className="bg-emerald-900 px-2.5 py-0.5 rounded-full text-xs text-amber-300 font-mono">
                {tasbeehCount} / 33
              </span>
            </button>
            <button
              onClick={() => setTasbeehCount(0)}
              className="mx-2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-2 py-1"
              title={t('resetBtn')}
            >
              {t('resetBtn')}
            </button>
          </div>
        </div>

        {/* Holy Quran Quick Card */}
        <div
          id="quran-quick-card"
          className="bg-white dark:bg-[#15201A] rounded-3xl p-5 border border-emerald-900/10 dark:border-emerald-500/10 shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                <BookOpen className="w-4 h-4 text-amber-500" />
                <span>{t('quranTitle')}</span>
              </div>
              <span className="text-[10px] bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full font-semibold">
                114 {t('allSurahs')}
              </span>
            </div>

            {/* Bookmark or Featured preview */}
            {(() => {
              const bookmark = loadQuranBookmark();
              return bookmark ? (
                <div className="my-3 p-3 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-300/30 space-y-1">
                  <div className="text-[11px] text-amber-700 dark:text-amber-400 font-bold flex items-center gap-1.5">
                    <Bookmark className="w-3.5 h-3.5 fill-amber-500" />
                    <span>{t('continueReading')}</span>
                  </div>
                  <div className="text-sm font-black text-slate-900 dark:text-slate-100 flex items-center justify-between">
                    <span>سورة {bookmark.surahName}</span>
                    <span className="font-mono text-xs text-emerald-700 dark:text-emerald-400">
                      الآية {bookmark.ayahNumber}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="my-3 space-y-2">
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {t('quranSubtitle')}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-md font-medium">الفاتحة</span>
                    <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-md font-medium">الكهف</span>
                    <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-md font-medium">يس</span>
                    <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-md font-medium">الملك</span>
                  </div>
                </div>
              );
            })()}
          </div>

          <button
            onClick={() => setActiveTab('quran')}
            className="w-full mt-4 py-2.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <span>{t('backToSurahList')}</span>
            <ForwardIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Qibla Quick Summary Card */}
        <div
          id="qibla-quick-card"
          className="bg-white dark:bg-[#15201A] rounded-3xl p-5 border border-emerald-900/10 dark:border-emerald-500/10 shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                <Compass className="w-4 h-4 text-amber-500" />
                <span>{t('qiblaHeading')}</span>
              </div>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                {language === 'en' ? qibla.directionNameEn : qibla.directionNameAr}
              </span>
            </div>

            <div className="flex items-center gap-4 my-2">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-700/20 flex flex-col items-center justify-center text-emerald-800 dark:text-emerald-300">
                <span className="text-lg font-black leading-none">{qibla.angle}°</span>
                <span className="text-[9px] text-slate-500 dark:text-slate-400">{t('fromNorth')}</span>
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                <div>
                  {t('approxDistanceToMakkah')}:{' '}
                  <strong className="text-emerald-800 dark:text-emerald-300 font-bold">
                    {language === 'en' ? qibla.distanceKm.toLocaleString('en-US') : qibla.distanceKm.toLocaleString('ar-EG')} {t('kmUnit')}
                  </strong>
                </div>
                <div className="text-[11px] text-slate-400 dark:text-slate-500">
                  {t('makkahCoords')}: 21.42° N, 39.82° E
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('qibla')}
            className="w-full mt-4 py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-950 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <span>{t('openInteractiveCompass')}</span>
            <ForwardIcon className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 5. Audio and Notification Check Banner */}
      <section className={`rounded-2xl p-4 border transition-all flex flex-wrap items-center justify-between gap-3 text-xs ${
        isPlayingAudio
          ? 'bg-amber-500/10 border-amber-500/40 text-amber-900 dark:text-amber-200'
          : 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-800/15'
      }`}>
        <div className="flex items-center gap-2.5">
          {isPlayingAudio ? (
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping flex-shrink-0" />
          ) : (
            <Volume2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400 flex-shrink-0" />
          )}
          <span className="text-slate-700 dark:text-slate-300">
            {isPlayingAudio ? t('playingAdhanBadge') : t('audioTakbeerBanner')}
          </span>
        </div>
        <button
          onClick={handleToggleAdhanAudio}
          className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors shadow-sm flex items-center gap-1.5 ${
            isPlayingAudio
              ? 'bg-amber-600 hover:bg-amber-700 text-white animate-pulse'
              : 'bg-emerald-800 hover:bg-emerald-700 text-white'
          }`}
        >
          {isPlayingAudio ? (
            <>
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>{t('stopAdhanNow')}</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5" />
              <span>{t('testTakbeerBtn')}</span>
            </>
          )}
        </button>
      </section>
    </div>
  );
};
