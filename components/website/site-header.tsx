import Link from "next/link";

const navigationItems = [
    {
        label: "Home",
        href: "/",
    },
    {
        label: "Albums",
        href: "/albums",
    },
    {
        label: "About",
        href: "/about",
    },
    {
        label: "Contact",
        href: "/contact",
    },
];


export default function SiteHeader() {
    return (
        <header className="border-b border-white/15 bg-white/10 backdrop-blur-xs">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
                <Link href={"/"} className="text-xl font-semibold tracking-wide">
                    <h2>The Shutter Black</h2>
                </Link>

                <nav aria-label="Main navigation">
                    <ul className="flex items-center gap-6">
                        {navigationItems.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className="text-sm text-neutral-300 transition-colors hover:text-neutral-100"
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </header>
    )
}

