import React from 'react';
import { useOnlineStatus } from '../utils/usePWAInstall';
import { WifiOff, ShieldCheck } from 'lucide-react';
import { useTranslation } from '../i18n';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const { t } = useTranslation();

  if (isOnline) return null;

  return (
    <div
      id="offline-banner"
      className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:right-auto sm:left-6 z-50 flex items-center gap-2.5 rounded-2xl bg-slate-900/95 text-white px-4 py-2.5 text-xs font-semibold shadow-2xl border border-emerald-500/30 backdrop-blur-md animate-fade-in"
    >
      <div className="p-1.5 rounded-lg bg-emerald-700/80 text-emerald-100 flex-shrink-0">
        <WifiOff className="w-4 h-4 text-amber-300" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-1.5 font-bold text-amber-300 text-[11px]">
          <span>{t('offlineModeActive') || 'وضع عدم الاتصال (أوفلاين) مفعّل'}</span>
        </div>
        <p className="text-[10px] text-slate-300">
          {t('offlineModeDesc') || 'جميع مواقيت الصلاة والأذكار والقرآن والصوت تعمل بدقة 100% بدون إنترنت'}
        </p>
      </div>
      <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
    </div>
  );
};
