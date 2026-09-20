import React, { useState, useEffect, useMemo, useRef } from 'react';
import { SettingsState, SurahMeta, AyahItem, QuranBookmark } from '../types';
import { ALL_SURAHS, fetchSurahAyahs } from '../data/quranSurahs';
import {
  loadQuranBookmark,
  saveQuranBookmark,
  removeQuranBookmark,
  loadFavoriteSurahs,
  toggleFavoriteSurah
} from '../utils/quranStorage';
import {
  Search,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ArrowRight,
  ArrowLeft,
  Share2,
  Copy,
  Check,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Eye,
  EyeOff,
  Type,
  Compass,
  HardDrive,
  CheckCircle2,
  Image as ImageIcon,
  Trash2
} from 'lucide-react';
import { useTranslation } from '../i18n';
import {
  getMushafPageImageUrl,
  preloadMushafPage,
  isMushafPageCached
} from '../utils/cacheManager';
import { CacheManagerModal } from './CacheManagerModal';

interface QuranViewProps {
  settings: SettingsState;
}

export const QuranView: React.FC<QuranViewProps> = ({ settings }) => {
  const { t, isRTL, language } = useTranslation();

  // State
  const [selectedSurahNumber, setSelectedSurahNumber] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'meccan' | 'medinan' | 'favorites'>('all');
  const [favoriteSurahs, setFavoriteSurahs] = useState<number[]>(loadFavoriteSurahs());
  const [currentBookmark, setCurrentBookmark] = useState<QuranBookmark | null>(loadQuranBookmark());
  const [bookmarkNotification, setBookmarkNotification] = useState<'saved' | 'removed' | null>(null);
  const [isCacheModalOpen, setIsCacheModalOpen] = useState(false);

  // View mode & Mushaf Page state
  const [viewMode, setViewMode] = useState<'text' | 'mushaf'>('text');
  const [mushafPage, setMushafPage] = useState<number>(1);
  const [isPageCached, setIsPageCached] = useState<boolean>(false);
  const [isCachingPage, setIsCachingPage] = useState<boolean>(false);
  const [pageImgError, setPageImgError] = useState<boolean>(false);

  // Reader state
  const [ayahs, setAyahs] = useState<AyahItem[]>([]);
  const [isLoadingAyahs, setIsLoadingAyahs] = useState(false);
  const [fontSizeDelta, setFontSizeDelta] = useState(0); // -1, 0, 1, 2, 3
  const [showTranslation, setShowTranslation] = useState(false);
  const [copiedAyah, setCopiedAyah] = useState<number | null>(null);

  // Audio state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const activeSurahMeta: SurahMeta | undefined = useMemo(() => {
    if (!selectedSurahNumber) return undefined;
    return ALL_SURAHS.find((s) => s.number === selectedSurahNumber);
  }, [selectedSurahNumber]);

  // Load Surah Ayahs when selectedSurahNumber changes
  useEffect(() => {
    if (!selectedSurahNumber) {
      setAyahs([]);
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlayingAudio(false);
      return;
    }

    setIsLoadingAyahs(true);
    // Pause audio when switching surahs
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlayingAudio(false);
    setAudioCurrentTime(0);

    fetchSurahAyahs(selectedSurahNumber)
      .then((items) => {
        setAyahs(items);
        setIsLoadingAyahs(false);
        // Scroll to top of reader
        window.scrollTo({ top: 0, behavior: 'smooth' });
      })
      .catch(() => {
        setIsLoadingAyahs(false);
      });
  }, [selectedSurahNumber]);

  // Synchronize initial mushaf page when surah changes
  useEffect(() => {
    if (activeSurahMeta) {
      setMushafPage(activeSurahMeta.page);
    }
  }, [activeSurahMeta]);

  // Handle page caching and adjacent page preloading
  useEffect(() => {
    if (!mushafPage) return;
    setPageImgError(false);
    isMushafPageCached(mushafPage).then((cached) => {
      setIsPageCached(cached);
      if (!cached) {
        setIsCachingPage(true);
        preloadMushafPage(mushafPage).then((ok) => {
          setIsCachingPage(false);
          if (ok) setIsPageCached(true);
        });
      }
    });

    // Background preload adjacent pages for smooth navigation
    if (mushafPage < 604) preloadMushafPage(mushafPage + 1);
    if (mushafPage > 1) preloadMushafPage(mushafPage - 1);
  }, [mushafPage]);

  const handleNextMushafPage = () => {
    if (mushafPage < 604) {
      setMushafPage((p) => p + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevMushafPage = () => {
    if (mushafPage > 1) {
      setMushafPage((p) => p - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Audio lifecycle
  useEffect(() => {
    if (!selectedSurahNumber) return;

    // Mishary Alafasy high-quality audio URL for current surah
    const padded = String(selectedSurahNumber).padStart(3, '0');
    const audioUrl = `https://server8.mp3quran.net/afs/${padded}.mp3`;

    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
    } else {
      audioRef.current.src = audioUrl;
    }

    const audio = audioRef.current;
    audio.volume = settings.sound.volume;

    const onTimeUpdate = () => setAudioCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setAudioDuration(audio.duration);
    const onEnded = () => setIsPlayingAudio(false);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.pause();
    };
  }, [selectedSurahNumber, settings.sound.volume]);

  const toggleAudioPlayback = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlayingAudio(true))
        .catch((e) => console.warn('Audio play failed:', e));
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const seekTime = Number(e.target.value);
    audioRef.current.currentTime = seekTime;
    setAudioCurrentTime(seekTime);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const formatAudioTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Bookmark handlers
  const handleRemoveBookmark = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    removeQuranBookmark();
    setCurrentBookmark(null);
    setBookmarkNotification('removed');
    setTimeout(() => setBookmarkNotification(null), 2500);
  };

  const handleToggleBookmark = (
    surahNumber: number,
    ayahNumber: number = 1,
    page?: number,
    e?: React.MouseEvent
  ) => {
    if (e) e.stopPropagation();

    // If this exact surah and ayah is already bookmarked, clicking removes it
    const isThisAlreadyBookmarked =
      currentBookmark &&
      currentBookmark.surahNumber === surahNumber &&
      currentBookmark.ayahNumber === ayahNumber;

    if (isThisAlreadyBookmarked) {
      handleRemoveBookmark();
      return;
    }

    const meta = ALL_SURAHS.find((s) => s.number === surahNumber);
    if (!meta) return;

    const b: QuranBookmark = {
      surahNumber,
      surahName: meta.name,
      ayahNumber,
      page: page || meta.page,
      timestamp: Date.now()
    };
    saveQuranBookmark(b);
    setCurrentBookmark(b);
    setBookmarkNotification('saved');
    setTimeout(() => setBookmarkNotification(null), 2500);
  };

  const handleToggleFavSurah = (surahNumber: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = toggleFavoriteSurah(surahNumber);
    setFavoriteSurahs(updated);
  };

  const handleCopyAyah = (ayah: AyahItem, surahName: string) => {
    const textToCopy = `﴿ ${ayah.text} ﴾ [سورة ${surahName}: الآية ${ayah.numberInSurah}]`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedAyah(ayah.numberInSurah);
    setTimeout(() => setCopiedAyah(null), 2000);
  };

  // Filtered Surahs
  const filteredSurahs = useMemo(() => {
    return ALL_SURAHS.filter((surah) => {
      // Type filter
      if (filterType === 'meccan' && surah.revelationType !== 'Meccan') return false;
      if (filterType === 'medinan' && surah.revelationType !== 'Medinan') return false;
      if (filterType === 'favorites' && !favoriteSurahs.includes(surah.number)) return false;

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const inNum = String(surah.number).includes(q);
        const inAr = surah.name.toLowerCase().includes(q);
        const inEn = surah.englishName.toLowerCase().includes(q);
        const inEnTr = surah.englishNameTranslation.toLowerCase().includes(q);
        return inNum || inAr || inEn || inEnTr;
      }
      return true;
    });
  }, [filterType, searchQuery, favoriteSurahs]);

  // Typography font size classes
  const getAyahTextClass = () => {
    if (fontSizeDelta === -1) return 'text-xl md:text-2xl leading-[2.2]';
    if (fontSizeDelta === 0) return 'text-2xl md:text-3xl leading-[2.4]';
    if (fontSizeDelta === 1) return 'text-3xl md:text-4xl leading-[2.6]';
    if (fontSizeDelta >= 2) return 'text-4xl md:text-5xl leading-[2.8]';
    return 'text-2xl md:text-3xl leading-[2.4]';
  };

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;
  const NextSurahIcon = isRTL ? ChevronLeft : ChevronRight;
  const PrevSurahIcon = isRTL ? ChevronRight : ChevronLeft;

  return (
    <div id="quran-view" className="space-y-6 max-w-4xl mx-auto pb-20">
      {/* Toast Notification for bookmark */}
      {bookmarkNotification && (
        <div
          className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 text-white px-5 py-2.5 rounded-full shadow-xl flex items-center gap-2 text-xs font-bold animate-bounce transition-all ${
            bookmarkNotification === 'saved'
              ? 'bg-emerald-800 border border-emerald-600/40'
              : 'bg-rose-800 border border-rose-600/40'
          }`}
        >
          {bookmarkNotification === 'saved' ? (
            <>
              <BookmarkCheck className="w-4 h-4 text-amber-300" />
              <span>{t('bookmarkSaved')}</span>
            </>
          ) : (
            <>
              <Bookmark className="w-4 h-4 text-white/90" />
              <span>{t('bookmarkRemoved')}</span>
            </>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* MODE 1: SURAH INDEX VIEW */}
      {/* ========================================================= */}
      {!selectedSurahNumber && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="rounded-3xl p-6 md:p-8 bg-gradient-to-br from-emerald-900 via-emerald-950 to-[#0C1712] text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-amber-300 backdrop-blur-sm border border-white/10">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{t('quranTitle')}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight">{t('quranTitle')}</h2>
              <p className="text-xs md:text-sm text-emerald-200/90 max-w-xl leading-relaxed">
                {t('quranSubtitle')}
              </p>

              {/* Bookmark quick card if exists */}
              {currentBookmark && (
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedSurahNumber(currentBookmark.surahNumber);
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/15 hover:bg-white/20 backdrop-blur-md border border-amber-300/30 text-start transition-all duration-200 group flex-1"
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-black group-hover:scale-105 transition-transform">
                      <Bookmark className="w-5 h-5 fill-emerald-950" />
                    </div>
                    <div>
                      <div className="text-[11px] text-amber-200 font-semibold">{t('continueReading')}</div>
                      <div className="text-sm font-bold text-white flex items-center gap-2">
                        <span>سورة {currentBookmark.surahName}</span>
                        <span className="text-xs font-mono text-emerald-200 bg-emerald-900/60 px-2 py-0.5 rounded-full">
                          الآية {currentBookmark.ayahNumber}
                        </span>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={(e) => handleRemoveBookmark(e)}
                    className="p-3.5 rounded-2xl bg-white/10 hover:bg-rose-500/30 text-white/80 hover:text-rose-200 transition-colors border border-white/15"
                    title={t('removeBookmark')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Decorative pattern */}
            <div className="absolute top-0 end-0 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* Offline Cache Status Pill */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-white dark:bg-[#15201A] rounded-2xl border border-emerald-900/10 dark:border-emerald-500/10 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                <HardDrive className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {t('cacheManagerTitle')}
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  سور القرآن ونصوص الأذكار وصفحات المصحف تعمل 100% بدون إنترنت
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCacheModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>فحص وإدارة التخزين</span>
            </button>
          </div>

          {/* Search & Filter Controls */}
          <div className="bg-white dark:bg-[#15201A] rounded-3xl p-4 shadow-sm border border-emerald-900/10 dark:border-emerald-500/10 space-y-3">
            {/* Search input */}
            <div className="relative">
              <input
                id="quran-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchSurahPlaceholder')}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl ps-11 pe-4 py-3 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700 transition-all"
              />
              <Search className="w-5 h-5 text-slate-400 absolute start-3.5 top-3.5 pointer-events-none" />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <button
                onClick={() => setFilterType('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  filterType === 'all'
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950'
                }`}
              >
                {t('allSurahs')} (114)
              </button>
              <button
                onClick={() => setFilterType('meccan')}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  filterType === 'meccan'
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950'
                }`}
              >
                {t('meccanSurahs')}
              </button>
              <button
                onClick={() => setFilterType('medinan')}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  filterType === 'medinan'
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950'
                }`}
              >
                {t('medinanSurahs')}
              </button>
              <button
                onClick={() => setFilterType('favorites')}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  filterType === 'favorites'
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5 text-amber-500" />
                <span>{t('favSurahs')} ({favoriteSurahs.length})</span>
              </button>
            </div>
          </div>

          {/* Surahs Grid List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredSurahs.map((surah) => {
              const isFav = favoriteSurahs.includes(surah.number);
              const isBookmarked = currentBookmark?.surahNumber === surah.number;

              return (
                <div
                  key={surah.number}
                  id={`surah-card-${surah.number}`}
                  onClick={() => setSelectedSurahNumber(surah.number)}
                  className={`bg-white dark:bg-[#15201A] rounded-2xl p-4 border transition-all duration-200 cursor-pointer flex items-center justify-between group hover:shadow-md hover:border-emerald-700/40 ${
                    isBookmarked
                      ? 'border-amber-400 dark:border-amber-500/60 bg-amber-50/20 dark:bg-amber-950/20'
                      : 'border-emerald-900/10 dark:border-emerald-500/10'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Surah Number Badge */}
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-700/20 text-emerald-800 dark:text-emerald-300 font-bold font-mono text-sm flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-800 group-hover:text-white transition-colors">
                      {surah.number}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-amiri text-lg font-black text-slate-900 dark:text-slate-100 truncate">
                          {surah.name}
                        </h3>
                        {isBookmarked && (
                          <span className="w-2 h-2 rounded-full bg-amber-500" title={t('continueReading')} />
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        <span>{surah.englishName}</span>
                        <span>•</span>
                        <span>{surah.numberOfAyahs} {t('ayahsCount')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        surah.revelationType === 'Meccan'
                          ? 'bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300/30'
                          : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-700/20'
                      }`}
                    >
                      {surah.revelationType === 'Meccan' ? t('meccan') : t('medinan')}
                    </span>

                    <button
                      onClick={(e) => handleToggleFavSurah(surah.number, e)}
                      className="p-1.5 text-slate-400 hover:text-amber-500 transition-colors"
                      title={isFav ? t('removeFromFav') : t('addToFav')}
                    >
                      {isFav ? (
                        <BookmarkCheck className="w-4 h-4 text-amber-500 fill-amber-500" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredSurahs.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-[#15201A] rounded-3xl p-8 border border-emerald-900/10 dark:border-emerald-500/10 space-y-2">
              <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-slate-600 dark:text-slate-400 text-sm font-semibold">
                {t('surahNotFound')}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* MODE 2: SURAH READER VIEW */}
      {/* ========================================================= */}
      {selectedSurahNumber && activeSurahMeta && (
        <div className="space-y-4 md:space-y-5 -mt-2 md:-mt-4">
          {/* Reader Top Controls */}
          <div className="bg-white/95 dark:bg-[#15201A]/95 rounded-2xl md:rounded-3xl p-3 md:p-4 shadow-sm border border-emerald-900/10 dark:border-emerald-500/10 flex flex-wrap items-center justify-between gap-2.5 sticky top-0 z-20 backdrop-blur-md">
            {/* Back Button */}
            <button
              onClick={() => setSelectedSurahNumber(null)}
              className="flex items-center gap-2 px-3 py-1.5 md:px-3.5 md:py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
            >
              <BackIcon className="w-4 h-4" />
              <span>{t('backToSurahList')}</span>
            </button>

            {/* Surah Title in Center */}
            <div className="text-center">
              <h2 className="font-amiri text-xl md:text-2xl font-black text-emerald-950 dark:text-emerald-300">
                سورة {activeSurahMeta.name}
              </h2>
              <div className="text-[10px] md:text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5 md:gap-2">
                <span>{activeSurahMeta.englishName}</span>
                <span>•</span>
                <span>{activeSurahMeta.numberOfAyahs} {t('ayahsCount')}</span>
                <span>•</span>
                <span>{t('juzLabel')} {activeSurahMeta.juz}</span>
                <span>•</span>
                <span>{t('pageLabel')} {activeSurahMeta.page}</span>
              </div>
            </div>

            {/* Reader Action Icons */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* View Mode Toggle (Text vs Mushaf Page) */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 md:p-1 rounded-xl me-1">
                <button
                  onClick={() => setViewMode('text')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    viewMode === 'text'
                      ? 'bg-white dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                  title={t('viewTextMode')}
                >
                  <Type className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">{t('viewTextMode')}</span>
                </button>
                <button
                  onClick={() => setViewMode('mushaf')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    viewMode === 'mushaf'
                      ? 'bg-white dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                  title={t('viewMushafMode')}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">{t('viewMushafMode')}</span>
                </button>
              </div>

              {/* Font Size Adjuster (in text mode) */}
              {viewMode === 'text' && (
                <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setFontSizeDelta((p) => Math.max(-1, p - 1))}
                    className="px-2.5 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="تصغير الخط"
                  >
                    A-
                  </button>
                  <button
                    onClick={() => setFontSizeDelta((p) => Math.min(3, p + 1))}
                    className="px-2.5 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border-s border-slate-200 dark:border-slate-800"
                    title="تكبير الخط"
                  >
                    A+
                  </button>
                </div>
              )}

              {/* Translation Toggle (in text mode) */}
              {viewMode === 'text' && (
                <button
                  onClick={() => setShowTranslation(!showTranslation)}
                  className={`p-2 rounded-xl transition-colors ${
                    showTranslation
                      ? 'bg-emerald-800 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950'
                  }`}
                  title={showTranslation ? t('hideTranslation') : t('showTranslation')}
                >
                  {showTranslation ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              )}

              {/* Bookmark Surah Button */}
              {(() => {
                const isSurahBookmarked = currentBookmark?.surahNumber === activeSurahMeta.number;
                return (
                  <button
                    onClick={(e) => {
                      if (isSurahBookmarked) {
                        handleRemoveBookmark(e);
                      } else {
                        handleToggleBookmark(activeSurahMeta.number, 1, activeSurahMeta.page, e);
                      }
                    }}
                    className={`p-2 rounded-xl transition-colors ${
                      isSurahBookmarked
                        ? 'bg-amber-400 text-emerald-950 hover:bg-rose-50 hover:text-rose-600 shadow-sm font-bold'
                        : 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 hover:bg-amber-100'
                    }`}
                    title={isSurahBookmarked ? t('removeBookmark') : t('setBookmark')}
                  >
                    {isSurahBookmarked ? (
                      <BookmarkCheck className="w-4 h-4 fill-emerald-950 text-emerald-950" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>
                );
              })()}
            </div>
          </div>

          {/* Audio Recitation Player Card */}
          <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 text-white rounded-3xl p-4 md:p-5 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleAudioPlayback}
                  className="w-11 h-11 rounded-2xl bg-amber-400 hover:bg-amber-300 text-emerald-950 flex items-center justify-center shadow-lg transition-transform active:scale-95 flex-shrink-0"
                  title={isPlayingAudio ? t('pauseSurah') : t('listenSurah')}
                >
                  {isPlayingAudio ? (
                    <Pause className="w-5 h-5 fill-emerald-950" />
                  ) : (
                    <Play className="w-5 h-5 fill-emerald-950 ms-0.5" />
                  )}
                </button>
                <div>
                  <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{t('reciterAlafasy')}</span>
                  </div>
                  <div className="text-[11px] text-emerald-200 font-mono">
                    {formatAudioTime(audioCurrentTime)} / {formatAudioTime(audioDuration)}
                  </div>
                </div>
              </div>

              {/* Volume & Mute */}
              <button
                onClick={toggleMute}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-100 transition-colors"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Audio Seek Bar */}
            <input
              type="range"
              min={0}
              max={audioDuration || 100}
              value={audioCurrentTime}
              onChange={handleSeek}
              className="w-full accent-amber-400 h-1.5 bg-emerald-900/80 rounded-lg cursor-pointer"
            />
          </div>

          {/* View Mode: Mushaf Page View */}
          {viewMode === 'mushaf' ? (
            <div className="bg-white dark:bg-[#15201A] rounded-3xl p-4 md:p-6 shadow-sm border border-emerald-900/10 dark:border-emerald-500/10 space-y-4">
              {/* Mushaf Page Navigation Header */}
              <div className="flex items-center justify-between gap-2 p-2.5 bg-slate-50 dark:bg-slate-900/80 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                <button
                  disabled={mushafPage <= 1}
                  onClick={handlePrevMushafPage}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-emerald-50 dark:hover:bg-emerald-950 disabled:opacity-30 disabled:pointer-events-none transition-colors border border-slate-200 dark:border-slate-700 shadow-sm"
                >
                  <PrevSurahIcon className="w-4 h-4" />
                  <span>{t('prevPage')}</span>
                </button>

                {/* Page Number, Bookmark & Cache Status */}
                <div className="text-center flex flex-col items-center">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs md:text-sm font-black text-emerald-950 dark:text-emerald-300">
                      {t('mushafPageLabel')} {mushafPage} / 604
                    </span>
                    {/* Bookmark this page */}
                    {(() => {
                      const isThisPageBookmarked =
                        currentBookmark?.surahNumber === activeSurahMeta.number &&
                        currentBookmark?.page === mushafPage;
                      return (
                        <button
                          onClick={(e) =>
                            handleToggleBookmark(
                              activeSurahMeta.number,
                              1,
                              mushafPage,
                              e
                            )
                          }
                          className={`p-1 rounded-md transition-colors ${
                            isThisPageBookmarked
                              ? 'text-amber-500 hover:text-rose-500'
                              : 'text-slate-400 hover:text-amber-500'
                          }`}
                          title={isThisPageBookmarked ? t('removeBookmark') : t('setBookmark')}
                        >
                          {isThisPageBookmarked ? (
                            <BookmarkCheck className="w-3.5 h-3.5 fill-amber-500" />
                          ) : (
                            <Bookmark className="w-3.5 h-3.5" />
                          )}
                        </button>
                      );
                    })()}
                  </div>
                  <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {isPageCached ? (
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{t('pageCachedOffline')}</span>
                      </span>
                    ) : (
                      <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        {isCachingPage ? t('cachingPage') : 'جاري الحفظ أوفلاين...'}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  disabled={mushafPage >= 604}
                  onClick={handleNextMushafPage}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-emerald-50 dark:hover:bg-emerald-950 disabled:opacity-30 disabled:pointer-events-none transition-colors border border-slate-200 dark:border-slate-700 shadow-sm"
                >
                  <span>{t('nextPage')}</span>
                  <NextSurahIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Mushaf Page Image Container */}
              <div className="relative rounded-2xl overflow-hidden bg-[#FAF7EE] dark:bg-[#0c1611] p-3 md:p-6 border-2 border-amber-900/15 dark:border-emerald-500/20 shadow-inner flex flex-col items-center justify-center min-h-[500px]">
                {pageImgError ? (
                  <div className="text-center py-12 space-y-3 p-6">
                    <BookOpen className="w-12 h-12 text-amber-600 dark:text-amber-400 mx-auto" />
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                      تعذر تحميل صورة الصفحة الحالية أوفلاين
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                      نصوص السور والآيات والأذكار مخزنة ومتاحة بالكامل دون إنترنت. يمكنك التبديل إلى العرض النصي الآن أو تنزيل المصحف بالكامل من مدير التحميل.
                    </p>
                    <div className="flex items-center justify-center gap-2 pt-2">
                      <button
                        onClick={() => setViewMode('text')}
                        className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm"
                      >
                        {t('viewTextMode')}
                      </button>
                      <button
                        onClick={() => setIsCacheModalOpen(true)}
                        className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold"
                      >
                        {t('cacheManagerTitle')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <img
                    src={getMushafPageImageUrl(mushafPage)}
                    alt={`صفحة المصحف الشريف ${mushafPage}`}
                    className="w-full max-w-2xl mx-auto rounded-lg shadow-md object-contain transition-opacity duration-300"
                    loading="eager"
                    onError={() => setPageImgError(true)}
                  />
                )}
              </div>
            </div>
          ) : (
            /* Quran Text Sheet */
            <div className="bg-white dark:bg-[#15201A] rounded-3xl p-6 md:p-10 shadow-sm border border-emerald-900/10 dark:border-emerald-500/10 space-y-8">
              {/* Basmala Banner (except Surah At-Tawbah) */}
              {activeSurahMeta.number !== 9 && (
                <div className="text-center py-4 border-b border-emerald-900/10 dark:border-emerald-500/10">
                  <p className="font-amiri text-2xl md:text-3xl text-emerald-950 dark:text-emerald-300 font-bold" dir="rtl">
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </p>
                  {showTranslation && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 italic mt-1">
                      In the name of Allah, the Entirely Merciful, the Especially Merciful
                    </p>
                  )}
                </div>
              )}

              {/* Loading Indicator */}
              {isLoadingAyahs && (
                <div className="text-center py-16 space-y-3">
                  <div className="w-8 h-8 border-3 border-emerald-700 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">{t('loadingSurahText')}</p>
                </div>
              )}

              {/* Ayahs Display */}
              {!isLoadingAyahs && ayahs.length > 0 && (
                <div className="space-y-6">
                  {ayahs.map((ayah) => {
                    const isAyahBookmarked =
                      currentBookmark?.surahNumber === activeSurahMeta.number &&
                      currentBookmark.ayahNumber === ayah.numberInSurah;

                    return (
                      <div
                        key={ayah.numberInSurah}
                        id={`ayah-${ayah.numberInSurah}`}
                        className={`p-4 md:p-5 rounded-2xl transition-all ${
                          isAyahBookmarked
                            ? 'bg-amber-50/50 dark:bg-amber-950/30 border border-amber-300/40'
                            : 'hover:bg-slate-50/80 dark:hover:bg-slate-900/40'
                        }`}
                      >
                        {/* Arabic Quranic Verse */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 text-end" dir="rtl">
                            <span
                              className={`font-amiri text-slate-900 dark:text-slate-100 font-normal tracking-wide select-text ${getAyahTextClass()}`}
                            >
                              {ayah.text}{' '}
                            </span>
                            {/* Quranic Ayah End Symbol */}
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-emerald-700/40 text-emerald-800 dark:text-emerald-300 font-mono text-xs font-bold mx-1 align-middle select-none bg-emerald-50 dark:bg-emerald-950/50">
                              {ayah.numberInSurah}
                            </span>
                          </div>

                          {/* Ayah Actions (Copy, Bookmark) */}
                          <div className="flex items-center gap-1 pt-1 flex-shrink-0" dir="ltr">
                            <button
                              onClick={() => handleCopyAyah(ayah, activeSurahMeta.name)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                              title="نسخ الآية"
                            >
                              {copiedAyah === ayah.numberInSurah ? (
                                <Check className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>

                            <button
                              onClick={(e) =>
                                handleToggleBookmark(
                                  activeSurahMeta.number,
                                  ayah.numberInSurah,
                                  ayah.page,
                                  e
                                )
                              }
                              className={`p-1.5 rounded-lg transition-colors ${
                                isAyahBookmarked
                                  ? 'text-amber-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                                  : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                              }`}
                              title={isAyahBookmarked ? t('removeBookmark') : t('setBookmark')}
                            >
                              {isAyahBookmarked ? (
                                <BookmarkCheck className="w-4 h-4 text-amber-500 fill-amber-500" />
                              ) : (
                                <Bookmark className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Optional English Translation */}
                        {showTranslation && ayah.translation && (
                          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed text-start" dir="ltr">
                            <span className="font-semibold text-emerald-700 dark:text-emerald-400 me-2">
                              [{ayah.numberInSurah}]
                            </span>
                            {ayah.translation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Bottom Navigation */}
          <div className="flex items-center justify-between p-4 bg-white dark:bg-[#15201A] rounded-2xl border border-emerald-900/10 dark:border-emerald-500/10">
            {viewMode === 'mushaf' ? (
              <>
                <button
                  disabled={mushafPage <= 1}
                  onClick={handlePrevMushafPage}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  <PrevSurahIcon className="w-4 h-4" />
                  <span>{t('prevPage')}</span>
                </button>

                <span className="text-xs font-mono text-slate-400">
                  {mushafPage} / 604
                </span>

                <button
                  disabled={mushafPage >= 604}
                  onClick={handleNextMushafPage}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  <span>{t('nextPage')}</span>
                  <NextSurahIcon className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <button
                  disabled={activeSurahMeta.number <= 1}
                  onClick={() => setSelectedSurahNumber(activeSurahMeta.number - 1)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  <PrevSurahIcon className="w-4 h-4" />
                  <span>{t('prevSurah')}</span>
                </button>

                <span className="text-xs font-mono text-slate-400">
                  {activeSurahMeta.number} / 114
                </span>

                <button
                  disabled={activeSurahMeta.number >= 114}
                  onClick={() => setSelectedSurahNumber(activeSurahMeta.number + 1)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  <span>{t('nextSurah')}</span>
                  <NextSurahIcon className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Cache Manager Modal */}
      <CacheManagerModal
        isOpen={isCacheModalOpen}
        onClose={() => setIsCacheModalOpen(false)}
      />
    </div>
  );
};
