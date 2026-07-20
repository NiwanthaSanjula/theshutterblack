"use client"

import Link from "next/link"
import { usePathname } from "next/navigation";

type AlbumWorkspaceTabsProps = {
    albumId: string
    photoCount: number
};

export default function AlbumWorkspaceTabs({
    albumId,
    photoCount
}: AlbumWorkspaceTabsProps) {
    const pathname = usePathname();

    const tabs = [
        {
            label: "Details",
            href: `/admin/albums/${albumId}/edit`,
            isActive: pathname.endsWith("/edit")
        },
        {
            label: `Photographs (${photoCount})`,
            href: `/admin/albums/${albumId}/photos`,
            isActive: pathname.endsWith("/photos")
        }
    ];

    return (
        <nav
            aria-label="Album management"
            className="mt-8 border-b border-neutral-700"
        >
            <div className="flex gap-7 overflow-x-auto">
                {tabs.map((tab) => (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        className={
                            tab.isActive
                                ? "border-b-2 border-emerald-500 px-1 pb-4 text-sm font-medium text-white"
                                : "border-b-2 border-transparent px-1 pb-4 text-sm font-medium text-neutral-400 transition hover:border-neutral-600 hover:text-white"
                        }
                    >
                        {tab.label}
                    </Link>
                ))}
            </div>

        </nav>
    )
}