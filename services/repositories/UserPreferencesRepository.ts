import { readDb, writeDb } from "@/data/mock/db";

export interface UserPreferences {
  sidebarCollapsed: boolean;
  theme: string;
  tableDensity: "normal" | "compact" | "spacious";
}

export const UserPreferencesRepository = {
  getAll(): UserPreferences {
    const db = readDb();
    return db.userPreferences || { sidebarCollapsed: false, theme: "dark", tableDensity: "normal" };
  },

  update(updates: Partial<UserPreferences>): UserPreferences {
    const db = readDb();
    db.userPreferences = {
      ...db.userPreferences,
      ...updates,
    };
    writeDb(db);
    return db.userPreferences;
  },
};
