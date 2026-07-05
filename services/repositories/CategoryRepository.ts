import { readDb, writeDb } from "@/data/mock/db";

export const CategoryRepository = {
  getAll(): string[] {
    const db = readDb();
    return db.categories || [];
  },

  create(name: string): string[] {
    const db = readDb();
    const formatted = name.trim();
    if (formatted && !db.categories.includes(formatted)) {
      db.categories = [...db.categories, formatted];
      writeDb(db);
    }
    return db.categories;
  },

  delete(name: string): string[] {
    const db = readDb();
    db.categories = db.categories.filter((c: string) => c !== name);
    writeDb(db);
    return db.categories;
  },
};
