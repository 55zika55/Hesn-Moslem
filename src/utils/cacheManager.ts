import { OfflineCacheStats, AyahItem } from '../types';
import { ALL_SURAHS, PRELOADED_SURAHS } from '../data/quranSurahs';
import { MORNING_AZKAR, EVENING_AZKAR, PRE_PRAYER_TASBEEH } from '../data/azkarData';

export const CACHE_NAMES = {
  PAGES: 'hisn_mushaf_pages_v1',
  AUDIO: 'hisn_audio_cache_v1',
  DATA: 'hisn_offline_data_v1'
};

const QURAN_PAGE_URL_TEMPLATE = 'https://files.quran.app/hafs/madani/width_1024/page';

export function getMushafPageImageUrl(page: number): string {
  const safePage = Math.max(1, Math.min(604, Math.floor(page)));
  const pageStr = String(safePage).padStart(3, '0');
  return `${QURAN_PAGE_URL_TEMPLATE}${pageStr}.png`;
}

// Check if browser supports Cache Storage
const hasCacheStorage = typeof window !== 'undefined' && 'caches' in window;

/**
 * Ensures all Azkar texts (Morning, Evening, Pre-Prayer)
 * are persistently backed up in LocalStorage and CacheStorage for 100% offline access.
 */
export async function ensureAzkarCached(): Promise<boolean> {
  try {
    const azkarBundle = {
      morning: MORNING_AZKAR,
      evening: EVENING_AZKAR,
      prePrayer: PRE_PRAYER_TASBEEH,
      version: '1.2.0',
      timestamp: Date.now()
    };

    localStorage.setItem('hisn_azkar_cached_bundle_v1', JSON.stringify(azkarBundle));

    if (hasCacheStorage) {
      const cache = await caches.open(CACHE_NAMES.DATA);
      const blob = new Blob([JSON.stringify(azkarBundle)], { type: 'application/json' });
      const response = new Response(blob, {
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'max-age=31536000' }
      });
      await cache.put('/data/azkar_offline_bundle.json', response);
    }
    return true;
  } catch (err) {
    console.warn('Error ensuring Azkar cache:', err);
    return false;
  }
}

/**
 * Preload and cache a single Mushaf page image into CacheStorage
 */
export async function preloadMushafPage(page: number): Promise<boolean> {
  const url = getMushafPageImageUrl(page);
  if (!hasCacheStorage) return false;

  try {
    const cache = await caches.open(CACHE_NAMES.PAGES);
    const existing = await cache.match(url);
    if (existing) return true;

    const response = await fetch(url, { mode: 'cors', cache: 'force-cache' });
    if (response.ok) {
      await cache.put(url, response.clone());
      notifyCacheListeners();
      return true;
    }
    return false;
  } catch (err) {
    console.warn(`Failed to cache Mushaf page ${page}:`, err);
    return false;
  }
}

/**
 * Checks if a specific Mushaf page image is cached offline
 */
export async function isMushafPageCached(page: number): Promise<boolean> {
  if (!hasCacheStorage) return false;
  try {
    const url = getMushafPageImageUrl(page);
    const cache = await caches.open(CACHE_NAMES.PAGES);
    const match = await cache.match(url);
    return !!match;
  } catch {
    return false;
  }
}

/**
 * Preloads audio assets (/audio/*.mp3) into cache
 */
export async function preloadAudioAssets(): Promise<boolean> {
  if (!hasCacheStorage) return false;
  const audioUrls = [
    '/audio/adhan_full.mp3',
    '/audio/adhan_takbeer.mp3',
    '/audio/adhan_takbeer_double.mp3'
  ];

  try {
    const cache = await caches.open(CACHE_NAMES.AUDIO);
    for (const url of audioUrls) {
      try {
        const match = await cache.match(url);
        if (!match) {
          const res = await fetch(url);
          if (res.ok) {
            await cache.put(url, res);
          }
        }
      } catch {
        // Individual audio fail
      }
    }
    return true;
  } catch (err) {
    console.warn('Failed to cache audio files:', err);
    return false;
  }
}

/**
 * Count cached Surahs in LocalStorage & Preloaded
 */
export function countCachedSurahs(): number {
  let count = 0;
  for (let i = 1; i <= 114; i++) {
    if (PRELOADED_SURAHS[i]) {
      count++;
      continue;
    }
    try {
      if (localStorage.getItem(`hisn_quran_surah_${i}`)) {
        count++;
      }
    } catch {
      // ignore
    }
  }
  return count;
}

/**
 * Count cached Mushaf page images in CacheStorage
 */
export async function countCachedMushafPages(): Promise<number> {
  if (!hasCacheStorage) return 0;
  try {
    const cache = await caches.open(CACHE_NAMES.PAGES);
    const keys = await cache.keys();
    return keys.length;
  } catch {
    return 0;
  }
}

/**
 * Check overall cache statistics
 */
export async function getOfflineCacheStats(): Promise<OfflineCacheStats> {
  const azkarBundle = localStorage.getItem('hisn_azkar_cached_bundle_v1');
  const azkarCached = !!azkarBundle || MORNING_AZKAR.length > 0;
  const azkarCount = MORNING_AZKAR.length + EVENING_AZKAR.length + 1;

  const quranSurahsCached = countCachedSurahs();
  const mushafPagesCached = await countCachedMushafPages();

  let audioCached = false;
  if (hasCacheStorage) {
    try {
      const audioCache = await caches.open(CACHE_NAMES.AUDIO);
      const audioKeys = await audioCache.keys();
      audioCached = audioKeys.length > 0;
    } catch {
      audioCached = false;
    }
  }

  // Estimate storage
  let estimatedMB = 0.5; // base code + azkar text
  estimatedMB += (quranSurahsCached * 0.04); // ~40KB per surah text
  estimatedMB += (mushafPagesCached * 0.15); // ~150KB per page image
  if (audioCached) estimatedMB += 4.5; // ~4.5MB audio

  return {
    azkarCached,
    azkarCount,
    quranSurahsCached,
    totalSurahs: 114,
    mushafPagesCached,
    totalMushafPages: 604,
    audioCached,
    totalEstimatedSizeMB: Number(estimatedMB.toFixed(2)),
    isDownloading: isDownloadInProgress,
    downloadProgress: currentProgress
  };
}

let isDownloadInProgress = false;
let currentProgress = 0;
const listeners = new Set<() => void>();

export function subscribeToCacheUpdates(callback: () => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function notifyCacheListeners() {
  listeners.forEach((fn) => {
    try {
      fn();
    } catch {
      // ignore
    }
  });
}

/**
 * Download full offline package (Surah texts, key pages, azkar, and audio)
 */
export async function downloadFullOfflinePackage(
  onProgress?: (progress: number, message: string) => void
): Promise<void> {
  if (isDownloadInProgress) return;
  isDownloadInProgress = true;
  currentProgress = 0;
  notifyCacheListeners();

  try {
    // 1. Ensure Azkar is stored
    onProgress?.(5, 'جاري حفظ وفهرسة نصوص الأذكار...');
    await ensureAzkarCached();
    currentProgress = 10;
    notifyCacheListeners();

    // 2. Preload Audio files
    onProgress?.(15, 'جاري حفظ ملفات الأذان والصوت...');
    await preloadAudioAssets();
    currentProgress = 25;
    notifyCacheListeners();

    // 3. Download Surahs
    const missingSurahs: number[] = [];
    for (let i = 1; i <= 114; i++) {
      if (!PRELOADED_SURAHS[i] && !localStorage.getItem(`hisn_quran_surah_${i}`)) {
        missingSurahs.push(i);
      }
    }

    const totalMissing = missingSurahs.length;
    let fetchedSurahs = 0;

    for (const surahNum of missingSurahs) {
      try {
        const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahNum}/editions/quran-uthmani,en.sahih`);
        if (res.ok) {
          const json = await res.json();
          if (json.status === 'OK' && json.data && json.data.length >= 2) {
            const arabicEdition = json.data[0];
            const englishEdition = json.data[1];

            const ayahs: AyahItem[] = arabicEdition.ayahs.map(
              (ayah: { numberInSurah: number; text: string; juz: number; page: number }, idx: number) => {
                let arabicText = ayah.text;
                if (surahNum !== 1 && ayah.numberInSurah === 1 && arabicText.startsWith('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ')) {
                  arabicText = arabicText.replace('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', '').trim();
                  if (!arabicText) arabicText = ayah.text;
                }
                return {
                  numberInSurah: ayah.numberInSurah,
                  text: arabicText,
                  translation: englishEdition.ayahs[idx]?.text || '',
                  juz: ayah.juz,
                  page: ayah.page
                };
              }
            );
            localStorage.setItem(`hisn_quran_surah_${surahNum}`, JSON.stringify(ayahs));
          }
        }
      } catch {
        // Continue to next surah
      }

      fetchedSurahs++;
      const surahProgress = totalMissing > 0 ? 25 + Math.round((fetchedSurahs / totalMissing) * 35) : 60;
      currentProgress = Math.min(60, surahProgress);
      onProgress?.(
        currentProgress,
        `جاري تنزيل سور القرآن الكريم (${fetchedSurahs}/${totalMissing})...`
      );
      notifyCacheListeners();

      // Respect API rate limiting with a 40ms pause
      await new Promise((r) => setTimeout(r, 40));
    }

    // 4. Preload first 30 essential Mushaf Pages (e.g. Al-Fatihah, Al-Baqarah start, short surahs at Juz 30)
    const essentialPages = [
      1, 2, 3, 4, 5, 50, 77, 106, 293, 305, 440, 562,
      582, 583, 584, 585, 586, 587, 588, 589, 590, 591, 592, 593, 594, 595, 596, 597, 598, 599, 600, 601, 602, 603, 604
    ];

    let cachedPages = 0;
    for (const page of essentialPages) {
      await preloadMushafPage(page);
      cachedPages++;
      const pageProgress = 60 + Math.round((cachedPages / essentialPages.length) * 38);
      currentProgress = Math.min(99, pageProgress);
      onProgress?.(
        currentProgress,
        `جاري حفظ صفحات المصحف المصورة (${cachedPages}/${essentialPages.length})...`
      );
      notifyCacheListeners();
      await new Promise((r) => setTimeout(r, 60));
    }

    currentProgress = 100;
    onProgress?.(100, 'اكتمل حفظ وتأمين كافة بيانات الأوفلاين بنجاح!');
    notifyCacheListeners();
  } catch (err) {
    console.error('Error during offline download:', err);
  } finally {
    isDownloadInProgress = false;
    notifyCacheListeners();
  }
}

/**
 * Clear application cache and re-initialize offline baseline
 */
export async function clearOfflineCache(): Promise<void> {
  if (hasCacheStorage) {
    try {
      await caches.delete(CACHE_NAMES.PAGES);
      await caches.delete(CACHE_NAMES.AUDIO);
      await caches.delete(CACHE_NAMES.DATA);
    } catch {
      // ignore
    }
  }

  // Remove downloaded surahs from localStorage except preloaded
  for (let i = 1; i <= 114; i++) {
    if (!PRELOADED_SURAHS[i]) {
      localStorage.removeItem(`hisn_quran_surah_${i}`);
    }
  }

  // Re-ensure basic offline Azkar
  await ensureAzkarCached();
  notifyCacheListeners();
}

// Automatically ensure Azkar is cached on module initialization
if (typeof window !== 'undefined') {
  setTimeout(() => {
    ensureAzkarCached();
  }, 1000);
}
