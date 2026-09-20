import React, { useState, useEffect } from 'react';
import { ActiveTab, SettingsState } from '../types';
import { Home, Sun, Moon, Compass, Settings, BookOpen, Volume2, MoonStar, SunMedium, Square } from 'lucide-react';
import { playAdhanAudio, stopAdhanAudio, subscribeAdhanState } from '../utils/audioAlert';
import { useTranslation } from '../i18n';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  morningPercent: number;
  eveningPercent: number;
  settings: SettingsState;
  onToggleTheme: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  morningPercent,
  eveningPercent,
  settings,
  onToggleTheme
}) => {
  const { t } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);

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

  const tabs = [
    {
      id: 'dashboard' as ActiveTab,
      label: t('navDashboard'),
      icon: Home,
      description: t('navDashboardDesc')
    },
    {
      id: 'morning' as ActiveTab,
      label: t('navMorning'),
      icon: Sun,
      description: t('navMorningDesc'),
      badge: morningPercent === 100 ? t('completedBadge') : morningPercent > 0 ? `${morningPercent}%` : undefined
    },
    {
      id: 'evening' as ActiveTab,
      label: t('navEvening'),
      icon: Moon,
      description: t('navEveningDesc'),
      badge: eveningPercent === 100 ? t('completedBadge') : eveningPercent > 0 ? `${eveningPercent}%` : undefined
    },
    {
      id: 'quran' as ActiveTab,
      label: t('navQuran'),
      icon: BookOpen,
      description: t('navQuranDesc')
    },
    {
      id: 'qibla' as ActiveTab,
      label: t('navQibla'),
      icon: Compass,
      description: t('navQiblaDesc')
    },
    {
      id: 'settings' as ActiveTab,
      label: t('navSettings'),
      icon: Settings,
      description: t('navSettingsDesc')
    }
  ];

  return (
    <aside
      id="desktop-sidebar"
      aria-label={t('sidebarTitle')}
      className="hidden md:flex flex-col w-72 h-screen sticky top-0 bg-white/80 dark:bg-[#111A16]/90 backdrop-blur-md border-e border-emerald-900/10 dark:border-emerald-500/10 p-5 select-none z-30"
    >
      {/* Brand Header */}
      <div className="flex items-center gap-3 pb-6 border-b border-emerald-900/10 dark:border-emerald-500/10">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-900 flex items-center justify-center text-amber-300 shadow-md shadow-emerald-900/15">
          <BookOpen className="w-6 h-6 stroke-[2.2]" />
        </div>
        <div>
          <h1 className="text-lg font-extrabold text-emerald-900 dark:text-emerald-300 tracking-tight leading-snug">
            {t('sidebarTitle')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t('sidebarSubtitle')}</p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 py-6 space-y-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`sidebar-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 text-start group ${
                isActive
                  ? 'bg-emerald-800 text-white font-semibold shadow-md shadow-emerald-900/20'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-800 dark:hover:text-emerald-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? 'text-amber-300' : 'text-emerald-700 dark:text-emerald-400'
                  }`}
                />
                <div>
                  <div className="text-sm font-semibold">{tab.label}</div>
                  <div
                    className={`text-[11px] font-normal ${
                      isActive ? 'text-emerald-100/80' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {tab.description}
                  </div>
                </div>
              </div>

              {tab.badge && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    isActive
                      ? 'bg-emerald-700 text-amber-200 border border-amber-300/30'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Quick Controls */}
      <div className="pt-4 border-t border-emerald-900/10 dark:border-emerald-500/10 space-y-3">
        {/* Audio test pill */}
        <button
          onClick={handleAudioToggle}
          className={`w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
            isPlaying
              ? 'bg-amber-500 text-white animate-pulse shadow-md shadow-amber-500/20'
              : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60'
          }`}
          title={isPlaying ? t('stopAdhanNow') : t('testTakbeerBtn')}
        >
          {isPlaying ? (
            <>
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>{t('stopAdhanNow')}</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4" />
              <span>{t('testTakbeerBtn')}</span>
            </>
          )}
        </button>

        {/* Theme toggle */}
        <button
          onClick={onToggleTheme}
          className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
        >
          <span>{t('sec5Appearance')}</span>
          <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold">
            {settings.appearance.theme === 'dark' ? (
              <>
                <MoonStar className="w-4 h-4" />
                <span>{t('themeDark')}</span>
              </>
            ) : (
              <>
                <SunMedium className="w-4 h-4" />
                <span>{t('themeLight')}</span>
              </>
            )}
          </div>
        </button>

        <div className="text-[11px] text-center text-slate-500 dark:text-slate-400 pt-1">
          {settings.location.city}، {settings.location.country}
        </div>
      </div>
    </aside>
  );
};
