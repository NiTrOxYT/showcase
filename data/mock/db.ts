/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-require-imports */
import path from "path";

let cache: any = null;

function getDbPath() {
  return path.join(process.cwd(), "data", "mock", "db.json");
}

export function readDb(): any {
  if (cache) return cache;

  if (typeof window === "undefined") {
    try {
      const fs = require("fs");
      const data = fs.readFileSync(getDbPath(), "utf-8");
      cache = JSON.parse(data);
      return cache;
    } catch (e) {
      console.error("[DB] Failed to read db.json", e);
    }
  }

  return { 
    projects: [], 
    settings: {}, 
    navigation: { mainNav: [] }, 
    categories: [], 
    technologies: [], 
    userPreferences: {}, 
    media: [] 
  };
}

export function writeDb(data: any) {
  cache = data;

  if (typeof window === "undefined") {
    try {
      const fs = require("fs");
      fs.writeFileSync(getDbPath(), JSON.stringify(data, null, 2), "utf-8");
    } catch (e) {
      console.error("[DB] Failed to write db.json", e);
    }
  }
}
