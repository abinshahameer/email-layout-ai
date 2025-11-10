import { openDB, DBSchema } from 'idb';
import { NewsletterSection } from '@/components/NewsletterEditor';

const DB_NAME = 'newsletter-editor-db';
const STORE_NAME = 'sections';
const DB_VERSION = 1;

interface NewsletterDB extends DBSchema {
  [STORE_NAME]: {
    key: string;
    value: NewsletterSection[];
  };
}

const dbPromise = openDB<NewsletterDB>(DB_NAME, DB_VERSION, {
  upgrade(db) {
    db.createObjectStore(STORE_NAME);
  },
});

const SECTIONS_KEY = 'current-sections';

export async function saveSections(sections: NewsletterSection[]) {
  const db = await dbPromise;
  await db.put(STORE_NAME, sections, SECTIONS_KEY);
}

export async function getSections(): Promise<NewsletterSection[] | undefined> {
  const db = await dbPromise;
  return db.get(STORE_NAME, SECTIONS_KEY);
}

export async function clearSections() {
    const db = await dbPromise;
    await db.delete(STORE_NAME, SECTIONS_KEY);
}
