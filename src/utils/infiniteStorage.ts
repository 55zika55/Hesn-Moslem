// Infinite Durable Storage & Cross-Device Data Synchronization Engine
// Uses IndexedDB with Persistent Storage API to avoid browser eviction

const DB_NAME = 'salati_infinite_storage';
const DB_VERSION = 1;

export interface StorageInfo {
  isPersistent: boolean;
  usedBytes: number;
  quotaBytes: number;
  usedFormatted: string;
  quotaFormatted: string;
}

export interface FullBackupPayload {
  version: number;
  exportDate: string;
  timestamp: number;
  settings: Record<string, unknown>;
  azkarProgress: Record<string, unknown>;
  quranBookmarks: Record<string, unknown>;
  customAudioMeta?: { name: string; size: number; type: string } | null;
  customAudioBase64?: string | null;
  notes?: Record<string, unknown>;
}

function openInfiniteDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('prayer_history')) {
        db.createObjectStore('prayer_history', { keyPath: 'date' });
      }
      if (!db.objectStoreNames.contains('azkar_history')) {
        db.createObjectStore('azkar_history', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('quran_notes')) {
        db.createObjectStore('quran_notes', { keyPath: 'surahAyah' });
      }
      if (!db.objectStoreNames.contains('sync_snapshots')) {
        db.createObjectStore('sync_snapshots', { keyPath: 'timestamp' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// Request the browser to NEVER delete or evict our stored data
export async function enablePersistentStorage(): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.persist) {
    try {
      const isPersisted = await navigator.storage.persist();
      return isPersisted;
    } catch (e) {
      console.warn('Storage persist request failed:', e);
      return false;
    }
  }
  return false;
}

export async function checkStorageStatus(): Promise<StorageInfo> {
  let isPersistent = false;
  let usedBytes = 0;
  let quotaBytes = 0;

  if (typeof navigator !== 'undefined' && navigator.storage) {
    if (navigator.storage.persisted) {
      try {
        isPersistent = await navigator.storage.persisted();
      } catch {
        // ignore
      }
    }
    if (navigator.storage.estimate) {
      try {
        const est = await navigator.storage.estimate();
        usedBytes = est.usage || 0;
        quotaBytes = est.quota || 0;
      } catch {
        // ignore
      }
    }
  }

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return {
    isPersistent,
    usedBytes,
    quotaBytes,
    usedFormatted: formatSize(usedBytes),
    quotaFormatted: formatSize(quotaBytes)
  };
}

// Full Data Export to JSON file
export async function exportAllUserData(): Promise<FullBackupPayload> {
  const settingsRaw = localStorage.getItem('hisn_muslim_settings');
  const dayProgressRaw = localStorage.getItem('hisn_muslim_day_progress');
  const quranBookmarkRaw = localStorage.getItem('hisn_muslim_quran_bookmark');

  const settings = settingsRaw ? JSON.parse(settingsRaw) : {};
  const azkarProgress = dayProgressRaw ? JSON.parse(dayProgressRaw) : {};
  const quranBookmarks = quranBookmarkRaw ? JSON.parse(quranBookmarkRaw) : {};

  // Try to export custom audio as base64 if present
  let customAudioMeta = null;
  let customAudioBase64 = null;

  try {
    const { getCustomAdhanAudio } = await import('./customAudioStorage');
    const audioData = await getCustomAdhanAudio();
    if (audioData) {
      customAudioMeta = {
        name: audioData.name,
        size: audioData.size,
        type: audioData.type
      };
      // Convert to base64 for portable backup
      customAudioBase64 = await blobToBase64(audioData.blob);
    }
  } catch (e) {
    console.warn('Audio export omitted:', e);
  }

  const payload: FullBackupPayload = {
    version: 2,
    exportDate: new Date().toISOString(),
    timestamp: Date.now(),
    settings,
    azkarProgress,
    quranBookmarks,
    customAudioMeta,
    customAudioBase64
  };

  return payload;
}

export function downloadBackupFile(payload: FullBackupPayload): void {
  const jsonStr = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `salati-backup-${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Restore All User Data from JSON file
export async function restoreUserData(
  payload: FullBackupPayload,
  merge: boolean = true
): Promise<boolean> {
  if (!payload || !payload.version) {
    throw new Error('الملف غير صالح أو تالف');
  }

  if (payload.settings) {
    if (merge) {
      const current = localStorage.getItem('hisn_muslim_settings');
      const parsedCurrent = current ? JSON.parse(current) : {};
      const merged = { ...parsedCurrent, ...payload.settings };
      localStorage.setItem('hisn_muslim_settings', JSON.stringify(merged));
    } else {
      localStorage.setItem('hisn_muslim_settings', JSON.stringify(payload.settings));
    }
  }

  if (payload.azkarProgress) {
    localStorage.setItem('hisn_muslim_day_progress', JSON.stringify(payload.azkarProgress));
  }

  if (payload.quranBookmarks) {
    localStorage.setItem('hisn_muslim_quran_bookmark', JSON.stringify(payload.quranBookmarks));
  }

  // Restore custom audio if included
  if (payload.customAudioBase64 && payload.customAudioMeta) {
    try {
      const { saveCustomAdhanAudio } = await import('./customAudioStorage');
      const blob = base64ToBlob(payload.customAudioBase64, payload.customAudioMeta.type);
      const file = new File([blob], payload.customAudioMeta.name, {
        type: payload.customAudioMeta.type
      });
      await saveCustomAdhanAudio(file);
    } catch (e) {
      console.warn('Could not restore custom audio:', e);
    }
  }

  // Save snapshot to Infinite DB
  try {
    const db = await openInfiniteDb();
    const tx = db.transaction('sync_snapshots', 'readwrite');
    tx.objectStore('sync_snapshots').put({
      timestamp: Date.now(),
      date: new Date().toISOString(),
      type: 'restore'
    });
  } catch {
    // ignore
  }

  return true;
}

// Generate Sync Code (Compact text token for transferring between devices)
export async function generateSyncCode(): Promise<string> {
  const data = await exportAllUserData();
  // Strip large audio base64 for text sync code if too big
  const lightweight = {
    ...data,
    customAudioBase64: undefined
  };
  const jsonStr = JSON.stringify(lightweight);
  return btoa(unescape(encodeURIComponent(jsonStr)));
}

// Restore from Sync Code text
export async function restoreFromSyncCode(syncCode: string): Promise<boolean> {
  try {
    const decoded = decodeURIComponent(escape(atob(syncCode.trim())));
    const parsed = JSON.parse(decoded) as FullBackupPayload;
    return await restoreUserData(parsed, true);
  } catch (err) {
    throw new Error('رمز المزامنة غير صحيح أو منتهي الصلاحية');
  }
}

// Utility: Blob to Base64
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Utility: Base64 to Blob
function base64ToBlob(base64: string, mimeType: string = 'audio/mpeg'): Blob {
  const parts = base64.split(';base64,');
  const raw = window.atob(parts.length > 1 ? parts[1] : parts[0]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);
  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  return new Blob([uInt8Array], { type: mimeType });
}
