import Link from "next/link";
import { prisma } from "@/lib/prisma";
import CldImage from "@/components/common/cloudinary-image";
import DeleteAlbumButton from "@/components/admin/delete-album-button";

const dateFormatter = new Intl.DateTimeFormat("en-LK", {
    year: "numeric",
    month: "short",
    day: "numeric",
});

export default async function AdminAlbumsPage() {
    const albums = await prisma.album.findMany({
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            title: true,
            slug: true,
            category: true,
            status: true,
            isFeatured: true,
            createdAt: true,
            _count: {
                select: { photos: true },
            },
            photos: {
                where: { isVisible: true },
                orderBy: [
                    { isCover: "desc" },
                    { displayOrder: "asc" },
                    { createdAt: "asc" },
                ],
                take: 1,
                select: { publicid: true, altText: true },
            },
        },
    });

    return (
        <div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-neutral-500">Content management</p>
                    <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">Albums</h1>
                    <p className="mt-1 text-sm text-neutral-500">
                        {albums.length} {albums.length === 1 ? "album" : "albums"} in total
                    </p>
                </div>

                <Link
                    href="/admin/albums/new"
                    className="inline-block rounded-md bg-primary-hover px-5 py-3 text-center text-sm font-medium text-white transition hover:bg-primary"
                >
                    Create new album
                </Link>
            </div>

            {albums.length === 0 ? (
                <div className="mt-8 rounded-lg border border-neutral-800 bg-neutral-950 p-12 text-center">
                    <p className="text-neutral-500">
                        No albums have been created yet.
                    </p>
                    <Link
                        href="/admin/albums/new"
                        className="mt-5 inline-block text-sm font-medium text-primary"
                    >
                        + Create your first album
                    </Link>
                </div>
            ) : (
                <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {albums.map((album) => {
                        const cover = album.photos[0];

                        return (
                            <article
                                key={album.id}
                                className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950"
                            >
                                <div className="relative aspect-video bg-neutral-900">
                                    {cover ? (
                                        <CldImage
                                            src={cover.publicid}
                                            alt={cover.altText ?? `${album.title} cover`}
                                            fill
                                            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center">
                                            <p className="text-xs text-neutral-600">
                                                No cover photo
                                            </p>
                                        </div>
                                    )}

                                    <span
                                        className={`
                                            absolute left-3 top-3
                                            rounded-full px-3 py-1
                                            text-xs font-medium
                                            backdrop-blur
                                            ${album.status === "PUBLISHED"
                                                ? "border border-green-500/50 bg-green-500/10 text-green-500"
                                                : "border border-white/15 bg-black/40 text-neutral-200"
                                            }
                                        `}
                                    >
                                        {album.status === "PUBLISHED" ? "Published" : "Draft"}
                                    </span>

                                    {album.isFeatured && (
                                        <span className="absolute right-3 top-3 rounded-full border border-amber-500/50 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400 backdrop-blur">
                                            Featured
                                        </span>
                                    )}
                                </div>

                                <div className="p-5">
                                    <p className="truncate font-medium text-white">
                                        {album.title}
                                    </p>
                                    <p className="mt-1 truncate text-xs text-neutral-500">
                                        /albums/{album.slug}
                                    </p>

                                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-400">
                                        <span>{album.category || "Uncategorized"}</span>
                                        <span>
                                            {album._count.photos}{" "}
                                            {album._count.photos === 1 ? "photo" : "photos"}
                                        </span>
                                        <span>{dateFormatter.format(album.createdAt)}</span>
                                    </div>

                                    <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-white/10 pt-4">
                                        <Link
                                            href={`/admin/albums/${album.id}`}
                                            className="text-sm font-medium text-primary-hover transition hover:text-primary"
                                        >
                                            Manage
                                        </Link>

                                        {album.status === "PUBLISHED" && (
                                            <Link
                                                href={`/albums/${album.slug}`}
                                                target="_blank"
                                                className="text-sm font-medium text-neutral-400 transition hover:text-neutral-200"
                                            >
                                                View
                                            </Link>
                                        )}

                                        <div className="ml-auto">
                                            <DeleteAlbumButton
                                                albumId={album.id}
                                                albumTitle={album.title}
                                                photoCount={album._count.photos}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </div>
    );
}