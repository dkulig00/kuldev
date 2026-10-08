export interface NavItem {
  id: string;
  labelKey: string;
}

export const navigationItems: NavItem[] = [
  { id: 'uslugi', labelKey: 'nav.uslugi' },
  { id: 'o-mnie', labelKey: 'nav.oMnie' },
  { id: 'kontakt', labelKey: 'nav.kontakt' },
];
