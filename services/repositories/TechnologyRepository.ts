/* eslint-disable @typescript-eslint/no-explicit-any */
import { readDb, writeDb } from "@/data/mock/db";
import type { Technology } from "@/types/project";

export const TechnologyRepository = {
  getAll(): Technology[] {
    const db = readDb();
    return db.technologies || [];
  },

  create(tech: Technology): Technology[] {
    const db = readDb();
    const exists = db.technologies.some(
      (t: any) => t.name.toLowerCase() === tech.name.toLowerCase()
    );
    if (!exists) {
      db.technologies = [...db.technologies, tech];
      writeDb(db);
    }
    return db.technologies;
  },

  delete(name: string): Technology[] {
    const db = readDb();
    db.technologies = db.technologies.filter((t: any) => t.name !== name);
    writeDb(db);
    return db.technologies;
  },
};
