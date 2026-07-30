"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/admin/logout-button";

type AdminSidebarProps = {
    adminEmail: string;
};

const adminNavigation = [
    {
        label: "Dashboard",
        href: "/admin",
    },
    {
        label: "Albums",
        href: "/admin/albums",
    },
    {
        label: "Messages",
        href: "/admin/messages",
    },
    {
        label: "Settings",
        href: "/admin/settings",
    },
];


const AdminSidebar = ({ adminEmail }: AdminSidebarProps) => {

    const pathName = usePathname();

    return (
        <aside className="flex flex-col min-h-screen w-64 border-r border-neutral-700 bg-neutral-950 px-5 py-8 text-neutral-300">
            <Link
                href={"/admin"}
                className="block"
            >
                <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">Photography CMS</p>

                <h2 className="mt-2 text-lg font-semibold">The Shutter Black</h2>
            </Link>

            <nav className="mt-12" aria-label="Admin Navigation">
                <ul className="space-y-2">
                    {adminNavigation.map((item) => {

                        const isActive = item.href === "/admin"
                            ? pathName === item.href
                            : pathName.startsWith(item.href)

                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`block rounded-md px-4 py-2 text-sm transition-all ${isActive
                                        ? "text-emerald-400 bg-emerald-500/25 border-l-3 border-emerald-500"
                                        : "text-neutral-400 hover:bg-white/10 hover:text-white"
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </nav>

            <div className="mt-12 border-t border-white/10 pt-6">
                <Link
                    href="/"
                    className="text-sm text-neutral-400 transition hover:text-white"
                >
                    View public website
                </Link>
            </div>

            <div className="mt-auto border-t border-neutral-800 pt-6">
                <div className="mb-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-neutral-600">
                        Signed in as
                    </p>

                    <p
                        title={adminEmail}
                        className="mt-1 truncate text-sm font-medium text-neutral-300"
                    >
                        {adminEmail}
                    </p>
                </div>

                <LogoutButton />
            </div>
        </aside>
    )
}

export default AdminSidebar