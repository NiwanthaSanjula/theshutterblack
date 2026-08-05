import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteAlbumButton from "@/components/admin/delete-album-button";

const dateFormatter = new Intl.DateTimeFormat("en-LK", {
    year: "numeric",
    month: "short",
    day: "numeric"
});

const page = async () => {

    const albums = await prisma.album.findMany({
        orderBy: {
            createdAt: "desc"
        },

        select: {
            id: true,
            title: true,
            slug: true,
            category: true,
            status: true,
            isFeatured: true,
            createdAt: true,

            _count: {
                select: {
                    photos: true,
                },
            },
        },
    });

    return (
        <div>
            <div className="flex items-center justify-between gap-6">
                <div>
                    <p className="text-sm text-neutral-500">Content management</p>
                    <h1 className="mt-1 text-3xl font-semibold">Albums</h1>

                    <p className="mt-1 text-sm text-neutral-500">
                        {albums.length}{" "}
                        {albums.length === 1 ? "album" : "albums"} in total
                    </p>
                </div>

                <Link
                    href="/admin/albums/new"
                    className="rounded-md bg-primary-hover px-5 py-3 text-sm font-medium text-white transition hover:bg-primary"
                >
                    Create new album
                </Link>
            </div>

            <div className="mt-8 rounded-lg border border-neutral-700 bg-neutral-800/50">
                <div className="border-b border-black/10 px-6 py-4">
                    <h2 className="font-medium">All albums</h2>
                </div>

                {albums.length === 0 ? (
                    <div className="p-12 text-center">
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
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[850px] text-left">
                            <thead className="border-b border-neutral-700 text-sm text-neutral-500">
                                <tr>
                                    <th className="px-6 py-4 font-medium">
                                        Album
                                    </th>
                                    <th className="px-6 py-4 font-medium">
                                        Category
                                    </th>
                                    <th className="px-6 py-4 font-medium">
                                        Photos
                                    </th>
                                    <th className="px-6 py-4 font-medium">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 font-medium">
                                        Created
                                    </th>
                                    <th className="px-6 py-4 font-medium">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {albums.map((album) => (
                                    <tr key={album.id}>
                                        <td className="px-6 py-5">
                                            <div className="flex items-start gap-3">
                                                <div>
                                                    <p className="font-medium">
                                                        {album.title}
                                                    </p>

                                                    <p className="mt-1 text-xs text-neutral-500">
                                                        /albums/{album.slug}
                                                    </p>

                                                    {album.isFeatured && (
                                                        <span className="mt-2 inline-block rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
                                                            Featured
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-5 text-sm text-neutral-400">
                                            {album.category || "-"}
                                        </td>

                                        <td className="px-6 py-5 text-sm text-neutral-400">
                                            {album._count.photos}
                                        </td>

                                        <td className="px-6 py-5">
                                            <span
                                                className={
                                                    album.status === "PUBLISHED"
                                                        ? "rounded-full bg-green-500/10 border border-green-500/50 px-3 py-1 text-xs font-medium text-green-500"
                                                        : "rounded-full bg-neutral-600 px-3 py-1 text-xs font-medium text-neutral-100"
                                                }
                                            >
                                                {album.status === "PUBLISHED" ? "Published" : "Draft"}
                                            </span>
                                        </td>

                                        <td className="px-6 py-5 text-sm text-neutral-400">
                                            {dateFormatter.format(album.createdAt)}
                                        </td>

                                        <td className="flex gap-3 px-6 py-5 text-right">

                                            <Link
                                                href={`/admin/albums/${album.id}`}
                                                className="text-sm font-medium text-primary-hover hover:text-primary transitionborder px-2 py-1 rounded"
                                            >
                                                Manage
                                            </Link>

                                            {album.status === "PUBLISHED" && (
                                                <Link
                                                    href={`/albums/${album.slug}`}
                                                    target="_blank"
                                                    className="text-sm font-medium text-neutral-400 transition hover:text-neutral-200 px-2 py-1 rounded"
                                                >
                                                    View
                                                </Link>
                                            )}

                                            <DeleteAlbumButton
                                                albumId={album.id}
                                                albumTitle={album.title}
                                                photoCount={album._count.photos}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}


            </div>
        </div >
    );
}

export default page