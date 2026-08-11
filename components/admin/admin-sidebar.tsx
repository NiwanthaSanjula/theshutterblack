"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/admin/logout-button";

type AdminSidebarProps = {
    adminEmail: string;
};

const adminNavigation = [
    //{ label: "Dashboard", href: "/admin" },
    { label: "Albums", href: "/admin/albums" },
    { label: "Packages", href: "/admin/packages" },
    { label: "Testimonials", href: "/admin/testimonials" },
    { label: "Messages", href: "/admin/messages" },
    { label: "Settings", href: "/admin/settings" },
];

const AdminSidebar = ({ adminEmail }: AdminSidebarProps) => {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [prevPathname, setPrevPathname] = useState(pathname);

    // Close the mobile drawer automatically whenever the route changes during render
    if (pathname !== prevPathname) {
        setPrevPathname(pathname);
        setIsOpen(false);
    }

    return (
        <>
            {/* Mobile top bar — hidden on lg+, where the sidebar is always visible */}
            <header className="flex items-center justify-between border-b border-neutral-800 bg-neutral-950 px-5 py-4 lg:hidden">
                <Link href="/admin/albums" className="block">
                    <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">
                        Photography CMS
                    </p>
                    <h2 className="mt-1 text-base font-semibold text-white font-cinzel">
                        The Shutter Black
                    </h2>
                </Link>

                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    aria-label="Open menu"
                    aria-expanded={isOpen}
                    aria-controls="admin-sidebar"
                    className="flex h-10 w-10 items-center justify-center rounded-md border border-neutral-700 text-neutral-300 transition hover:text-white"
                >
                    ☰
                </button>
            </header>

            {/* Backdrop — closes the drawer on tap outside it */}
            {isOpen && (
                <div
                    aria-hidden="true"
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 z-30 bg-black/60 lg:hidden"
                />
            )}

            <aside
                id="admin-sidebar"
                className={`
                    fixed inset-y-0 left-0 z-40 flex w-64 flex-col
                    overflow-y-auto border-r border-neutral-800
                    bg-neutral-950 px-5 py-8 text-neutral-300
                    transition-transform duration-300
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                    lg:sticky lg:top-0 lg:h-screen lg:translate-x-0
                `}
            >
                <div className="flex items-center justify-between lg:block">
                    <Link href="/admin" className="block">
                        <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">
                            Photography CMS
                        </p>
                        <h2 className="mt-2 text-lg font-semibold text-white">
                            The Shutter Black
                        </h2>
                    </Link>

                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        aria-label="Close menu"
                        className="flex h-9 w-9 items-center justify-center rounded-md text-neutral-400 transition hover:text-white lg:hidden"
                    >
                        ✕
                    </button>
                </div>

                <nav className="mt-10 lg:mt-12" aria-label="Admin navigation">
                    <ul className="space-y-2">
                        {adminNavigation.map((item) => {
                            const isActive =
                                item.href === "/admin"
                                    ? pathname === item.href
                                    : pathname.startsWith(item.href);

                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={`block rounded-md px-4 py-2 text-sm font-bold transition-all font-cinzel ${isActive
                                            ? "border-l-3 border-primary bg-primary/25 text-primary-light"
                                            : "text-neutral-400 hover:bg-white/10 hover:text-white"
                                            }`}
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            );
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
        </>
    );
};

export default AdminSidebar;