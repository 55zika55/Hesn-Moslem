import React, { useState } from 'react';
import { usePWAInstall } from '../utils/usePWAInstall';
import { Download, Share, Smartphone, Monitor, CheckCircle2, X, Sparkles, ExternalLink } from 'lucide-react';
import { useTranslation } from '../i18n';

interface PWAInstallButtonProps {
  variant?: 'header' | 'banner' | 'settings';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, isIOS, isWindows, isAndroid, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);
  const [activeTab, setActiveTab] = useState<'windows' | 'android' | 'ios'>(
    isWindows ? 'windows' : isAndroid ? 'android' : isIOS ? 'ios' : 'windows'
  );
  const { t } = useTranslation();

  // If already installed as standalone PWA, hide or show installed badge
  if (isInstalled) {
    if (variant === 'settings') {
      return (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-800/15">
          <div className="p-2 rounded-xl bg-emerald-600 text-white">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-sm text-emerald-950 dark:text-emerald-200">
              {t('appAlreadyInstalled') || 'التطبيق مثبت ويعمل بكامل طاقته أوفلاين'}
            </div>
            <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
              يعمل كتطبيق مستقل بدون الحاجة لإنترنت مع مواقيت الصلاة والأذكار والتنبيهات
            </div>
          </div>
        </div>
      );
    }
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (!success) {
        setShowGuide(true);
      }
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
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 text-white text-xs font-bold transition-all shadow-sm shadow-emerald-900/20 active:scale-95 border border-emerald-500/30 group"
          title={t('installAppTooltip') || 'تثبيت التطبيق على جهازك للعمل بدون إنترنت'}
        >
          <Download className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
          <span className="hidden sm:inline">{t('installAppBtn') || 'تثبيت التطبيق'}</span>
          <span className="sm:hidden">{t('installAppBtn') || 'تثبيت'}</span>
        </button>
      )}

      {variant === 'banner' && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-950 text-white shadow-xl border border-emerald-500/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 w-full md:w-auto">
            <div className="p-3 rounded-2xl bg-amber-400 text-emerald-950 shadow-md font-black shrink-0">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-sm sm:text-base text-amber-300">
                  {t('installAppBannerTitle') || 'تثبيت التطبيق على هاتفك أو حاسوبك'}
                </h4>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/15 text-emerald-200 font-bold">
                  أوفلاين 100%
                </span>
              </div>
              <p className="text-emerald-100/80 text-xs mt-0.5 leading-relaxed">
                {t('installAppBannerDesc') || 'يعمل بدون إنترنت تماماً، سريع وخفيف على الذاكرة مع إشعارات الأذان والوصول الفوري.'}
              </p>
            </div>
          </div>
          <button
            onClick={handleInstallClick}
            className="w-full md:w-auto px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>{t('installNowBtn') || 'تثبيت الآن مجاناً'}</span>
          </button>
        </div>
      )}

      {variant === 'settings' && (
        <div className="p-5 rounded-3xl bg-white dark:bg-[#15201A] border border-emerald-900/10 dark:border-emerald-500/15 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 font-bold text-slate-800 dark:text-slate-200 text-sm">
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <span className="block font-black">{t('installOnDeviceTitle') || 'تثبيت التطبيق على الويندوز والأندرويد'}</span>
                <span className="block text-[11px] text-slate-500 font-normal">تشغيل التطبيق كبرنامج أصلي بدون متصفح</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
              PWA Offline
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {t('installOnDeviceDesc') || 'يمكنك تثبيت التطبيق مباشرة كبرنامج مستقل على نظام Windows أو كتطبيق على هاتف Android مع دعم كامل للتشغيل بدون إنترنت.'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
              <Monitor className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>دعم كامل لويندوز (شريط المهام وقائمة ابدأ)</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
              <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>تطبيق أندرويد وآيفون على الشاشة الرئيسية</span>
            </div>
          </div>

          <button
            onClick={handleInstallClick}
            className="w-full py-3 px-4 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.99]"
          >
            <Download className="w-4 h-4" />
            <span>{isInstallable ? (t('installNowBtn') || 'تثبيت فوري الآن') : (t('installAppBtn') || 'طريقة التثبيت على جهازك')}</span>
          </button>
        </div>
      )}

      {/* Interactive Guidance modal */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#15201A] p-6 shadow-2xl border border-emerald-800/20 text-slate-800 dark:text-slate-100 space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5 text-emerald-800 dark:text-emerald-300 font-extrabold text-base">
                <Download className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>{t('installGuideTitle') || 'تثبيت التطبيق على جهازك'}</span>
              </div>
              <button
                onClick={() => setShowGuide(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Direct install trigger if available */}
            {isInstallable && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 to-teal-500/15 border border-emerald-500/30 flex items-center justify-between gap-3">
                <div className="text-xs">
                  <div className="font-bold text-emerald-950 dark:text-emerald-300">
                    متصفحك يدعم التثبيت الفوري بنقرة واحدة!
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400">
                    اضغط للبدء وسيقوم النظام بتثبيته فوراً.
                  </div>
                </div>
                <button
                  onClick={async () => {
                    await install();
                    setShowGuide(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shrink-0 flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>تثبيت الآن</span>
                </button>
              </div>
            )}

            {/* OS Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl">
              <button
                onClick={() => setActiveTab('windows')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'windows'
                    ? 'bg-white dark:bg-[#1E2E25] text-emerald-800 dark:text-emerald-300 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>ويندوز (PC)</span>
              </button>
              <button
                onClick={() => setActiveTab('android')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'android'
                    ? 'bg-white dark:bg-[#1E2E25] text-emerald-800 dark:text-emerald-300 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>أندرويد (Android)</span>
              </button>
              <button
                onClick={() => setActiveTab('ios')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'ios'
                    ? 'bg-white dark:bg-[#1E2E25] text-emerald-800 dark:text-emerald-300 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <Share className="w-3.5 h-3.5" />
                <span>آيفون (iOS)</span>
              </button>
            </div>

            {/* Tab 1: Windows */}
            {activeTab === 'windows' && (
              <div className="space-y-3.5 text-xs leading-relaxed">
                <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-extrabold text-sm">
                  <Monitor className="w-4 h-4 text-emerald-600" />
                  <span>خطوات التثبيت على نظام Windows (كمبيوتر):</span>
                </div>
                <div className="space-y-2.5 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                      1
                    </span>
                    <p>
                      افتح الموقع في متصفح <strong>Google Chrome</strong> أو <strong>Microsoft Edge</strong>.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                      2
                    </span>
                    <p>
                      ستجد أيقونة تثبيت <Download className="w-3.5 h-3.5 inline mx-1 text-emerald-600" /> في <strong>شريط العناوين بالأعلى</strong> (بجوار النجمة أو رمز المشاركة). اضغط عليها ثم اضغط <strong>«تثبيت» (Install)</strong>.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                      3
                    </span>
                    <p>
                      أو من قائمة المتصفح (⋮ أو ...) اختر <strong>«تثبيت هذا الموقع كتطبيق»</strong> أو <strong>«التطبيقات ← تثبيت»</strong>.
                    </p>
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-[11px] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>سيعمل كنافذة برنامج مستقلة على شريط المهام وقائمة ابدأ وبدون إنترنت!</span>
                </div>
              </div>
            )}

            {/* Tab 2: Android */}
            {activeTab === 'android' && (
              <div className="space-y-3.5 text-xs leading-relaxed">
                <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-extrabold text-sm">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span>خطوات التثبيت على أجهزة أندرويد (Android):</span>
                </div>
                <div className="space-y-2.5 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                      1
                    </span>
                    <p>
                      افتح الرابط في متصفح <strong>Chrome</strong> أو <strong>Samsung Internet</strong>.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                      2
                    </span>
                    <p>
                      اضغط على زر <strong>«تثبيت التطبيق»</strong> الظاهر في أعلى الشاشة أو انتظر ظهور رسالة التثبيت بالأسفل.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                      3
                    </span>
                    <p>
                      أو افتح قائمة الخيارات (<strong>⋮</strong> في أعلى المتصفح) واختر <strong>«تثبيت التطبيق» (Install app)</strong> أو <strong>«إضافة إلى الشاشة الرئيسية»</strong>.
                    </p>
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-[11px] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>ستظهر أيقونة التطبيق في شاشة تطبيقات هاتفك وسيعمل بكامل وظائفه بدون نت.</span>
                </div>
              </div>
            )}

            {/* Tab 3: iOS */}
            {activeTab === 'ios' && (
              <div className="space-y-3.5 text-xs leading-relaxed">
                <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-extrabold text-sm">
                  <Share className="w-4 h-4 text-emerald-600" />
                  <span>خطوات التثبيت على آيفون وآيباد (Safari):</span>
                </div>
                <div className="space-y-2.5 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                      1
                    </span>
                    <p>
                      تأكد من فتح الرابط في متصفح <strong>Safari</strong> الأصلي.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                      2
                    </span>
                    <p>
                      اضغط على زر <strong>المشاركة (Share)</strong> <Share className="w-3.5 h-3.5 inline mx-1 text-blue-500" /> في شريط متصفح Safari بالأسفل.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                      3
                    </span>
                    <p>
                      مرر لأسفل القائمة واختر <strong>«إضافة إلى الصفحة الرئيسية» (Add to Home Screen)</strong> ثم اضغط <strong>«إضافة» (Add)</strong>.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Close button */}
            <button
              onClick={() => setShowGuide(false)}
              className="w-full py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors"
            >
              {t('close') || 'تم، فهمت'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

