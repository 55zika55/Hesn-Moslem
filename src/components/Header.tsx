import React, { useState, useEffect } from 'react';
import { HijriDateInfo } from '../utils/hijriCalendar';
import { MapPin, MoonStar, SunMedium, Volume2, Square, Wifi, WifiOff, HardDrive } from 'lucide-react';
import { SettingsState, ActiveTab } from '../types';
import { playAdhanAudio, stopAdhanAudio, subscribeAdhanState } from '../utils/audioAlert';
import { useTranslation } from '../i18n';
import { useOnlineStatus } from '../utils/usePWAInstall';
import { CacheManagerModal } from './CacheManagerModal';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  hijriDate: HijriDateInfo;
  currentTimeString: string;
  settings: SettingsState;
  onToggleTheme: () => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Header: React.FC<HeaderProps> = ({
  hijriDate,
  currentTimeString,
  settings,
  onToggleTheme,
  setActiveTab
}) => {
  const { t, isRTL } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCacheModalOpen, setIsCacheModalOpen] = useState(false);
  const isOnline = useOnlineStatus();

  useEffect(() => {
    return subscribeAdhanState(setIsPlaying);
  }, []);

  const handleAudioToggle = () => {
    if (isPlaying) {
      stopAdhanAudio();
    } else {
      playAdhanAudio(settings.sound.volume, settings.sound.adhanSoundType);
    }
  };

  return (
    <header
      id="app-header"
      className="w-full bg-white/70 dark:bg-[#111A16]/70 backdrop-blur-md border-b border-emerald-900/10 dark:border-emerald-500/10 px-4 md:px-8 py-3.5 sticky top-0 z-20"
    >
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Date & Day Banner */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-center justify-center bg-emerald-800 text-white rounded-xl px-3 py-1.5 shadow-sm">
            <span className="text-xs font-bold text-amber-300">{hijriDate.dayName}</span>
            <span className="text-lg font-black leading-none">{hijriDate.hijriDay}</span>
          </div>
          <div>
            <div className="text-sm md:text-base font-extrabold text-emerald-950 dark:text-emerald-300 flex items-center gap-2">
              <span>{hijriDate.formattedHijri}</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {hijriDate.formattedGregorian} {isRTL ? t('mSuffix') : ''}
            </div>
          </div>
        </div>

        {/* Location & Quick Actions */}
        <div className="flex items-center gap-2 md:gap-2.5">
          {/* Online/Offline Status Indicator Button */}
          <button
            id="header-network-status-btn"
            onClick={() => setIsCacheModalOpen(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold transition-all border shadow-sm ${
              isOnline
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-500/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40'
                : 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30 hover:bg-amber-500/25 animate-pulse'
            }`}
            title={isOnline ? t('onlineDesc') : t('offlineModeActive')}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isOnline ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50' : 'bg-amber-400'
              }`}
            />
            {isOnline ? (
              <Wifi className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <WifiOff className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            )}
            <span className="hidden sm:inline text-[11px]">
              {isOnline ? t('onlineStatus') : t('offlineStatus')}
            </span>
          </button>

          {/* PWA Install Button */}
          <PWAInstallButton variant="header" />

          {/* Location button */}
          <button
            id="header-location-btn"
            onClick={() => setActiveTab('settings')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold hover:bg-emerald-100 transition-colors border border-emerald-800/10"
            title={t('changeLocationTooltip')}
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{settings.location.city}</span>
          </button>

          {/* Audio test / stop */}
          <button
            id="header-audio-test-btn"
            onClick={handleAudioToggle}
            className={`p-2 rounded-full transition-colors flex items-center justify-center ${
              isPlaying
                ? 'bg-amber-500 text-white animate-pulse shadow-md shadow-amber-500/20'
                : 'text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700'
            }`}
            title={isPlaying ? t('stopAdhanNow') : t('testAudioTooltip')}
          >
            {isPlaying ? (
              <Square className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>

          {/* Theme toggle */}
          <button
            id="header-theme-toggle-btn"
            onClick={onToggleTheme}
            className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 transition-colors"
            title={t('toggleThemeTooltip')}
          >
            {settings.appearance.theme === 'dark' ? (
              <MoonStar className="w-4 h-4 text-amber-300" />
            ) : (
              <SunMedium className="w-4 h-4 text-emerald-700" />
            )}
          </button>

          {/* Time display */}
          <div className="hidden lg:block border-s border-slate-200 dark:border-slate-800 ps-3 ms-1">
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200 tracking-wider">
              {currentTimeString}
            </span>
          </div>
        </div>
      </div>

      {/* Cache Manager Modal */}
      <CacheManagerModal
        isOpen={isCacheModalOpen}
        onClose={() => setIsCacheModalOpen(false)}
      />
    </header>
  );
};
