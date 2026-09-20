import React, { useState, useMemo } from 'react';
import { ZikrItem, SettingsState } from '../types';
import {
  CheckCircle,
  RotateCcw,
  Search,
  Bookmark,
  BookmarkCheck,
  Share2,
  Copy,
  Check,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  LayoutList,
  Maximize2
} from 'lucide-react';
import { playClickSound, playCompletionChime } from '../utils/audioAlert';
import { useTranslation } from '../i18n';

interface AzkarViewProps {
  category: 'morning' | 'evening';
  items: ZikrItem[];
  counts: Record<string, number>;
  favorites: string[];
  settings: SettingsState;
  onUpdateCount: (id: string, newCount: number) => void;
  onResetCount: (id: string) => void;
  onResetAll: () => void;
  onToggleFavorite: (id: string) => void;
}

export const AzkarView: React.FC<AzkarViewProps> = ({
  category,
  items,
  counts,
  favorites,
  settings,
  onUpdateCount,
  onResetCount,
  onResetAll,
  onToggleFavorite
}) => {
  const { t, isRTL, language } = useTranslation();
  const isMorning = category === 'morning';
  const title = isMorning ? t('morningAzkarTitle') : t('eveningAzkarTitle');
  const subtitle = isMorning
    ? t('morningSubtitle')
    : t('eveningSubtitle');

  // Local states
  const [filterType, setFilterType] = useState<'all' | 'base' | 'additional' | 'favorites'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'focus'>('cards');
  const [focusIndex, setFocusIndex] = useState(0);
  const [copySuccessId, setCopySuccessId] = useState<string | null>(null);
  const [fontSizeDelta, setFontSizeDelta] = useState(settings.appearance.fontSizeOffset);

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Tab filter
      if (filterType === 'base' && !item.isBaseSource) return false;
      if (filterType === 'additional' && item.isBaseSource) return false;
      if (filterType === 'favorites' && !favorites.includes(item.id)) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const inText = item.text.toLowerCase().includes(query);
        const inSource = item.source.toLowerCase().includes(query);
        const inVirtue = item.virtue ? item.virtue.toLowerCase().includes(query) : false;
        return inText || inSource || inVirtue;
      }
      return true;
    });
  }, [items, filterType, searchQuery, favorites]);

  // Overall progress
  const completedCount = useMemo(() => {
    return items.filter((item) => (counts[item.id] || 0) >= item.targetCount).length;
  }, [items, counts]);

  const progressPercent = Math.round((completedCount / (items.length || 1)) * 100);

  // Handling Tap to Increment
  const handleIncrement = (item: ZikrItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const current = counts[item.id] || 0;
    if (current >= item.targetCount) return;

    const next = current + 1;
    onUpdateCount(item.id, next);

    // Audio & Haptic feedback
    if (settings.azkarDisplay.soundOnCount) {
      if (next >= item.targetCount) {
        playCompletionChime();
      } else {
        playClickSound(0.3);
      }
    }

    if (settings.azkarDisplay.vibrateOnCount && navigator.vibrate) {
      if (next >= item.targetCount) {
        navigator.vibrate([40, 60, 80]);
      } else {
        navigator.vibrate(30);
      }
    }

    // Auto advance in focus mode
    if (viewMode === 'focus' && settings.azkarDisplay.autoAdvance && next >= item.targetCount) {
      setTimeout(() => {
        if (focusIndex < filteredItems.length - 1) {
          setFocusIndex((prev) => prev + 1);
        }
      }, 400);
    }
  };

  // Copy Zikr text
  const handleCopy = (item: ZikrItem) => {
    const textToCopy = `${item.text}\n\n[${t('source')}: ${item.source}]\n[${t('requiredCount')}: ${item.targetCount} ${t('times')}]`;
    navigator.clipboard.writeText(textToCopy);
    setCopySuccessId(item.id);
    setTimeout(() => setCopySuccessId(null), 2000);
  };

  // Share via Web Share API or WhatsApp
  const handleShare = (item: ZikrItem) => {
    const shareText = `${item.text}\n\n${t('source')}: ${item.source}\n${t('appName')}`;
    if (navigator.share) {
      navigator.share({
        title: title,
        text: shareText
      }).catch(() => {});
    } else {
      const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
      window.open(waUrl, '_blank');
    }
  };

  // Font size calculation
  const getFontSizeClass = () => {
    if (fontSizeDelta <= -1) return 'text-base leading-relaxed';
    if (fontSizeDelta === 0) return 'text-lg leading-loose';
    if (fontSizeDelta === 1) return 'text-xl leading-[2.2]';
    if (fontSizeDelta >= 2) return 'text-2xl leading-[2.4]';
    return 'text-lg leading-loose';
  };

  const NextArrow = isRTL ? ChevronLeft : ChevronRight;
  const PrevArrow = isRTL ? ChevronRight : ChevronLeft;

  return (
    <div id={`azkar-${category}-view`} className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Header Banner */}
      <div
        className={`rounded-3xl p-6 text-white shadow-lg relative overflow-hidden ${
          isMorning
            ? 'bg-gradient-to-br from-amber-700 via-emerald-800 to-emerald-950'
            : 'bg-gradient-to-br from-slate-900 via-indigo-950 to-emerald-950'
        }`}
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-bold mb-2">
              <BookOpen className="w-3.5 h-3.5 text-amber-300" />
              <span>{t('authenticatedSourcesBadge')}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black">{title}</h2>
            <p className="text-xs md:text-sm text-emerald-100/90 mt-1 max-w-xl">{subtitle}</p>
          </div>

          {/* Progress Indicator */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 min-w-[190px] flex flex-col items-center">
            <div className="text-xs font-semibold text-emerald-200 mb-1">{t('dailyProgressRate')}</div>
            <div className="text-3xl font-black text-amber-300 font-mono">
              {completedCount} / {items.length}
            </div>
            <div className="w-full bg-black/20 rounded-full h-2 mt-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-300 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[11px] text-emerald-100/80 mt-1 font-bold">
              {progressPercent === 100 ? t('azkarAllDone') : `${progressPercent}% ${t('completedBadge')}`}
            </span>
          </div>
        </div>
      </div>

      {/* Control Bar: Search, Category Filters, Display Mode, Font Size */}
      <div className="bg-white dark:bg-[#15201A] rounded-2xl p-4 shadow-sm border border-emerald-900/10 dark:border-emerald-500/10 space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className={`absolute ${isRTL ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
          <input
            id="azkar-search-input"
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full ${isRTL ? 'pl-4 pr-10' : 'pr-4 pl-10'} py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:text-slate-100`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 px-1`}
            >
              {t('clearSearch')}
            </button>
          )}
        </div>

        {/* Filters and View toggles */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Category tabs */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
            <button
              id="filter-tab-all"
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filterType === 'all'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50'
              }`}
            >
              {t('tabAll')} ({items.length})
            </button>
            <button
              id="filter-tab-base"
              onClick={() => setFilterType('base')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filterType === 'base'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50'
              }`}
            >
              {t('tabBase')} ({items.filter((i) => i.isBaseSource).length})
            </button>
            <button
              id="filter-tab-additional"
              onClick={() => setFilterType('additional')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filterType === 'additional'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50'
              }`}
            >
              {t('tabAdditional')} ({items.filter((i) => !i.isBaseSource).length})
            </button>
            <button
              id="filter-tab-favorites"
              onClick={() => setFilterType('favorites')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
                filterType === 'favorites'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-500" />
              <span>{t('tabFavorites')} ({favorites.length})</span>
            </button>
          </div>

          {/* View mode and Font size controls */}
          <div className="flex items-center gap-2 me-auto">
            {/* Font size */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1 text-xs">
              <button
                onClick={() => setFontSizeDelta((p) => Math.max(-1, p - 1))}
                className="px-2 py-0.5 text-slate-700 dark:text-slate-300 font-bold hover:bg-white dark:hover:bg-slate-700 rounded"
                title={t('decreaseFont')}
              >
                A-
              </button>
              <span className="px-1 text-[11px] text-slate-500">{t('fontSizeLabel')}</span>
              <button
                onClick={() => setFontSizeDelta((p) => Math.min(3, p + 1))}
                className="px-2 py-0.5 text-slate-700 dark:text-slate-300 font-bold hover:bg-white dark:hover:bg-slate-700 rounded"
                title={t('increaseFont')}
              >
                A+
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
              <button
                id="view-mode-cards"
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'cards'
                    ? 'bg-white dark:bg-slate-700 text-emerald-800 dark:text-emerald-300 shadow-sm'
                    : 'text-slate-500'
                }`}
                title={t('viewModeCards')}
              >
                <LayoutList className="w-4 h-4" />
              </button>
              <button
                id="view-mode-focus"
                onClick={() => setViewMode('focus')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'focus'
                    ? 'bg-white dark:bg-slate-700 text-emerald-800 dark:text-emerald-300 shadow-sm'
                    : 'text-slate-500'
                }`}
                title={t('viewModeFocus')}
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Reset All button */}
            <button
              id="reset-today-progress-btn"
              onClick={() => {
                if (window.confirm(`${t('confirmResetPrefix')} ${title}?`)) {
                  onResetAll();
                }
              }}
              className="text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 p-1.5 rounded-lg flex items-center gap-1 font-semibold transition-colors"
              title={t('resetTodayBtn')}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('resetBtn')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: Standard Cards List */}
      {viewMode === 'cards' && (
        <div className="space-y-4">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-[#15201A] rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
              <p className="text-slate-500 text-sm">{t('noAzkarFound')}</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterType('all');
                }}
                className="mt-3 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
              >
                {t('showAllAzkar')}
              </button>
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const count = counts[item.id] || 0;
              const isCompleted = count >= item.targetCount;
              const isFav = favorites.includes(item.id);

              return (
                <div
                  key={item.id}
                  id={`zikr-card-${item.id}`}
                  onClick={() => handleIncrement(item)}
                  className={`relative rounded-3xl p-5 md:p-6 transition-all duration-200 border select-none cursor-pointer group ${
                    isCompleted
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500/30 dark:border-emerald-500/20 shadow-sm'
                      : 'bg-white dark:bg-[#15201A] border-emerald-900/10 dark:border-emerald-500/10 hover:border-emerald-500/40 shadow-sm'
                  }`}
                >
                  {/* Top card bar: Number, Source badge, Action buttons */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center text-xs font-extrabold font-mono">
                        {index + 1}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.isBaseSource
                            ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-700/20'
                            : 'bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-700/20'
                        }`}
                      >
                        {item.isBaseSource ? t('baseSourceBadge') : t('additionalSourceBadge')}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Favorite Button */}
                      <button
                        id={`fav-btn-${item.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(item.id);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 transition-colors"
                        title={isFav ? t('removeFromFav') : t('addToFav')}
                      >
                        {isFav ? (
                          <BookmarkCheck className="w-4 h-4 text-amber-500 fill-amber-500" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>

                      {/* Share Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare(item);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 transition-colors"
                        title={t('shareZikr')}
                      >
                        <Share2 className="w-4 h-4" />
                      </button>

                      {/* Copy Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(item);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 transition-colors"
                        title={t('copyZikr')}
                      >
                        {copySuccessId === item.id ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>

                      {/* Reset Button */}
                      {count > 0 && (
                        <button
                          id={`reset-btn-${item.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onResetCount(item.id);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 transition-colors"
                          title={t('resetRepeat')}
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Zikr Arabic Text (Always in pristine Arabic text) */}
                  <p
                    dir="rtl"
                    className={`font-amiri ${getFontSizeClass()} text-slate-900 dark:text-slate-50 tracking-wide font-medium my-3 text-right leading-loose`}
                  >
                    {item.text}
                  </p>

                  {/* Source & Virtue */}
                  {settings.azkarDisplay.showSource && (
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs space-y-1">
                      <div className="text-emerald-800 dark:text-emerald-300 font-semibold flex items-center gap-1.5">
                        <span>{t('source')}:</span>
                        <span className="font-normal text-slate-600 dark:text-slate-300">{item.source}</span>
                      </div>
                      {item.virtue && (
                        <div className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                          <span className="font-semibold text-amber-700 dark:text-amber-300">{t('virtue')}: </span>
                          {item.virtue}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Repetition Footer: Dots + Counter button */}
                  <div className="mt-4 pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800/80">
                    {/* Visual Dots / Pills */}
                    <div className="flex items-center gap-1.5">
                      {item.targetCount <= 10 ? (
                        Array.from({ length: item.targetCount }).map((_, dotIdx) => (
                          <span
                            key={dotIdx}
                            className={`w-3 h-3 rounded-full transition-all duration-200 ${
                              dotIdx < count
                                ? 'bg-emerald-600 dark:bg-emerald-400 scale-110'
                                : 'bg-slate-200 dark:bg-slate-700'
                            }`}
                          />
                        ))
                      ) : (
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {t('requiredCount')}: {item.targetCount} {t('times')}
                        </span>
                      )}
                    </div>

                    {/* Action Counter button */}
                    <div className="flex items-center gap-2">
                      <button
                        id={`count-btn-${item.id}`}
                        onClick={(e) => handleIncrement(item, e)}
                        disabled={isCompleted}
                        className={`py-2 px-4 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
                          isCompleted
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 cursor-default'
                            : 'bg-emerald-700 hover:bg-emerald-600 active:scale-95 text-white shadow-sm'
                        }`}
                      >
                        {isCompleted ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                            <span>{t('completed')} ({item.targetCount})</span>
                          </>
                        ) : (
                          <>
                            <span>{t('tapToCount')}</span>
                            <span className="bg-emerald-900/60 px-2 py-0.5 rounded-full font-mono text-[11px]">
                              {count} / {item.targetCount}
                            </span>
                          </>
                        )}
                      </button>

                      {count > 0 && !isCompleted && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onUpdateCount(item.id, item.targetCount);
                          }}
                          className="text-[11px] font-semibold text-slate-500 hover:text-emerald-700 dark:hover:text-emerald-400 px-2 py-1"
                        >
                          {t('doneMark')}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* VIEW MODE 2: Focused Single-Zikr Reader */}
      {viewMode === 'focus' && filteredItems.length > 0 && (
        <div className="bg-white dark:bg-[#15201A] rounded-3xl p-6 md:p-8 shadow-md border border-emerald-900/10 dark:border-emerald-500/10 space-y-6">
          {/* Header of focus card */}
          {(() => {
            const currentItem = filteredItems[focusIndex] || filteredItems[0];
            const count = counts[currentItem.id] || 0;
            const isCompleted = count >= currentItem.targetCount;
            const isFav = favorites.includes(currentItem.id);

            return (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-emerald-800 dark:text-emerald-300">
                      {t('zikrNumber')} {focusIndex + 1} / {filteredItems.length}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        currentItem.isBaseSource
                          ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {currentItem.isBaseSource ? t('baseSourceBadge') : t('additionalSourceBadge')}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onToggleFavorite(currentItem.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-amber-500"
                      title={isFav ? t('removeFromFav') : t('addToFav')}
                    >
                      {isFav ? (
                        <BookmarkCheck className="w-5 h-5 text-amber-500 fill-amber-500" />
                      ) : (
                        <Bookmark className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleShare(currentItem)}
                      className="p-2 rounded-lg text-slate-400 hover:text-emerald-600"
                      title={t('shareZikr')}
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onResetCount(currentItem.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-500"
                      title={t('resetRepeat')}
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Main Large Text */}
                <div
                  onClick={() => handleIncrement(currentItem)}
                  className="p-6 md:p-10 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 cursor-pointer active:scale-[0.99] transition-transform min-h-[180px] flex items-center justify-center text-center"
                >
                  <p
                    dir="rtl"
                    className={`font-amiri ${getFontSizeClass()} text-slate-900 dark:text-slate-100 leading-loose font-medium`}
                  >
                    {currentItem.text}
                  </p>
                </div>

                {/* Source & Virtue */}
                <div className="text-xs space-y-1 text-center max-w-xl mx-auto">
                  <p className="text-emerald-800 dark:text-emerald-300 font-semibold">
                    {t('source')}: <span className="font-normal text-slate-600 dark:text-slate-400">{currentItem.source}</span>
                  </p>
                  {currentItem.virtue && (
                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                      {currentItem.virtue}
                    </p>
                  )}
                </div>

                {/* Repetition Visual Dots & Big Tap Counter */}
                <div className="flex flex-col items-center space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    {currentItem.targetCount <= 10 ? (
                      Array.from({ length: currentItem.targetCount }).map((_, dotIdx) => (
                        <span
                          key={dotIdx}
                          className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                            dotIdx < count
                              ? 'bg-emerald-600 scale-125'
                              : 'bg-slate-200 dark:bg-slate-700'
                          }`}
                        />
                      ))
                    ) : (
                      <span className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
                        {t('requiredCount')}: {currentItem.targetCount} {t('times')}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleIncrement(currentItem)}
                    className={`w-full max-w-xs py-4 px-6 rounded-2xl font-extrabold text-base transition-all flex items-center justify-center gap-3 shadow-lg ${
                      isCompleted
                        ? 'bg-emerald-800 text-white'
                        : 'bg-emerald-700 hover:bg-emerald-600 active:scale-95 text-white'
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-amber-300" />
                        <span>{t('completed')} ({currentItem.targetCount} / {currentItem.targetCount})</span>
                      </>
                    ) : (
                      <>
                        <span>{t('tasbeehTap')}</span>
                        <span className="bg-emerald-950 px-3 py-1 rounded-full text-amber-300 font-mono text-sm">
                          {count} / {currentItem.targetCount}
                        </span>
                      </>
                    )}
                  </button>
                </div>

                {/* Focus Navigation Bar (Previous / Next) */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    disabled={focusIndex === 0}
                    onClick={() => setFocusIndex((p) => Math.max(0, p - 1))}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <PrevArrow className="w-4 h-4" />
                    <span>{t('prevZikr')}</span>
                  </button>

                  <span className="text-xs font-mono text-slate-400">
                    {focusIndex + 1} / {filteredItems.length}
                  </span>

                  <button
                    disabled={focusIndex >= filteredItems.length - 1}
                    onClick={() => setFocusIndex((p) => Math.min(filteredItems.length - 1, p + 1))}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950 disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <span>{t('nextZikr')}</span>
                    <NextArrow className="w-4 h-4" />
                  </button>
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
};
