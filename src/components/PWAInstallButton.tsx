import React, { useState } from 'react';
import { usePWAInstall } from '../utils/usePWAInstall';
import { Download, Share, Smartphone, Monitor, CheckCircle2, X } from 'lucide-react';
import { useTranslation } from '../i18n';

interface PWAInstallButtonProps {
  variant?: 'header' | 'banner' | 'settings';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, isIOS, isWindows, isAndroid, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);
  const { t } = useTranslation();

  // If already installed as standalone PWA, hide or show installed badge
  if (isInstalled) {
    if (variant === 'settings') {
      return (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-800/10">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{t('appAlreadyInstalled') || 'التطبيق مثبت بالفعل على جهازك ويعمل أوفلاين'}</span>
        </div>
      );
    }
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else {
      setShowGuide(true);
    }
  };

  return (
    <>
      {variant === 'header' && (
        <button
          id="pwa-header-install-btn"
          onClick={handleInstallClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-sm shadow-emerald-900/20 active:scale-95"
          title={t('installAppTooltip') || 'تثبيت التطبيق على جهازك للعمل بدون إنترنت'}
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t('installAppBtn') || 'تثبيت التطبيق'}</span>
        </button>
      )}

      {variant === 'banner' && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-800 to-teal-900 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/10 text-emerald-200">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm">{t('installAppBannerTitle') || 'ثبّت التطبيق على جهازك واستخدمه أوفلاين'}</h4>
              <p className="text-emerald-100/80 text-[11px]">
                {t('installAppBannerDesc') || 'يعمل بدون إنترنت، مع إشعارات الأذان والوصول السريع من شاشتك الرئيسية'}
              </p>
            </div>
          </div>
          <button
            onClick={handleInstallClick}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs transition-all shadow-sm active:scale-95 flex items-center justify-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>{t('installNowBtn') || 'تثبيت الآن مجاناً'}</span>
          </button>
        </div>
      )}

      {variant === 'settings' && (
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 text-xs">
              <Download className="w-4 h-4 text-emerald-600" />
              <span>{t('installOnDeviceTitle') || 'تثبيت التطبيق على أندرويد وويندوز'}</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              PWA 100% Offline
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            {t('installOnDeviceDesc') || 'يمكنك تثبيت التطبيق مباشرة كبرنامج مستقل على نظام Windows أو كتطبيق على هاتف Android مع دعم كامل للتشغيل بدون إنترنت.'}
          </p>
          <button
            onClick={handleInstallClick}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>{t('installAppBtn') || 'تثبيت التطبيق الآن'}</span>
          </button>
        </div>
      )}

      {/* Guidance modal for iOS / manual installations */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#15201A] p-6 shadow-2xl border border-emerald-800/20 text-slate-800 dark:text-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                <Smartphone className="w-4 h-4" />
                <span>{t('installGuideTitle') || 'تثبيت التطبيق على جهازك'}</span>
              </div>
              <button
                onClick={() => setShowGuide(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isIOS ? (
              <div className="space-y-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  📱 لأجهزة آيفون وآيباد (iOS Safari):
                </p>
                <ol className="list-decimal list-inside space-y-2 text-xs">
                  <li>
                    اضغط على زر <strong>المشاركة (Share)</strong> <Share className="w-3.5 h-3.5 inline mx-1 text-blue-500" /> في شريط متصفح Safari.
                  </li>
                  <li>
                    مرر لأسفل واختر <strong>«إضافة إلى الشاشة الرئيسية» (Add to Home Screen)</strong>.
                  </li>
                  <li>
                    اضغط على <strong>«إضافة» (Add)</strong> في الزاوية العلوية.
                  </li>
                </ol>
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-[11px]">
                  ✨ سيعمل التطبيق كبرنامج مستقل بالكامل بدون إنترنت، وستظهر أيقونته على شاشتك الرئيسية.
                </div>
              </div>
            ) : isWindows ? (
              <div className="space-y-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  💻 لنظام ويندوز (Windows):
                </p>
                <ol className="list-decimal list-inside space-y-2 text-xs">
                  <li>
                    افتح التطبيق في متصفح <strong>Google Chrome</strong> أو <strong>Microsoft Edge</strong>.
                  </li>
                  <li>
                    اضغط على أيقونة التثبيت <Download className="w-3.5 h-3.5 inline mx-1 text-emerald-600" /> الموجودة في شريط العناوين بالأعلى.
                  </li>
                  <li>
                    أو افتح قائمة المتصفح (⋮) ثم اختر <strong>«تثبيت هذا الموقع كتطبيق»</strong>.
                  </li>
                  <li>
                    سيمكنك وضعه في شريط المهام وقائمة ابدأ وتعيين تشغيله التلقائي.
                  </li>
                </ol>
              </div>
            ) : (
              <div className="space-y-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  🤖 لهواتف أندرويد (Android):
                </p>
                <ol className="list-decimal list-inside space-y-2 text-xs">
                  <li>
                    افتح متصفح <strong>Chrome</strong> أو <strong>Samsung Internet</strong>.
                  </li>
                  <li>
                    اضغط على قائمة المتصفح (⋮) واختر <strong>«تثبيت التطبيق» (Install app)</strong> أو <strong>«إضافة إلى الشاشة الرئيسية»</strong>.
                  </li>
                  <li>
                    أكد التثبيت ليعمل بكامل خصائصه دون الحاجة لمتصفح.
                  </li>
                </ol>
              </div>
            )}

            <button
              onClick={() => setShowGuide(false)}
              className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors"
            >
              {t('close') || 'إغلاق'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
