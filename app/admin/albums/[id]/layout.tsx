import AlbumWorkspaceTabs from "@/components/admin/album-workspace-tabs";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

type AlbumWorkspaceLayoutProps = {
    children: React.ReactNode;
    params: Promise<{
        id: string;
    }>;
};

export default async function AlbumWorkspaceLayout({
    children,
    params
}: AlbumWorkspaceLayoutProps) {
    const { id } = await params;

    const album = await prisma.album.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            title: true,
            slug: true,
            status: true,
            isFeatured: true,

            _count: {
                select: {
                    photos: true,
                },
            },
        },
    });

    if (!album) {
        notFound();
    }

    return (
        <div>
            <Link
                href="/admin/albums"
                className="text-sm text-neutral-400 transition hover:text-white"
            >
                ← Back to albums
            </Link>

            <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="text-sm text-neutral-500">
                        Album workspace
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-3">
                        <h1 className="text-3xl font-semibold text-neutral-300">
                            {album.title}
                        </h1>

                        <span
                            className={
                                album.status === "PUBLISHED"
                                    ? "rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-400"
                                    : "rounded-full bg-neutral-700 px-3 py-1 text-xs font-medium text-neutral-300"
                            }
                        >
                            {
                                album.status === "PUBLISHED" ? "Published" : "Draft"
                            }
                        </span>

                        {album.isFeatured && (
                            <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-medium text-amber-400">
                                Featured
                            </span>
                        )}
                    </div>

                    <p className="mt-3 text-sm text-neutral-400">
                        {album._count.photos}{" "}
                        {album._count.photos === 1
                            ? "photograph"
                            : "photographs"}
                    </p>
                </div>

                {album.status === "PUBLISHED" && (
                    <Link
                        href={`/albums/${album.slug}`}
                        target="_blank"
                        className="w-fit rounded-md border border-neutral-600 px-4 py-2.5 text-sm font-medium text-neutral-200 transition hover:border-neutral-400 hover:bg-neutral-800"
                    >
                        View public album ↗
                    </Link>
                )}
            </div>

            <AlbumWorkspaceTabs albumId={album.id} photoCount={album._count.photos} />

            <div className="mt-8">{children}</div>
        </div>
    )
}