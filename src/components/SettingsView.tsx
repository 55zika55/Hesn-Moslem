import React, { useState, useEffect } from 'react';
import { SettingsState, CalculationMethod, AsrMadhhab, TimeFormat, ThemeMode, Language, AdhanSoundType } from '../types';
import { CITIES_PRESETS, METHOD_PARAMS } from '../utils/prayerCalculator';
import {
  MapPin,
  Clock,
  Bell,
  Volume2,
  Palette,
  BookOpen,
  Compass,
  Globe,
  Database,
  Info,
  RotateCcw,
  Check,
  AlertTriangle,
  Languages,
  Upload,
  Trash2,
  Square,
  Music,
  FileAudio,
  CheckCircle2
} from 'lucide-react';
import { playAdhanAudio, stopAdhanAudio, isAdhanPlaying, subscribeAdhanState } from '../utils/audioAlert';
import { saveCustomAdhanAudio, getCustomAdhanAudio, removeCustomAdhanAudio } from '../utils/customAudioStorage';
import { useTranslation } from '../i18n';
import { PWAInstallButton } from './PWAInstallButton';

interface SettingsViewProps {
  settings: SettingsState;
  onUpdateSettings: (newSettings: SettingsState) => void;
  onResetProgress: () => void;
  onDetectLocation: () => Promise<void>;
  isDetectingLocation: boolean;
  locationError: string | null;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onResetProgress,
  onDetectLocation,
  isDetectingLocation,
  locationError
}) => {
  const { t, isRTL, language } = useTranslation();
  const [saveToast, setSaveToast] = useState(false);
  const [isPlaying, setIsPlaying] = useState(isAdhanPlaying());
  const [customAudioInfo, setCustomAudioInfo] = useState<{ name: string; size: number } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [audioMessage, setAudioMessage] = useState<string | null>(null);

  useEffect(() => {
    return subscribeAdhanState(setIsPlaying);
  }, []);

  useEffect(() => {
    getCustomAdhanAudio().then((data) => {
      if (data) {
        setCustomAudioInfo({ name: data.name, size: data.size });
      }
    });
  }, []);

  const triggerToast = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const update = (patch: Partial<SettingsState>) => {
    const updated = { ...settings, ...patch };
    onUpdateSettings(updated);
    triggerToast();
  };

  const handleToggleAdhan = () => {
    if (isPlaying) {
      stopAdhanAudio();
    } else {
      playAdhanAudio(settings.sound.volume, settings.sound.adhanSoundType);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const saved = await saveCustomAdhanAudio(file);
      setCustomAudioInfo({ name: saved.name, size: saved.size });
      update({
        sound: {
          ...settings.sound,
          adhanSoundType: 'custom_file',
          customFileName: saved.name
        }
      });
      setAudioMessage(t('customFileSaved'));
      setTimeout(() => setAudioMessage(null), 3500);
    } catch (err) {
      console.error('File upload failed:', err);
    } finally {
      setIsUploading(false);
      // reset input
      e.target.value = '';
    }
  };

  const handleRemoveCustomAudio = async () => {
    await removeCustomAdhanAudio();
    setCustomAudioInfo(null);
    update({
      sound: {
        ...settings.sound,
        adhanSoundType: 'takbeer_file',
        customFileName: undefined
      }
    });
    setAudioMessage(t('customFileRemoved'));
    setTimeout(() => setAudioMessage(null), 3500);
  };

  // Group cities by country
  const countries = Array.from(new Set(CITIES_PRESETS.map((c) => c.country)));
  const currentCities = CITIES_PRESETS.filter((c) => c.country === settings.location.country);

  return (
    <div id="settings-view" className="space-y-6 max-w-4xl mx-auto pb-20">
      {/* Toast */}
      {saveToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-amber-300" />
          <span>{t('settingsSaved')}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white dark:bg-[#15201A] rounded-3xl p-6 shadow-sm border border-emerald-900/10 dark:border-emerald-500/10">
        <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">
          {t('settingsTitle')}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {t('settingsSubtitle')}
        </p>
      </div>

      {/* Section: Language Switcher (Prominent at Top) */}
      <div className="bg-white dark:bg-[#15201A] rounded-3xl p-6 shadow-sm border border-emerald-900/10 dark:border-emerald-500/10 space-y-4">
        <div className="flex items-center gap-2.5 text-emerald-800 dark:text-emerald-300 font-bold pb-3 border-b border-slate-100 dark:border-slate-800">
          <Languages className="w-5 h-5 text-emerald-600" />
          <span>{t('appLanguage')}</span>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {t('appLanguageDesc')}
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            {/* Arabic Button */}
            <button
              id="language-btn-ar"
              onClick={() => update({ language: 'ar' })}
              className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between text-start ${
                language === 'ar'
                  ? 'bg-emerald-800 text-white border-emerald-800 shadow-md shadow-emerald-900/20'
                  : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-emerald-50/70 dark:hover:bg-emerald-950/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">🇸🇦</span>
                <div>
                  <div className="text-sm font-black">العربية</div>
                  <div className={`text-[10px] ${language === 'ar' ? 'text-emerald-100' : 'text-slate-400'}`}>
                    Arabic (RTL)
                  </div>
                </div>
              </div>
              {language === 'ar' && (
                <div className="w-6 h-6 rounded-full bg-amber-400 text-emerald-950 flex items-center justify-center font-black text-xs">
                  ✓
                </div>
              )}
            </button>

            {/* English Button */}
            <button
              id="language-btn-en"
              onClick={() => update({ language: 'en' })}
              className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between text-start ${
                language === 'en'
                  ? 'bg-emerald-800 text-white border-emerald-800 shadow-md shadow-emerald-900/20'
                  : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-emerald-50/70 dark:hover:bg-emerald-950/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">🌐</span>
                <div>
                  <div className="text-sm font-black">English</div>
                  <div className={`text-[10px] ${language === 'en' ? 'text-emerald-100' : 'text-slate-400'}`}>
                    الإنجليزية (LTR)
                  </div>
                </div>
              </div>
              {language === 'en' && (
                <div className="w-6 h-6 rounded-full bg-amber-400 text-emerald-950 flex items-center justify-center font-black text-xs">
                  ✓
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 1. الموقع */}
      <div className="bg-white dark:bg-[#15201A] rounded-3xl p-6 shadow-sm border border-emerald-900/10 dark:border-emerald-500/10 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5 text-emerald-800 dark:text-emerald-300 font-bold">
            <MapPin className="w-5 h-5" />
            <span>{t('sec1Location')}</span>
          </div>
          <button
            onClick={onDetectLocation}
            disabled={isDetectingLocation}
            className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>{isDetectingLocation ? t('locatingGps') : t('locateGpsBtn')}</span>
          </button>
        </div>

        {locationError && (
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300/40 text-xs text-amber-800 dark:text-amber-200 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{locationError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Country Selection */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300">{t('countryLabel')}</label>
            <select
              value={settings.location.country}
              onChange={(e) => {
                const newCountry = e.target.value;
                const firstCity = CITIES_PRESETS.find((c) => c.country === newCountry) || CITIES_PRESETS[0];
                update({
                  location: {
                    ...settings.location,
                    country: newCountry,
                    city: firstCity.name,
                    latitude: firstCity.lat,
                    longitude: firstCity.lng,
                    isAuto: false
                  },
                  calculationMethod: firstCity.method
                });
              }}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-medium"
            >
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          {/* City Selection */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300">{t('cityLabel')}</label>
            <select
              value={settings.location.city}
              onChange={(e) => {
                const newCityName = e.target.value;
                const cityObj = CITIES_PRESETS.find((c) => c.name === newCityName && c.country === settings.location.country);
                if (cityObj) {
                  update({
                    location: {
                      ...settings.location,
                      city: cityObj.name,
                      latitude: cityObj.lat,
                      longitude: cityObj.lng,
                      isAuto: false
                    },
                    calculationMethod: cityObj.method
                  });
                }
              }}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-medium"
            >
              {currentCities.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 dark:text-slate-400">
          {t('currentCoords')}: {t('latitude')} <strong>{settings.location.latitude.toFixed(4)}°</strong>، {t('longitude')} <strong>{settings.location.longitude.toFixed(4)}°</strong>
          {settings.location.isAuto && <span className="text-emerald-600 dark:text-emerald-400 font-bold mx-2">{t('gpsAutoDetected')}</span>}
        </div>
      </div>

      {/* 2. مواقيت الصلاة */}
      <div className="bg-white dark:bg-[#15201A] rounded-3xl p-6 shadow-sm border border-emerald-900/10 dark:border-emerald-500/10 space-y-4">
        <div className="flex items-center gap-2.5 text-emerald-800 dark:text-emerald-300 font-bold pb-3 border-b border-slate-100 dark:border-slate-800">
          <Clock className="w-5 h-5" />
          <span>{t('sec2PrayerTimes')}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Method */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              {t('calcMethodLabel')}
            </label>
            <select
              value={settings.calculationMethod}
              onChange={(e) => update({ calculationMethod: e.target.value as CalculationMethod })}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-medium"
            >
              {(Object.keys(METHOD_PARAMS) as CalculationMethod[]).map((key) => (
                <option key={key} value={key}>
                  {isRTL ? METHOD_PARAMS[key].arabicName : METHOD_PARAMS[key].name}
                </option>
              ))}
            </select>
          </div>

          {/* Asr Madhhab */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              {t('asrMadhhabLabel')}
            </label>
            <select
              value={settings.asrMadhhab}
              onChange={(e) => update({ asrMadhhab: e.target.value as AsrMadhhab })}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-medium"
            >
              <option value="Standard">{t('standardMadhhab')}</option>
              <option value="Hanafi">{t('hanafiMadhhab')}</option>
            </select>
          </div>

          {/* Time format */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300">{t('timeFormatLabel')}</label>
            <select
              value={settings.timeFormat}
              onChange={(e) => update({ timeFormat: e.target.value as TimeFormat })}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-medium"
            >
              <option value="12h">{t('time12h')}</option>
              <option value="24h">{t('time24h')}</option>
            </select>
          </div>

          {/* Hijri Adjustment */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              {t('hijriOffsetLabel')}
            </label>
            <select
              value={settings.hijriOffset}
              onChange={(e) => update({ hijriOffset: parseInt(e.target.value, 10) })}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-medium"
            >
              <option value="-2">{t('offsetMinus2')}</option>
              <option value="-1">{t('offsetMinus1')}</option>
              <option value="0">{t('offset0')}</option>
              <option value="1">{t('offsetPlus1')}</option>
              <option value="2">{t('offsetPlus2')}</option>
            </select>
          </div>
        </div>

        {/* Note on Duha rule */}
        <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/50 text-[11px] text-amber-900 dark:text-amber-200">
          {t('duhaRuleNotice')}
        </div>
      </div>

      {/* 3. التنبيهات والإشعارات */}
      <div className="bg-white dark:bg-[#15201A] rounded-3xl p-6 shadow-sm border border-emerald-900/10 dark:border-emerald-500/10 space-y-4">
        <div className="flex items-center gap-2.5 text-emerald-800 dark:text-emerald-300 font-bold pb-3 border-b border-slate-100 dark:border-slate-800">
          <Bell className="w-5 h-5" />
          <span>{t('sec3Notifications')}</span>
        </div>

        <div className="space-y-3 text-xs">
          {/* Prayer alert toggles */}
          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 cursor-pointer">
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">{t('fardPrayersAlert')}</span>
              <span className="text-[11px] text-slate-500">{t('fardPrayersAlertDesc')}</span>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.enabled}
              onChange={(e) =>
                update({
                  notifications: { ...settings.notifications, enabled: e.target.checked }
                })
              }
              className="w-4 h-4 accent-emerald-600 rounded"
            />
          </label>

          {/* Sunrise alert toggle */}
          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 cursor-pointer">
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">{t('sunriseAlert')}</span>
              <span className="text-[11px] text-slate-500">{t('sunriseAlertDesc')}</span>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.sunrise}
              onChange={(e) =>
                update({
                  notifications: { ...settings.notifications, sunrise: e.target.checked }
                })
              }
              className="w-4 h-4 accent-emerald-600 rounded"
            />
          </label>

          {/* Morning & Evening Azkar reminders */}
          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 cursor-pointer">
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">{t('morningAzkarReminder')}</span>
              <span className="text-[11px] text-slate-500">{t('morningAzkarReminderDesc')}</span>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.morningAzkar}
              onChange={(e) =>
                update({
                  notifications: { ...settings.notifications, morningAzkar: e.target.checked }
                })
              }
              className="w-4 h-4 accent-emerald-600 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 cursor-pointer">
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">{t('eveningAzkarReminder')}</span>
              <span className="text-[11px] text-slate-500">{t('eveningAzkarReminderDesc')}</span>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.eveningAzkar}
              onChange={(e) =>
                update({
                  notifications: { ...settings.notifications, eveningAzkar: e.target.checked }
                })
              }
              className="w-4 h-4 accent-emerald-600 rounded"
            />
          </label>

          {/* Special Pre-Prayer Tasbeeh reminder: سبحان الله وبحمده قبل الفجر والعصر والمغرب والعشاء */}
          <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-700/15 space-y-2">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="font-bold text-emerald-900 dark:text-emerald-200 block">
                  {t('subhanAllahAlert')}
                </span>
                <span className="text-[11px] text-slate-600 dark:text-slate-400">
                  {t('subhanAllahAlertDesc')}
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.subhanAllahPrePrayer}
                onChange={(e) =>
                  update({
                    notifications: { ...settings.notifications, subhanAllahPrePrayer: e.target.checked }
                  })
                }
                className="w-4 h-4 accent-emerald-600 rounded"
              />
            </label>

            {settings.notifications.subhanAllahPrePrayer && (
              <div className="flex items-center justify-between pt-2 border-t border-emerald-800/10">
                <span className="text-slate-600 dark:text-slate-300 font-medium">{t('alertMinutesBefore')}</span>
                <select
                  value={settings.notifications.prePrayerMinutes}
                  onChange={(e) =>
                    update({
                      notifications: {
                        ...settings.notifications,
                        prePrayerMinutes: parseInt(e.target.value, 10)
                      }
                    })
                  }
                  className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold"
                >
                  <option value="10">{t('min10')}</option>
                  <option value="15">{t('min15')}</option>
                  <option value="20">{t('min20')}</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. الصوت */}
      <div className="bg-white dark:bg-[#15201A] rounded-3xl p-6 shadow-sm border border-emerald-900/10 dark:border-emerald-500/10 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5 text-emerald-800 dark:text-emerald-300 font-bold">
            <Volume2 className="w-5 h-5" />
            <span>{t('sec4Sound')}</span>
          </div>
          {isPlaying && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[11px] font-bold animate-pulse">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              {t('playingAdhanBadge')}
            </span>
          )}
        </div>

        <div className="space-y-4 text-xs">
          {/* Audio toggle */}
          <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 cursor-pointer">
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block text-sm">{t('enableTakbeerSound')}</span>
              <span className="text-[11px] text-slate-500">{t('takbeerSoundDesc')}</span>
            </div>
            <input
              type="checkbox"
              checked={settings.sound.enabled}
              onChange={(e) =>
                update({ sound: { ...settings.sound, enabled: e.target.checked } })
              }
              className="w-4 h-4 accent-emerald-600 rounded"
            />
          </label>

          {/* Adhan Sound Choice */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 space-y-3">
            <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs">
              {t('adhanSoundTypeLabel')}
            </span>

            <div className="space-y-2">
              {[
                {
                  id: 'takbeer_file' as AdhanSoundType,
                  title: t('soundTypeTakbeerFile'),
                  desc: t('soundTypeTakbeerFileDesc'),
                  badge: 'موصى به'
                },
                {
                  id: 'takbeer_double' as AdhanSoundType,
                  title: t('soundTypeTakbeerDouble'),
                  desc: t('soundTypeTakbeerDoubleDesc')
                },
                {
                  id: 'full_adhan' as AdhanSoundType,
                  title: t('soundTypeFullAdhan'),
                  desc: t('soundTypeFullAdhanDesc')
                },
                {
                  id: 'custom_file' as AdhanSoundType,
                  title: t('soundTypeCustomFile'),
                  desc: customAudioInfo
                    ? `${customAudioInfo.name} (${(customAudioInfo.size / (1024 * 1024)).toFixed(2)} MB)`
                    : t('soundTypeCustomFileDesc')
                },
                {
                  id: 'synth' as AdhanSoundType,
                  title: t('soundTypeSynth'),
                  desc: t('soundTypeSynthDesc')
                }
              ].map((opt) => {
                const isSelected = (settings.sound.adhanSoundType || 'takbeer_file') === opt.id;
                return (
                  <label
                    key={opt.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-600 dark:border-emerald-500'
                        : 'bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="adhanSoundType"
                      checked={isSelected}
                      onChange={() =>
                        update({
                          sound: {
                            ...settings.sound,
                            adhanSoundType: opt.id
                          }
                        })
                      }
                      className="mt-0.5 w-4 h-4 accent-emerald-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${isSelected ? 'text-emerald-800 dark:text-emerald-300' : 'text-slate-800 dark:text-slate-200'}`}>
                          {opt.title}
                        </span>
                        {opt.badge && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-700 text-white">
                            {opt.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        {opt.desc}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>

            {/* Custom file upload box */}
            <div className="mt-3 p-3 rounded-xl border border-dashed border-emerald-700/30 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-semibold text-xs">
                  <FileAudio className="w-4 h-4" />
                  <span>{t('uploadCustomAdhanBtn')}</span>
                </div>
                {customAudioInfo && (
                  <button
                    onClick={handleRemoveCustomAudio}
                    className="flex items-center gap-1 text-[11px] text-rose-600 hover:text-rose-700 font-bold"
                    title={t('removeCustomAdhanBtn')}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{t('removeCustomAdhanBtn')}</span>
                  </button>
                )}
              </div>
              <p className="text-[11px] text-slate-500">
                {t('uploadCustomAdhanDesc')}
              </p>
              
              <div className="flex items-center gap-3">
                <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-sm">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploading ? 'جاري التحميل...' : t('uploadCustomAdhanBtn')}</span>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {customAudioInfo && (
                  <span className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="truncate max-w-[200px]">{customAudioInfo.name}</span>
                  </span>
                )}
              </div>

              {audioMessage && (
                <div className="mt-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/60 dark:bg-emerald-900/40 p-2 rounded-lg">
                  {audioMessage}
                </div>
              )}
            </div>
          </div>

          {/* Volume slider */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 space-y-2">
            <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-300">
              <span>{t('volumeLevel')}</span>
              <span className="font-mono">{Math.round(settings.sound.volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.sound.volume}
              onChange={(e) =>
                update({ sound: { ...settings.sound, volume: parseFloat(e.target.value) } })
              }
              className="w-full accent-emerald-600"
            />
          </div>

          {/* Test / Play / Stop button */}
          <button
            onClick={handleToggleAdhan}
            className={`w-full py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-sm ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-700 text-white animate-pulse'
                : 'bg-emerald-800 hover:bg-emerald-700 text-white'
            }`}
          >
            {isPlaying ? (
              <>
                <Square className="w-4 h-4 fill-current" />
                <span>{t('stopAdhanNow')}</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                <span>{t('testTakbeerNow')}</span>
              </>
            )}
          </button>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-100 dark:bg-slate-900/60 p-3 rounded-xl">
            {t('takbeerRuleNote')}
          </p>
        </div>
      </div>

      {/* 5. المظهر */}
      <div className="bg-white dark:bg-[#15201A] rounded-3xl p-6 shadow-sm border border-emerald-900/10 dark:border-emerald-500/10 space-y-4">
        <div className="flex items-center gap-2.5 text-emerald-800 dark:text-emerald-300 font-bold pb-3 border-b border-slate-100 dark:border-slate-800">
          <Palette className="w-5 h-5" />
          <span>{t('sec5Appearance')}</span>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs">
          {[
            { id: 'light', label: t('themeLight') },
            { id: 'dark', label: t('themeDark') },
            { id: 'auto', label: t('themeAuto') }
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() =>
                update({
                  appearance: { ...settings.appearance, theme: mode.id as ThemeMode }
                })
              }
              className={`p-3 rounded-2xl border font-bold transition-all ${
                settings.appearance.theme === mode.id
                  ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-emerald-50'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* 6. الأذكار والعرض */}
      <div className="bg-white dark:bg-[#15201A] rounded-3xl p-6 shadow-sm border border-emerald-900/10 dark:border-emerald-500/10 space-y-4">
        <div className="flex items-center gap-2.5 text-emerald-800 dark:text-emerald-300 font-bold pb-3 border-b border-slate-100 dark:border-slate-800">
          <BookOpen className="w-5 h-5" />
          <span>{t('sec6AzkarDisplay')}</span>
        </div>

        <div className="space-y-2.5 text-xs">
          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 cursor-pointer">
            <span className="font-semibold text-slate-700 dark:text-slate-300">{t('showHadithSource')}</span>
            <input
              type="checkbox"
              checked={settings.azkarDisplay.showSource}
              onChange={(e) =>
                update({
                  azkarDisplay: { ...settings.azkarDisplay, showSource: e.target.checked }
                })
              }
              className="w-4 h-4 accent-emerald-600 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 cursor-pointer">
            <span className="font-semibold text-slate-700 dark:text-slate-300">{t('showRepetitionDots')}</span>
            <input
              type="checkbox"
              checked={settings.azkarDisplay.showTargetCount}
              onChange={(e) =>
                update({
                  azkarDisplay: { ...settings.azkarDisplay, showTargetCount: e.target.checked }
                })
              }
              className="w-4 h-4 accent-emerald-600 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 cursor-pointer">
            <span className="font-semibold text-slate-700 dark:text-slate-300">{t('autoAdvanceNext')}</span>
            <input
              type="checkbox"
              checked={settings.azkarDisplay.autoAdvance}
              onChange={(e) =>
                update({
                  azkarDisplay: { ...settings.azkarDisplay, autoAdvance: e.target.checked }
                })
              }
              className="w-4 h-4 accent-emerald-600 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 cursor-pointer">
            <span className="font-semibold text-slate-700 dark:text-slate-300">{t('hapticVibration')}</span>
            <input
              type="checkbox"
              checked={settings.azkarDisplay.vibrateOnCount}
              onChange={(e) =>
                update({
                  azkarDisplay: { ...settings.azkarDisplay, vibrateOnCount: e.target.checked }
                })
              }
              className="w-4 h-4 accent-emerald-600 rounded"
            />
          </label>

          <div className="pt-2">
            <button
              onClick={() => {
                if (window.confirm(t('confirmResetToday'))) {
                  onResetProgress();
                }
              }}
              className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t('resetTodayBtn')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 7. القبلة والبيانات */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Qibla display settings */}
        <div className="bg-white dark:bg-[#15201A] rounded-3xl p-6 shadow-sm border border-emerald-900/10 dark:border-emerald-500/10 space-y-4">
          <div className="flex items-center gap-2.5 text-emerald-800 dark:text-emerald-300 font-bold pb-3 border-b border-slate-100 dark:border-slate-800">
            <Compass className="w-5 h-5" />
            <span>{t('sec7Qibla')}</span>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="font-semibold text-slate-700 dark:text-slate-300">{t('showAngleDegrees')}</span>
              <input
                type="checkbox"
                checked={settings.qiblaDisplay.showDegrees}
                onChange={(e) =>
                  update({
                    qiblaDisplay: { ...settings.qiblaDisplay, showDegrees: e.target.checked }
                  })
                }
                className="w-4 h-4 accent-emerald-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="font-semibold text-slate-700 dark:text-slate-300">{t('showMakkahDistance')}</span>
              <input
                type="checkbox"
                checked={settings.qiblaDisplay.showDistance}
                onChange={(e) =>
                  update({
                    qiblaDisplay: { ...settings.qiblaDisplay, showDistance: e.target.checked }
                  })
                }
                className="w-4 h-4 accent-emerald-600 rounded"
              />
            </label>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-emerald-600" />
                <span>{t('currentLanguage')}:</span>
              </span>
              <span className="font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-lg">
                {language === 'ar' ? 'العربية (RTL)' : 'English (LTR)'}
              </span>
            </div>
          </div>
        </div>

        {/* PWA Offline & Install on Devices (Windows & Android) */}
        <PWAInstallButton variant="settings" />

        {/* Data & Backup */}
        <div className="bg-white dark:bg-[#15201A] rounded-3xl p-6 shadow-sm border border-emerald-900/10 dark:border-emerald-500/10 space-y-4">
          <div className="flex items-center gap-2.5 text-emerald-800 dark:text-emerald-300 font-bold pb-3 border-b border-slate-100 dark:border-slate-800">
            <Database className="w-5 h-5" />
            <span>{t('sec8Data')}</span>
          </div>

          <div className="space-y-3 text-xs">
            <p className="text-slate-500 leading-relaxed">
              {t('dataStorageNotice')}
            </p>

            <button
              onClick={() => {
                if (window.confirm(t('confirmRestoreDefaults'))) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className="w-full py-2.5 px-3 rounded-xl border border-rose-300 dark:border-rose-900/50 text-rose-700 dark:text-rose-400 text-xs font-bold hover:bg-rose-50 transition-colors"
            >
              {t('restoreDefaultsBtn')}
            </button>
          </div>
        </div>
      </div>

      {/* 9. حول التطبيق والدقة الشرعية */}
      <div className="bg-white dark:bg-[#15201A] rounded-3xl p-6 shadow-sm border border-emerald-900/10 dark:border-emerald-500/10 space-y-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-300 font-extrabold text-sm pb-2 border-b border-slate-100 dark:border-slate-800">
          <Info className="w-4 h-4" />
          <span>{t('aboutTitle')}</span>
        </div>

        <p>
          • <strong>{t('aboutVersion')}:</strong> 1.0.0 ({t('offlineReady')}).
        </p>
        <p>
          • <strong>{t('aboutSourcesTitle')}:</strong> {t('aboutSourcesText')}
        </p>
        <p>
          • <strong>{t('aboutCalcTitle')}:</strong> {t('aboutCalcText')}
        </p>
        <p className="text-[11px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-3 rounded-xl border border-amber-200/60">
          {t('aboutDisclaimer')}
        </p>
      </div>
    </div>
  );
};
