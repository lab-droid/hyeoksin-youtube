const DB_NAME = 'hyeoksin-youtube-ai';
const STORE_NAME = 'project';
const RECORD_KEY = 'current';

export interface StoredCut {
  id: string;
  text: string;
  imagePrompt: string;
  videoPrompt: string;
  emotion?: string;
  audioDuration?: number;
  audioBlob?: Blob;
  imageBlob?: Blob;
  videoBlob?: Blob;
}

export interface StoredScriptMeta {
  characterSheet: string;
  titles: string[];
  description: string;
  tags: string[];
  thumbnailPrompt: string;
  thumbnailTexts: string[];
}

export interface StoredProject {
  topic: string;
  ratio: string;
  style: string;
  characterEthnicity: string;
  characterAge: string;
  characterGender: string;
  duration: number;
  durationCategory: string;
  voice: string;
  includeSubtitles: boolean;
  currentStep: number;
  bgmVolume: number;
  referenceImages: string[];
  scriptMeta: StoredScriptMeta | null;
  thumbnailBlob?: Blob;
  cuts: StoredCut[];
  savedAt: number;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveProject(project: StoredProject): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put(project, RECORD_KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch (e) {
    console.warn('프로젝트 자동 저장 실패', e);
  }
}

export async function loadProject(): Promise<StoredProject | null> {
  try {
    const db = await openDB();
    const result = await new Promise<StoredProject | null>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).get(RECORD_KEY);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
    db.close();
    return result;
  } catch (e) {
    console.warn('프로젝트 불러오기 실패', e);
    return null;
  }
}

export async function clearProject(): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).delete(RECORD_KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch (e) {
    console.warn('프로젝트 삭제 실패', e);
  }
}

export async function blobUrlToBlob(url?: string): Promise<Blob | undefined> {
  if (!url) return undefined;
  try {
    const res = await fetch(url);
    return await res.blob();
  } catch (e) {
    return undefined;
  }
}
