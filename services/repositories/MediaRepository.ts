/* eslint-disable @typescript-eslint/no-explicit-any */
import { readDb, writeDb } from "@/data/mock/db";

export interface MediaFile {
  id: string;
  name: string;
  url: string;
}

export const MediaRepository = {
  getAll(): MediaFile[] {
    const db = readDb();
    return db.media || [];
  },

  create(file: Omit<MediaFile, "id">): MediaFile {
    const db = readDb();
    const newFile: MediaFile = {
      ...file,
      id: Math.random().toString(36).substring(2, 9),
    };
    db.media = [...(db.media || []), newFile];
    writeDb(db);
    return newFile;
  },

  delete(id: string): boolean {
    const db = readDb();
    const before = db.media.length;
    db.media = db.media.filter((f: any) => f.id !== id);
    writeDb(db);
    return db.media.length < before;
  },
};
