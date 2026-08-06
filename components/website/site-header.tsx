"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const navigationItems = [
    {
        label: "home",
        href: "/",
    },
    {
        label: "albums",
        href: "/albums",
    },
    {
        label: "about",
        href: "/about",
    },
    {
        label: "contact",
        href: "/contact",
    },
];


export default function SiteHeader() {

    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    function isActiveLink(href: string) {
        if (href === '/') {
            return pathname === "/";
        }
        return pathname.startsWith(href);
    }

    return (
        <header className="fixed inset-x-0 top-0 z-50 md:mt-2 ">
            <div className="mx-auto flex py-3 max-w-2xl items-center justify-between px-4 sm:px-6 lg:px-8 md:rounded-full border-t-2  border-neutral-200/35 bg-white/20 backdrop-blur-sm">
                <Link
                    href='/'
                    onClick={() => setIsMenuOpen(false)}
                    className="group flex min-w-0 items-center  md:mr-15"
                >
                    {/* Render logo with proper Next.js Image properties */}
                    <div className="relative h-10 flex items-center">
                        <Image
                            src="/logo.png"
                            width={192}
                            height={100}
                            alt="The Shutter Black Logo"
                            style={{ height: '40px', width: 'auto', objectFit: 'contain' }}
                            priority
                        />
                    </div>
                </Link>

                <nav aria-label="Main navigation" className="hidden md:block">
                    <ul role="list" className="flex items-center gap-8">
                        {navigationItems.map((item) => {
                            const isActive = isActiveLink(item.href);

                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={`font-cinzel text-md
                                            ${isActive
                                                ? "text-primary-light font-bold"
                                                : ""}
                                        `}
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </nav>



                <button
                    type="button"
                    aria-expanded={isMenuOpen}
                    aria-controls="mobile-navigation"
                    aria-label={
                        isMenuOpen
                            ? "Close navigation menu"
                            : "Open navigation menu"
                    }
                    onClick={() =>
                        setIsMenuOpen(
                            (currentValue) =>
                                !currentValue,
                        )
                    }
                    className="flex h-11 w-11 items-center justify-center  text-white transition md:hidden"
                >
                    <span className="sr-only">
                        {isMenuOpen
                            ? "Close menu"
                            : "Open menu"}
                    </span>

                    <span
                        aria-hidden="true"
                        className="relative block h-5 w-5"
                    >
                        <span
                            className={`absolute left-0 top-1 block h-px w-5 bg-current transition ${isMenuOpen
                                ? "translate-y-1.5 rotate-45"
                                : ""
                                }`}
                        />

                        <span
                            className={`absolute left-0 top-2.5 block h-px w-5 bg-current transition ${isMenuOpen
                                ? "opacity-0"
                                : ""
                                }`}
                        />

                        <span
                            className={`absolute left-0 top-4 block h-px w-5 bg-current transition ${isMenuOpen
                                ? "-translate-y-1.5 -rotate-45"
                                : ""
                                }`}
                        />
                    </span>
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <nav
                    id="mobile-navigation"
                    aria-label="Mobile navigation"
                    className="border-t border-white/10 bg-neutral-950 px-4 pb-5 pt-3 md:hidden"
                >
                    <ul className="mx-auto max-w-7xl space-y-1">
                        {navigationItems.map((item) => {
                            const isActive =
                                isActiveLink(item.href);

                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        onClick={() =>
                                            setIsMenuOpen(
                                                false,
                                            )
                                        }
                                        className={
                                            isActive
                                                ? "block rounded-lg bg-white px-4 py-3 text-sm font-medium text-neutral-950"
                                                : "block rounded-lg px-4 py-3 text-sm font-medium text-neutral-300 transition hover:bg-white/10 hover:text-white"
                                        }
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            )}
        </header>
    );
}


