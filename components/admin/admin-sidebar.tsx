import Link from "next/link";

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


const AdminSidebar = () => {
    return (
        <aside className="min-h-screen w-64 border-r border-neutral-700 bg-neutral-950 px-5 py-8 text-neutral-300">
            <Link
                href={"/admin"}
                className="block"
            >
                <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">Photography CMS</p>

                <h2 className="mt-2 text-lg font-semibold">The Shutter Black</h2>
            </Link>

            <nav className="mt-12" aria-label="Admin Navigation">
                <ul className="space-y-2">
                    {adminNavigation.map((item) => (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className="block rounded-md px-4 py-2 text-sm text-neutral-300 transition hover:bg-white/10 hover:text-white"
                            >
                                {item.label}
                            </Link>
                        </li>
                    ))}
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
        </aside>
    )
}

export default AdminSidebar