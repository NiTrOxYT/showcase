export interface NavItem {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
}

export interface NavigationConfig {
  mainNav: NavItem[];
  adminNav: NavItem[];
}
