import React, { useState, useEffect } from 'react';
import {
  X,
  Wifi,
  WifiOff,
  Download,
  Trash2,
  HardDrive,
  BookOpen,
  CheckCircle2,
  Volume2,
  RefreshCw,
  Sparkles,
  Info
} from 'lucide-react';
import { OfflineCacheStats } from '../types';
import {
  getOfflineCacheStats,
  downloadFullOfflinePackage,
  clearOfflineCache,
  subscribeToCacheUpdates
} from '../utils/cacheManager';
import { useOnlineStatus } from '../utils/usePWAInstall';
import { useTranslation } from '../i18n';

interface CacheManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CacheManagerModal: React.FC<CacheManagerModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const isOnline = useOnlineStatus();
  const [stats, setStats] = useState<OfflineCacheStats | null>(null);
  const [downloadMsg, setDownloadMsg] = useState('');
  const [isClearing, setIsClearing] = useState(false);

  const refreshStats = async () => {
    const data = await getOfflineCacheStats();
    setStats(data);
  };

  useEffect(() => {
    if (isOpen) {
      refreshStats();
    }
  }, [isOpen]);

  useEffect(() => {
    const unsubscribe = subscribeToCacheUpdates(() => {
      refreshStats();
    });
    return unsubscribe;
  }, []);

  if (!isOpen) return null;

  const handleStartDownload = async () => {
    if (!isOnline) {
      alert('يتطلب تحميل الحزمة الكاملة الاتصال بالإنترنت أولاً.');
      return;
    }
    await downloadFullOfflinePackage((progress, message) => {
      setDownloadMsg(message);
    });
    await refreshStats();
  };

  const handleClearCache = async () => {
    if (window.confirm(t('clearCacheConfirm'))) {
      setIsClearing(true);
      await clearOfflineCache();
      await refreshStats();
      setIsClearing(false);
      setDownloadMsg(t('cacheCleared'));
      setTimeout(() => setDownloadMsg(''), 3000);
    }
  };

  const readinessPercent = Math.min(
    100,
    Math.round(
      ((stats?.quranSurahsCached || 0) / 114) * 40 +
      (stats?.azkarCached ? 30 : 0) +
      (stats?.audioCached ? 15 : 0) +
      Math.min(15, ((stats?.mushafPagesCached || 0) / 30) * 15)
    )
  );

  return (
    <div
      id="cache-manager-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-[#121B17] rounded-3xl shadow-2xl border border-emerald-900/10 dark:border-emerald-500/20 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-emerald-950 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-800/80 border border-emerald-700/50 flex items-center justify-center text-amber-300">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base md:text-lg text-white">
                {t('cacheManagerTitle')}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    isOnline
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {isOnline ? (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <Wifi className="w-3 h-3" />
                      {t('onlineStatus')}
                    </>
                  ) : (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <WifiOff className="w-3 h-3" />
                      {t('offlineStatus')}
                    </>
                  )}
                </span>
                <span className="text-[11px] text-emerald-200/70">
                  {stats?.totalEstimatedSizeMB || 0} MB مخزنة
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-emerald-200 hover:text-white hover:bg-white/10 transition-colors"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Readiness Meter */}
          <div className="bg-gradient-to-br from-emerald-900/10 to-teal-900/10 dark:from-emerald-950/40 dark:to-[#0c1e17] rounded-2xl p-4 border border-emerald-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                {t('offlineReadiness')}
              </span>
              <span className="text-sm font-black text-emerald-700 dark:text-emerald-400">
                {readinessPercent}%
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full transition-all duration-500"
                style={{ width: `${readinessPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              {t('cacheManagerDesc')}
            </p>
          </div>

          {/* Download Progress Box if active */}
          {stats?.isDownloading && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 animate-pulse">
              <div className="flex items-center justify-between text-xs font-bold text-amber-800 dark:text-amber-300 mb-1.5">
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  {downloadMsg || t('downloadingOfflineData')}
                </span>
                <span>{stats.downloadProgress}%</span>
              </div>
              <div className="w-full h-2 bg-amber-200 dark:bg-amber-950 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-300"
                  style={{ width: `${stats.downloadProgress}%` }}
                />
              </div>
            </div>
          )}

          {downloadMsg && !stats?.isDownloading && (
            <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-500/20">
              {downloadMsg}
            </div>
          )}

          {/* Resource Status List */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
              الموارد والبيانات المخزنة محلياً
            </h4>

            {/* Azkar */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {t('azkarCacheStatus')}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {stats?.azkarCount || 50} ذكر موثق متاح دائماً بدون إنترنت
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-1 rounded-lg">
                جاهز 100%
              </span>
            </div>

            {/* Quran Text */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-400 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {t('quranSurahsCacheStatus')}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {stats?.quranSurahsCached || 0} من {stats?.totalSurahs || 114} سورة مخزنة
                  </div>
                </div>
              </div>
              <span
                className={`text-xs font-bold px-2 py-1 rounded-lg ${
                  (stats?.quranSurahsCached || 0) >= 114
                    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80'
                    : 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/80'
                }`}
              >
                {(stats?.quranSurahsCached || 0) >= 114 ? 'كامل' : `${stats?.quranSurahsCached}/114`}
              </span>
            </div>

            {/* Mushaf Page Images */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 flex items-center justify-center">
                  <HardDrive className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {t('mushafPagesCacheStatus')}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {stats?.mushafPagesCached || 0} صفحة مصحف مصورة محفوظة في Cache
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                {stats?.mushafPagesCached || 0} ص
              </span>
            </div>

            {/* Audio Files */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center">
                  <Volume2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {t('audioCacheStatus')}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    أصوات الأذان وتكبيرات الصلاة
                  </div>
                </div>
              </div>
              <span
                className={`text-xs font-bold px-2 py-1 rounded-lg ${
                  stats?.audioCached
                    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80'
                    : 'text-slate-500 bg-slate-100 dark:bg-slate-800'
                }`}
              >
                {stats?.audioCached ? 'مخزن' : 'تلقائي'}
              </span>
            </div>
          </div>

          {/* Quick Notice */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-[11px] text-emerald-900 dark:text-emerald-300">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>
              يتم حفظ أي سورة أو صفحة تتصفحها تلقائياً في ذاكرة هاتفك أو جهازك لتعمل في الزيارات القادمة بدون الحاجة للإنترنت.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/40 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleClearCache}
            disabled={isClearing || stats?.isDownloading}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-rose-300 dark:border-rose-900/50 text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-bold transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t('clearCacheBtn')}</span>
          </button>

          <button
            onClick={handleStartDownload}
            disabled={stats?.isDownloading || !isOnline}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md shadow-emerald-700/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {stats?.isDownloading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>
              {stats?.isDownloading
                ? t('downloadingOfflineData')
                : t('downloadAllOfflineData')}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
