import React, { useState, useEffect, useCallback } from 'react';
import { QiblaResult } from '../utils/qiblaCalculator';
import { LocationConfig } from '../types';
import { Compass, RotateCw, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useTranslation } from '../i18n';

interface QiblaViewProps {
  qibla: QiblaResult;
  location: LocationConfig;
}

export const QiblaView: React.FC<QiblaViewProps> = ({ qibla, location }) => {
  const { t, language } = useTranslation();
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
  const [hasCompassSensor, setHasCompassSensor] = useState<boolean | null>(null);
  const [permissionRequested, setPermissionRequested] = useState(false);
  const [manualOffset, setManualOffset] = useState(0);

  // Handle device orientation
  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    let heading: number | null = null;

    // WebKit iOS Compass Heading
    if ('webkitCompassHeading' in event && typeof (event as unknown as { webkitCompassHeading: number }).webkitCompassHeading === 'number') {
      heading = (event as unknown as { webkitCompassHeading: number }).webkitCompassHeading;
    } else if (event.alpha !== null) {
      // Android / Standard W3C Absolute
      // In deviceorientation, alpha is degrees around z-axis
      heading = 360 - event.alpha;
    }

    if (heading !== null && !isNaN(heading)) {
      setDeviceHeading((heading + 360) % 360);
      setHasCompassSensor(true);
    }
  }, []);

  const requestCompassPermission = async () => {
    setPermissionRequested(true);
    const DeviceOrientation = window.DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<'granted' | 'denied'>;
    };

    if (typeof DeviceOrientation?.requestPermission === 'function') {
      try {
        const response = await DeviceOrientation.requestPermission();
        if (response === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation, true);
        } else {
          setHasCompassSensor(false);
        }
      } catch (err) {
        console.warn('Error requesting orientation permission:', err);
        setHasCompassSensor(false);
      }
    } else {
      // Standard browser, try listening to absolute orientation first
      window.addEventListener('deviceorientationabsolute', handleOrientation, true);
      window.addEventListener('deviceorientation', handleOrientation, true);
    }
  };

  useEffect(() => {
    // Attempt automatic registration
    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      const DeviceOrientation = window.DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<'granted' | 'denied'>;
      };

      if (typeof DeviceOrientation?.requestPermission !== 'function') {
        window.addEventListener('deviceorientationabsolute', handleOrientation, true);
        window.addEventListener('deviceorientation', handleOrientation, true);
      }
    }

    // Timeout check: if no orientation event received after 2 seconds, device probably lacks magnetometer
    const timer = setTimeout(() => {
      if (deviceHeading === null) {
        setHasCompassSensor(false);
      }
    }, 2000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('deviceorientationabsolute', handleOrientation, true);
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, [handleOrientation, deviceHeading]);

  // Needle angle relative to current phone direction
  // Compass rotates by -deviceHeading; Kaaba pointer is at qibla.angle
  const effectiveHeading = deviceHeading !== null ? (deviceHeading + manualOffset) % 360 : 0;
  const needleRotation = qibla.angle - effectiveHeading;
  const isAlignedWithQibla = Math.abs((needleRotation + 360) % 360) < 4 || Math.abs((needleRotation + 360) % 360 - 360) < 4;

  const directionName = language === 'en' ? qibla.directionNameEn : qibla.directionNameAr;

  return (
    <div id="qibla-view" className="space-y-6 max-w-2xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#15201A] rounded-3xl p-6 shadow-sm border border-emerald-900/10 dark:border-emerald-500/10 text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
          <Compass className="w-3.5 h-3.5 text-amber-500" />
          <span>{t('qiblaAstronomicalCalc')}</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100">
          {t('qiblaHeading')}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {t('currentLocLabel')}: <strong>{location.city}, {location.country}</strong> ({t('latitude')} {location.latitude.toFixed(2)}°, {t('longitude')} {location.longitude.toFixed(2)}°)
        </p>
      </div>

      {/* Calibration Guidance Banner */}
      <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300/40 dark:border-amber-700/30 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
        <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">{t('calibrationNotice')}</p>
          <p className="leading-relaxed">
            {t('calibrationDesc')}
          </p>
        </div>
      </div>

      {/* Main Interactive Compass Dial */}
      <div className="bg-white dark:bg-[#15201A] rounded-3xl p-6 md:p-8 shadow-sm border border-emerald-900/10 dark:border-emerald-500/10 flex flex-col items-center">
        {/* Alignment Indicator */}
        <div className="mb-4">
          {hasCompassSensor && (
            <div
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                isAlignedWithQibla
                  ? 'bg-emerald-600 text-white animate-bounce shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {isAlignedWithQibla ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-amber-300" />
                  <span>{t('facingQiblaExact')}</span>
                </>
              ) : (
                <span>{t('rotatePhonePrompt')}</span>
              )}
            </div>
          )}
        </div>

        {/* SVG Compass Housing */}
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 select-none">
          {/* Compass Rose Ring (Rotates opposite to device heading) */}
          <div
            className="w-full h-full rounded-full border-4 border-emerald-800/20 dark:border-emerald-500/20 p-2 relative shadow-inner bg-gradient-to-b from-slate-50 to-emerald-50/30 dark:from-[#111A16] dark:to-[#0D1512] transition-transform duration-100 ease-out"
            style={{
              transform: `rotate(${-effectiveHeading}deg)`
            }}
          >
            {/* Degree ticks */}
            {Array.from({ length: 12 }).map((_, i) => {
              const deg = i * 30;
              return (
                <div
                  key={deg}
                  className="absolute inset-0 flex justify-center pt-1 text-[10px] text-slate-400 font-mono"
                  style={{ transform: `rotate(${deg}deg)` }}
                >
                  <div className="w-0.5 h-2 bg-slate-300 dark:bg-slate-700" />
                </div>
              );
            })}

            {/* Cardinal Directions */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 font-black text-rose-600 dark:text-rose-400 text-sm">
              {t('north')} (N)
            </div>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 font-bold text-slate-600 dark:text-slate-400 text-xs">
              {t('south')} (S)
            </div>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 font-bold text-slate-600 dark:text-slate-400 text-xs">
              {t('east')} (E)
            </div>
            <div className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-600 dark:text-slate-400 text-xs">
              {t('west')} (W)
            </div>

            {/* Kaaba Golden Marker fixed on compass rose at qibla.angle */}
            <div
              className="absolute inset-0 flex justify-center pointer-events-none"
              style={{ transform: `rotate(${qibla.angle}deg)` }}
            >
              <div className="flex flex-col items-center pt-2">
                <div className="w-6 h-6 rounded-md bg-amber-500 text-slate-950 font-bold text-[9px] flex items-center justify-center shadow-lg border border-amber-300">
                  {language === 'en' ? 'Kaaba' : 'كعبة'}
                </div>
                <div className="w-0.5 h-6 bg-amber-500" />
              </div>
            </div>
          </div>

          {/* Center Arrow pointer (Rotates towards Qibla) */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none transition-transform duration-100 ease-out"
            style={{ transform: `rotate(${needleRotation}deg)` }}
          >
            {/* Compass Needle */}
            <div className="relative w-8 h-48 flex flex-col items-center justify-between">
              {/* Pointing to Qibla (Green/Gold tip) */}
              <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[60px] border-b-emerald-700 dark:border-b-emerald-500 filter drop-shadow-md" />
              {/* Pivot */}
              <div className="w-6 h-6 rounded-full bg-amber-400 border-2 border-emerald-900 shadow-md z-10 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-emerald-950" />
              </div>
              {/* Opposite end */}
              <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[50px] border-t-slate-400/50" />
            </div>
          </div>
        </div>

        {/* Stats Below Compass */}
        <div className="grid grid-cols-3 gap-3 w-full mt-6 text-center">
          <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-700/10">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">{t('qiblaAngle')}</span>
            <span className="text-xl font-black text-emerald-800 dark:text-emerald-300 font-mono">
              {qibla.angle}°
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-700/10">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">{t('generalDirection')}</span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1 block">
              {directionName}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-700/10">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">{t('distanceToMakkah')}</span>
            <span className="text-sm font-black text-emerald-800 dark:text-emerald-300 mt-1 block font-mono">
              {language === 'en' ? qibla.distanceKm.toLocaleString('en-US') : qibla.distanceKm.toLocaleString('ar-EG')} {t('kmUnit')}
            </span>
          </div>
        </div>

        {/* Fallback & Sensor Notice */}
        {hasCompassSensor === false && (
          <div className="mt-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 w-full text-xs text-slate-600 dark:text-slate-400 text-center space-y-2">
            <div className="flex items-center justify-center gap-1.5 text-amber-700 dark:text-amber-400 font-bold">
              <ShieldAlert className="w-4 h-4" />
              <span>{t('compassSensorUnavailable')}</span>
            </div>
            <p className="leading-relaxed">
              {t('compassSensorDesc').replace('{angle}', `${qibla.angle}°`).replace('{direction}', directionName)}
            </p>
            {!permissionRequested && (
              <button
                onClick={requestCompassPermission}
                className="mt-2 px-4 py-2 rounded-xl bg-emerald-800 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-sm"
              >
                {t('requestCompassPerm')}
              </button>
            )}
          </div>
        )}

        {/* Manual Calibration Slider */}
        <div className="mt-4 w-full pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-medium">{t('manualCalibration')}:</span>
          <div className="flex items-center gap-2 flex-1 max-w-xs">
            <input
              type="range"
              min="-180"
              max="180"
              value={manualOffset}
              onChange={(e) => setManualOffset(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-600"
            />
            <button
              onClick={() => setManualOffset(0)}
              className="p-1 text-slate-400 hover:text-slate-600"
              title={t('resetCalibration')}
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
