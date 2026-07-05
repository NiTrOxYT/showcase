/* eslint-disable @typescript-eslint/no-explicit-any */
import { readDb, writeDb } from "@/data/mock/db";

export const SettingsRepository = {
  getAll() {
    const db = readDb();
    return db.settings || {};
  },

  getModule(moduleName: string) {
    const settings = this.getAll();
    return settings[moduleName] || {};
  },

  updateModule(moduleName: string, updates: any) {
    const db = readDb();
    if (!db.settings) db.settings = {};
    db.settings[moduleName] = {
      ...db.settings[moduleName],
      ...updates,
    };
    writeDb(db);
    return db.settings[moduleName];
  },
};
