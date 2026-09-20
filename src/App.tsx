import { useState, useEffect, useMemo, useCallback } from 'react';
import { ActiveTab, SettingsState, AzkarDayProgress } from './types';
import { MORNING_AZKAR, EVENING_AZKAR } from './data/azkarData';
import {
  calculatePrayerTimes,
  getNextPrayer,
  getPrayerTimesList,
  formatTime
} from './utils/prayerCalculator';
import { getHijriAndGregorianDate } from './utils/hijriCalendar';
import { calculateQibla } from './utils/qiblaCalculator';
import {
  loadSettings,
  saveSettings,
  loadDayProgress,
  saveDayProgress
} from './utils/storage';
import { playAdhanAudio, sendPrayerNotification } from './utils/audioAlert';
import { TranslationProvider, t } from './i18n';
import { Header } from './components/Header';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { SplashScreen } from './components/SplashScreen';
import { DashboardView } from './components/DashboardView';
import { AzkarView } from './components/AzkarView';
import { QuranView } from './components/QuranView';
import { QiblaView } from './components/QiblaView';
import { SettingsView } from './components/SettingsView';

export default function App() {
  // Splash Screen State
  const [showSplash, setShowSplash] = useState(true);

  // Active Tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Time & Realtime Clock
  const [now, setNow] = useState(new Date());

  // Settings & Progress (from LocalStorage)
  const [settings, setSettings] = useState<SettingsState>(() => loadSettings());
  const [progress, setProgress] = useState<AzkarDayProgress>(() => loadDayProgress());

  // Geolocation States
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Alert tracking to avoid re-triggering within the same minute
  const [alertedMinuteKey, setAlertedMinuteKey] = useState<string>('');

  // 1. Clock timer
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. Language and direction management on html element
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('lang', settings.language);
    root.setAttribute('dir', settings.language === 'ar' ? 'rtl' : 'ltr');
  }, [settings.language]);

  // 3. Dark mode class management on html element
  useEffect(() => {
    const root = document.documentElement;
    if (settings.appearance.theme === 'dark') {
      root.classList.add('dark');
    } else if (settings.appearance.theme === 'light') {
      root.classList.remove('dark');
    } else {
      // Auto
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isSystemDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [settings.appearance.theme]);

  // 4. Save settings to localStorage on change
  const handleUpdateSettings = useCallback((newSettings: SettingsState) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  }, []);

  // 5. Save day progress to localStorage on change
  const handleUpdateCount = useCallback((category: 'morning' | 'evening', id: string, newCount: number) => {
    setProgress((prev) => {
      const isMorning = category === 'morning';
      const updatedCounts = isMorning
        ? { ...prev.morningCounts, [id]: newCount }
        : { ...prev.eveningCounts, [id]: newCount };

      const updated: AzkarDayProgress = {
        ...prev,
        morningCounts: isMorning ? updatedCounts : prev.morningCounts,
        eveningCounts: !isMorning ? updatedCounts : prev.eveningCounts
      };
      saveDayProgress(updated);
      return updated;
    });
  }, []);

  const handleResetCount = useCallback((category: 'morning' | 'evening', id: string) => {
    handleUpdateCount(category, id, 0);
  }, [handleUpdateCount]);

  const handleResetCategory = useCallback((category: 'morning' | 'evening') => {
    setProgress((prev) => {
      const isMorning = category === 'morning';
      const updated: AzkarDayProgress = {
        ...prev,
        morningCounts: isMorning ? {} : prev.morningCounts,
        eveningCounts: !isMorning ? {} : prev.eveningCounts
      };
      saveDayProgress(updated);
      return updated;
    });
  }, []);

  const handleResetAllProgress = useCallback(() => {
    setProgress((prev) => {
      const updated: AzkarDayProgress = {
        ...prev,
        morningCounts: {},
        eveningCounts: {}
      };
      saveDayProgress(updated);
      return updated;
    });
  }, []);

  const handleToggleFavorite = useCallback((id: string) => {
    setProgress((prev) => {
      const favs = prev.favorites.includes(id)
        ? prev.favorites.filter((f) => f !== id)
        : [...prev.favorites, id];
      const updated: AzkarDayProgress = { ...prev, favorites: favs };
      saveDayProgress(updated);
      return updated;
    });
  }, []);

  // 6. Automatic Geolocation detector
  const handleDetectLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setLocationError(settings.language === 'en' ? 'Your browser does not support geolocation.' : 'متصفحك لا يدعم تحديد الموقع الجغرافي.');
      return;
    }

    setIsDetectingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsDetectingLocation(false);
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setSettings((prev) => {
          const updated: SettingsState = {
            ...prev,
            location: {
              ...prev.location,
              latitude: lat,
              longitude: lng,
              city: prev.language === 'en' ? 'Current Location' : 'موقعي الحالي',
              isAuto: true
            }
          };
          saveSettings(updated);
          return updated;
        });
      },
      (error) => {
        setIsDetectingLocation(false);
        let msg = settings.language === 'en'
          ? 'Unable to detect location. You can select your city manually.'
          : 'تعذر الحصول على الموقع الجغرافي. يمكنك اختيار المدينة يدوياً من القائمة.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = settings.language === 'en'
            ? 'Location permission denied. Please select your city in settings.'
            : 'تم رفض إذن الوصول إلى الموقع. يمكنك اختيار مدينتك يدوياً من الإعدادات.';
        }
        setLocationError(msg);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }, [settings.language]);

  // 7. Prayer Times & Solar computations
  const prayers = useMemo(() => {
    return calculatePrayerTimes(
      now,
      settings.location.latitude,
      settings.location.longitude,
      settings.calculationMethod,
      settings.asrMadhhab,
      settings.minuteAdjustments
    );
  }, [now, settings.location.latitude, settings.location.longitude, settings.calculationMethod, settings.asrMadhhab, settings.minuteAdjustments]);

  const prayerList = useMemo(() => {
    return getPrayerTimesList(prayers, now, settings.timeFormat, settings.language);
  }, [prayers, now, settings.timeFormat, settings.language]);

  const nextPrayer = useMemo(() => {
    return getNextPrayer(prayers, now, settings.timeFormat, settings.language);
  }, [prayers, now, settings.timeFormat, settings.language]);

  // 8. Hijri & Qibla calculations
  const hijriDate = useMemo(() => {
    return getHijriAndGregorianDate(now, settings.hijriOffset, settings.language);
  }, [now, settings.hijriOffset, settings.language]);

  const qibla = useMemo(() => {
    return calculateQibla(settings.location.latitude, settings.location.longitude);
  }, [settings.location.latitude, settings.location.longitude]);

  // Current formatted time
  const currentTimeString = useMemo(() => {
    return formatTime(now, settings.timeFormat, settings.language);
  }, [now, settings.timeFormat, settings.language]);

  // 9. Azkar stats
  const morningCompletedCount = useMemo(() => {
    return MORNING_AZKAR.filter((item) => (progress.morningCounts[item.id] || 0) >= item.targetCount).length;
  }, [progress.morningCounts]);

  const morningPercent = Math.round((morningCompletedCount / (MORNING_AZKAR.length || 1)) * 100);

  const eveningCompletedCount = useMemo(() => {
    return EVENING_AZKAR.filter((item) => (progress.eveningCounts[item.id] || 0) >= item.targetCount).length;
  }, [progress.eveningCounts]);

  const eveningPercent = Math.round((eveningCompletedCount / (EVENING_AZKAR.length || 1)) * 100);

  // 10. Prayer alerts and audio playback on exact prayer match
  useEffect(() => {
    const currentMinuteKey = `${now.getHours()}:${now.getMinutes()}`;
    if (alertedMinuteKey === currentMinuteKey) return;

    // Check each prayer
    prayerList.forEach((prayer) => {
      const pDate = prayer.rawDate;
      const isExactMinute = pDate.getHours() === now.getHours() && pDate.getMinutes() === now.getMinutes();

      if (isExactMinute) {
        setAlertedMinuteKey(currentMinuteKey);

        const isSunrise = prayer.name === 'sunrise';
        const isDuha = prayer.name === 'duha';
        if (isDuha) return; // Duha does not have adhan

        const shouldNotify = isSunrise
          ? settings.notifications.sunrise
          : settings.notifications.enabled;

        if (shouldNotify) {
          // Play requested Takbeers ("الله أكبر، الله أكبر" مرتين فقط)
          if (settings.sound.enabled) {
            playAdhanAudio(settings.sound.volume, settings.sound.adhanSoundType);
          }

          // Browser notification
          const isEn = settings.language === 'en';
          const prayerDisplayName = isEn && prayer.englishName ? prayer.englishName : prayer.arabicName;
          const notifTitle = isSunrise
            ? (isEn ? 'Sunrise Time' : 'حان الآن وقت شروق الشمس')
            : (isEn ? `Adhan Time for ${prayerDisplayName}` : `حان الآن موعد أذان ${prayerDisplayName}`);
          const notifBody = isSunrise
            ? (isEn ? `Sunrise in ${settings.location.city} - Duha prayer begins in 25 minutes.` : `شروق الشمس في ${settings.location.city} - يبدأ وقت صلاة الضحى بعد 25 دقيقة.`)
            : (isEn ? `Time for prayer (${prayer.time})` : `حي على الصلاة، حي على الفلاح (${prayer.time})`);
          sendPrayerNotification(notifTitle, notifBody);
        }
      }
    });

    // Check Pre-Prayer "سبحان الله وبحمده" reminder (before Fajr, Asr, Maghrib, Isha)
    if (settings.notifications.subhanAllahPrePrayer) {
      const isEn = settings.language === 'en';
      const targetPrayers = [
        { name: isEn ? 'Fajr' : 'الفجر', date: prayers.fajr },
        { name: isEn ? 'Asr' : 'العصر', date: prayers.asr },
        { name: isEn ? 'Maghrib' : 'المغرب', date: prayers.maghrib },
        { name: isEn ? 'Isha' : 'العشاء', date: prayers.isha }
      ];

      targetPrayers.forEach((tp) => {
        const diffMs = tp.date.getTime() - now.getTime();
        const diffMins = Math.round(diffMs / 60000);
        if (diffMins === settings.notifications.prePrayerMinutes && now.getSeconds() < 2) {
          const titleMsg = isEn ? `${tp.name} Prayer is Approaching` : `اقترب أذان صلاة ${tp.name}`;
          const bodyMsg = isEn
            ? `${settings.notifications.prePrayerMinutes} minutes remaining. Remembrance reminder: "Subhan Allah wa bihamdihi"`
            : `باقي ${settings.notifications.prePrayerMinutes} دقيقة. تذكير بالذكر المبارك: «سُبْحَانَ اللَّهِ وَبِحَمْدِهِ»`;
          sendPrayerNotification(titleMsg, bodyMsg);
        }
      });
    }
  }, [now, alertedMinuteKey, prayerList, prayers, settings]);

  // Toggle Theme helper
  const handleToggleTheme = () => {
    handleUpdateSettings({
      ...settings,
      appearance: {
        ...settings.appearance,
        theme: settings.appearance.theme === 'dark' ? 'light' : 'dark'
      }
    });
  };

  return (
    <TranslationProvider language={settings.language}>
      <div className="min-h-screen bg-[#F8FAF8] dark:bg-[#0D1512] text-slate-800 dark:text-slate-100 flex transition-colors duration-300">
        {/* Splash Screen */}
        {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

        {/* Desktop Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          morningPercent={morningPercent}
          eveningPercent={eveningPercent}
          settings={settings}
          onToggleTheme={handleToggleTheme}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          {/* Top Header */}
          <Header
            hijriDate={hijriDate}
            currentTimeString={currentTimeString}
            settings={settings}
            onToggleTheme={handleToggleTheme}
            setActiveTab={setActiveTab}
          />

          {/* Dynamic View Content */}
          <main id="main-content" className="flex-1 p-4 md:p-8 overflow-y-auto">
            {activeTab === 'dashboard' && (
              <DashboardView
                prayers={prayers}
                prayerList={prayerList}
                nextPrayer={nextPrayer}
                hijriDate={hijriDate}
                currentTimeString={currentTimeString}
                qibla={qibla}
                morningPercent={morningPercent}
                morningCompletedCount={morningCompletedCount}
                morningTotalCount={MORNING_AZKAR.length}
                eveningPercent={eveningPercent}
                eveningCompletedCount={eveningCompletedCount}
                eveningTotalCount={EVENING_AZKAR.length}
                settings={settings}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'morning' && (
              <AzkarView
                category="morning"
                items={MORNING_AZKAR}
                counts={progress.morningCounts}
                favorites={progress.favorites}
                settings={settings}
                onUpdateCount={(id, count) => handleUpdateCount('morning', id, count)}
                onResetCount={(id) => handleResetCount('morning', id)}
                onResetAll={() => handleResetCategory('morning')}
                onToggleFavorite={handleToggleFavorite}
              />
            )}

            {activeTab === 'evening' && (
              <AzkarView
                category="evening"
                items={EVENING_AZKAR}
                counts={progress.eveningCounts}
                favorites={progress.favorites}
                settings={settings}
                onUpdateCount={(id, count) => handleUpdateCount('evening', id, count)}
                onResetCount={(id) => handleResetCount('evening', id)}
                onResetAll={() => handleResetCategory('evening')}
                onToggleFavorite={handleToggleFavorite}
              />
            )}

            {activeTab === 'quran' && (
              <QuranView settings={settings} />
            )}

            {activeTab === 'qibla' && (
              <QiblaView qibla={qibla} location={settings.location} />
            )}

            {activeTab === 'settings' && (
              <SettingsView
                settings={settings}
                onUpdateSettings={handleUpdateSettings}
                onResetProgress={handleResetAllProgress}
                onDetectLocation={handleDetectLocation}
                isDetectingLocation={isDetectingLocation}
                locationError={locationError}
              />
            )}
          </main>

          {/* Mobile Bottom Navigation */}
          <Navbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            morningPercent={morningPercent}
            eveningPercent={eveningPercent}
          />
        </div>
      </div>
    </TranslationProvider>
  );
}
