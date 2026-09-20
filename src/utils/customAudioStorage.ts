// IndexedDB storage for custom user-uploaded Adhan audio file

const DB_NAME = 'hisn_muslim_audio_db';
const DB_VERSION = 1;
const STORE_NAME = 'custom_adhan';
const ITEM_KEY = 'current_custom_audio';

export interface CustomAudioData {
  blob: Blob;
  name: string;
  type: string;
  size: number;
  updatedAt: number;
}

function openAudioDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function saveCustomAdhanAudio(file: File): Promise<CustomAudioData> {
  const db = await openAudioDb();
  const data: CustomAudioData = {
    blob: file,
    name: file.name,
    type: file.type || 'audio/mpeg',
    size: file.size,
    updatedAt: Date.now()
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const putReq = store.put(data, ITEM_KEY);

    putReq.onsuccess = () => {
      resolve(data);
    };
    putReq.onerror = () => {
      reject(putReq.error);
    };
  });
}

export async function getCustomAdhanAudio(): Promise<CustomAudioData | null> {
  try {
    const db = await openAudioDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const getReq = store.get(ITEM_KEY);

      getReq.onsuccess = () => {
        resolve((getReq.result as CustomAudioData) || null);
      };
      getReq.onerror = () => {
        reject(getReq.error);
      };
    });
  } catch (e) {
    console.warn('Could not read custom audio from IndexedDB:', e);
    return null;
  }
}

export async function removeCustomAdhanAudio(): Promise<void> {
  try {
    const db = await openAudioDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const delReq = store.delete(ITEM_KEY);

      delReq.onsuccess = () => {
        resolve();
      };
      delReq.onerror = () => {
        reject(delReq.error);
      };
    });
  } catch (e) {
    console.warn('Could not delete custom audio:', e);
  }
}

let activeBlobUrl: string | null = null;

export async function getCustomAdhanAudioUrl(): Promise<string | null> {
  const custom = await getCustomAdhanAudio();
  if (!custom) return null;

  if (activeBlobUrl) {
    URL.revokeObjectURL(activeBlobUrl);
  }
  activeBlobUrl = URL.createObjectURL(custom.blob);
  return activeBlobUrl;
}
