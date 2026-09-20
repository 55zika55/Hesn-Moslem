import { QuranBookmark } from '../types';

const QURAN_BOOKMARK_KEY = 'hisn_muslim_quran_bookmark_v1';
const QURAN_FAV_SURAHS_KEY = 'hisn_muslim_quran_fav_surahs_v1';

export function loadQuranBookmark(): QuranBookmark | null {
  try {
    const raw = localStorage.getItem(QURAN_BOOKMARK_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveQuranBookmark(bookmark: QuranBookmark): void {
  try {
    localStorage.setItem(QURAN_BOOKMARK_KEY, JSON.stringify(bookmark));
  } catch (e) {
    console.warn('Failed to save Quran bookmark:', e);
  }
}

export function loadFavoriteSurahs(): number[] {
  try {
    const raw = localStorage.getItem(QURAN_FAV_SURAHS_KEY);
    if (!raw) return [1, 18, 36, 55, 56, 67]; // default favorites: Fatiha, Kahf, Yasin, Rahman, Waqiah, Mulk
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [1, 18, 36, 55, 56, 67];
  }
}

export function toggleFavoriteSurah(surahNumber: number): number[] {
  try {
    const current = loadFavoriteSurahs();
    const updated = current.includes(surahNumber)
      ? current.filter(n => n !== surahNumber)
      : [...current, surahNumber];
    localStorage.setItem(QURAN_FAV_SURAHS_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}
