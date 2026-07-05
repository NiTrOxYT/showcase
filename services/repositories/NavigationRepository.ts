import { readDb, writeDb } from "@/data/mock/db";

export interface NavItem {
  title: string;
  href: string;
  external?: boolean;
  visible?: boolean;
}

export const NavigationRepository = {
  getAll(): NavItem[] {
    const db = readDb();
    return db.navigation?.mainNav || [];
  },

  update(items: NavItem[]): NavItem[] {
    const db = readDb();
    if (!db.navigation) db.navigation = { mainNav: [] };
    db.navigation.mainNav = items;
    writeDb(db);
    return items;
  },
};
