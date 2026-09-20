import React, { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';
import { useTranslation } from '../i18n';

interface SplashProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashProps> = ({ onFinish }) => {
  const { t, isRTL } = useTranslation();
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFade(true);
      setTimeout(onFinish, 600);
    }, 1400);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      id="splash-screen"
      onClick={() => {
        setFade(true);
        setTimeout(onFinish, 300);
      }}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-emerald-900 via-emerald-950 to-[#0A120E] text-white transition-opacity duration-600 cursor-pointer ${
        fade ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center text-center p-6 space-y-6 max-w-sm">
        {/* Quranic Bismillah */}
        <div className="space-y-1">
          <p className="font-amiri text-2xl md:text-3xl text-amber-200/90 font-medium tracking-wide" dir="rtl">
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
          </p>
          {!isRTL && (
            <p className="text-xs text-emerald-200/75 italic">
              {t('bismillah')}
            </p>
          )}
        </div>

        {/* Emblem */}
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-emerald-800/80 border border-amber-300/30 flex items-center justify-center shadow-2xl shadow-emerald-950">
            <BookOpen className="w-10 h-10 text-amber-300 stroke-[2]" />
          </div>
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-400/20 to-emerald-400/20 blur-sm -z-10 animate-pulse" />
        </div>

        {/* Title */}
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white mb-2">
            {t('splashTitle')}
          </h1>
          <p className="text-sm text-emerald-200/90 font-medium">
            {t('splashSubtitle')}
          </p>
        </div>

        {/* Subtle loader */}
        <div className="w-24 h-1 bg-emerald-950 rounded-full overflow-hidden">
          <div className="w-full h-full bg-gradient-to-r from-amber-300 to-emerald-400 animate-[loading_1.4s_ease-in-out_infinite]" />
        </div>

        <span className="text-[11px] text-emerald-300/60 font-light">
          {t('clickToEnter')}
        </span>
      </div>
    </div>
  );
};
