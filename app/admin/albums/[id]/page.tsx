import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

type AlbumWorkspacePageProps = {
    params: Promise<{
        id: string;
    }>;
};

const dateFormatter = new Intl.DateTimeFormat("en-LK", {
    year: "numeric",
    month: "long",
    day: "numeric",
});

export default async function AlbumWorkspacePage({
    params,
}: AlbumWorkspacePageProps) {
    const { id } = await params;

    const album = await prisma.album.findUnique({
        where: {
            id,
        },

        select: {
            id: true,
            title: true,
            description: true,
            category: true,
            location: true,
            eventDate: true,
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
        <div className="space-y-6">
            {/* Album overview */}
            <section className="rounded-xl border border-neutral-800 bg-neutral-950 p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                            Overview
                        </p>

                        <h2 className="mt-2 text-2xl font-semibold text-white">
                            {album.title}
                        </h2>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
                            {album.description ||
                                "No description has been added to this album yet."}
                        </p>
                    </div>

                    <Link
                        href={`/admin/albums/${album.id}/edit`}
                        className="w-fit rounded-md bg-primary-hover px-5 py-3 text-sm font-medium text-white transition hover:bg-primary"
                    >
                        Edit album
                    </Link>
                </div>

                {/* Details */}
                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-lg border border-neutral-800 bg-neutral-900/60 p-4">
                        <p className="text-xs uppercase tracking-wide text-neutral-600">
                            Category
                        </p>

                        <p className="mt-2 text-sm text-neutral-200">
                            {album.category || "Not specified"}
                        </p>
                    </div>

                    <div className="rounded-lg border border-neutral-800 bg-neutral-900/60 p-4">
                        <p className="text-xs uppercase tracking-wide text-neutral-600">
                            Location
                        </p>

                        <p className="mt-2 text-sm text-neutral-200">
                            {album.location || "Not specified"}
                        </p>
                    </div>

                    <div className="rounded-lg border border-neutral-800 bg-neutral-900/60 p-4">
                        <p className="text-xs uppercase tracking-wide text-neutral-600">
                            Event date
                        </p>

                        <p className="mt-2 text-sm text-neutral-200">
                            {album.eventDate
                                ? dateFormatter.format(album.eventDate)
                                : "Not specified"}
                        </p>
                    </div>

                    <div className="rounded-lg border border-neutral-800 bg-neutral-900/60 p-4">
                        <p className="text-xs uppercase tracking-wide text-neutral-600">
                            Photographs
                        </p>

                        <p className="mt-2 text-sm text-neutral-200">
                            {album._count.photos}{" "}
                            {album._count.photos === 1
                                ? "photograph"
                                : "photographs"}
                        </p>
                    </div>
                </div>
            </section>

            {/* Quick actions */}
            <section className="grid gap-4 sm:grid-cols-2">
                <Link
                    href={`/admin/albums/${album.id}/edit`}
                    className="group rounded-xl border border-neutral-800 bg-neutral-950 p-6 transition hover:border-neutral-600"
                >
                    <p className="text-lg font-medium text-white">
                        Edit album
                    </p>

                    <p className="mt-2 text-sm leading-6 text-neutral-500">
                        Update the album title, description, category,
                        location, event date and publishing settings.
                    </p>

                    <p className="mt-5 text-sm font-medium text-primary-hover transition group-hover:text-primary">
                        Edit details →
                    </p>
                </Link>

                <Link
                    href={`/admin/albums/${album.id}/photos`}
                    className="group rounded-xl border border-neutral-800 bg-neutral-950 p-6 transition hover:border-neutral-600"
                >
                    <p className="text-lg font-medium text-white">
                        Manage photographs
                    </p>

                    <p className="mt-2 text-sm leading-6 text-neutral-500">
                        Upload photographs, choose the album cover,
                        hide photographs or remove them.
                    </p>

                    <p className="mt-5 text-sm font-medium text-primary-hover transition group-hover:text-primary">
                        Manage photos →
                    </p>
                </Link>
            </section>
        </div>
    );
}