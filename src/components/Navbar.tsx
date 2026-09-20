import React from 'react';
import { ActiveTab } from '../types';
import { Home, Sun, Moon, BookOpen, Compass, Settings } from 'lucide-react';
import { useTranslation } from '../i18n';

interface NavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  morningPercent: number;
  eveningPercent: number;
}

export const Navbar: React.FC<NavProps> = ({
  activeTab,
  setActiveTab,
  morningPercent,
  eveningPercent
}) => {
  const { t } = useTranslation();

  const tabs = [
    { id: 'dashboard' as ActiveTab, label: t('navDashboard'), icon: Home },
    {
      id: 'morning' as ActiveTab,
      label: t('navMorning'),
      icon: Sun,
      badge: morningPercent === 100 ? '✓' : morningPercent > 0 ? `${morningPercent}%` : undefined
    },
    {
      id: 'evening' as ActiveTab,
      label: t('navEvening'),
      icon: Moon,
      badge: eveningPercent === 100 ? '✓' : eveningPercent > 0 ? `${eveningPercent}%` : undefined
    },
    { id: 'quran' as ActiveTab, label: t('navQuran'), icon: BookOpen },
    { id: 'qibla' as ActiveTab, label: t('navQibla'), icon: Compass },
    { id: 'settings' as ActiveTab, label: t('navSettings'), icon: Settings }
  ];

  return (
    <nav
      id="bottom-navigation"
      aria-label="Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#111A16]/95 backdrop-blur-md border-t border-emerald-900/10 dark:border-emerald-500/10 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-safe"
    >
      <div className="flex items-center justify-around h-16 px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-btn-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 ${
                isActive
                  ? 'text-emerald-700 dark:text-emerald-400 font-bold scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-emerald-600'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {tab.badge && (
                  <span className="absolute -top-1.5 -left-2 bg-emerald-600 dark:bg-emerald-500 text-white text-[9px] font-bold px-1 rounded-full min-w-[15px] h-3.5 flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1 whitespace-nowrap tracking-tight">{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-0 w-8 h-0.5 bg-emerald-700 dark:bg-emerald-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
