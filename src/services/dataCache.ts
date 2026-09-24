export type PublicDataSnapshot = {
  projects: any[];
  services: any[];
  testimonials: any[];
  settings: any;
  savedAt: number;
};

const DB_NAME = "asif-glass-cache";
const STORE_NAME = "snapshots";
const PUBLIC_DATA_KEY = "public-data";

function openCache(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function readPublicDataCache(): Promise<PublicDataSnapshot | null> {
  if (typeof indexedDB === "undefined") return null;
  try {
    const db = await openCache();
    return await new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const request = transaction.objectStore(STORE_NAME).get(PUBLIC_DATA_KEY);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
      transaction.oncomplete = () => db.close();
    });
  } catch {
    return null;
  }
}

export async function writePublicDataCache(snapshot: Omit<PublicDataSnapshot, "savedAt">): Promise<void> {
  if (typeof indexedDB === "undefined") return;
  try {
    const db = await openCache();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      transaction.objectStore(STORE_NAME).put({ ...snapshot, savedAt: Date.now() }, PUBLIC_DATA_KEY);
      transaction.oncomplete = () => {
        db.close();
        resolve();
      };
      transaction.onerror = () => reject(transaction.error);
    });
  } catch {
    // Caching is an optional speed optimization; API data remains authoritative.
  }
}
