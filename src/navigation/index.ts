import { ReactNode } from "react";
import { allNav } from "./allNav";

export type NavItem = {
    id: number;
    title: string;
    icon: ReactNode;
    role: string[];
    path: string;
};

export type NavGroup = {
    group: string;
    items: NavItem[];
};

export const getNav = (roles: string[]): NavGroup[] => {
    return allNav
        .map((group) => ({
            ...group,
            items: group.items.filter((item) =>
                item.role.some((role) => roles.includes(role))
            ),
        }))
        .filter((group) => group.items.length > 0);
};
