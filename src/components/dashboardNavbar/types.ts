export interface NavItem {
    title: string;
    href: string;
    icon: React.ReactNode;
}

export interface BackButtonConfig {
    title: string;
    href: string;
    dynamic: boolean;
}

export interface NavBarGroup {
    navItems: NavItem[];
    showOn: RegExp | RegExp[];
    dynamic: boolean;
    backButtonConfig?: BackButtonConfig;
}

export interface NavConfig {
    navGroup: NavBarGroup[];
}