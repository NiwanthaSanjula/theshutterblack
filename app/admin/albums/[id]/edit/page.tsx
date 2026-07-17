import Link from "next/link";
import { notFound } from "next/navigation";

import { updateAlbum } from "@/actions/album-actions";
import AlbumForm from "@/components/admin/album-form";
import { prisma } from "@/lib/prisma";

type EditAlbumPageProps = {
    params: Promise<{
        id: string
    }>;
};

export default async function page({
    params
}: EditAlbumPageProps) {
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
        },
    });

    if (!album) {
        notFound()
    }

    const updateAlbumWithId = updateAlbum.bind(
        null,
        album.id
    );

    const initialValues = {
        title: album.title,
        description: album.description ?? "",
        category: album.category ?? "",
        location: album.location ?? "",
        eventDate: album.eventDate
            ? album.eventDate.toISOString().slice(0, 10)
            : "",

        status: album.status,
        isFeatured: album.isFeatured,
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <Link
                    href="/admin/albums"
                    className="text-sm text-neutral-500 transition hover:text-emerald-500"
                >
                    ← Back to albums
                </Link>

                <p className="mt-6 text-sm text-neutral-500">
                    Content management
                </p>

                <h1 className="mt-1 text-3xl font-semibold">
                    Edit album
                </h1>

                <p className="mt-3 text-neutral-600">
                    Update the album information and publishing settings.
                </p>
            </div>

            <AlbumForm
                mode="edit"
                formAction={updateAlbumWithId}
                initialValues={initialValues}
            />
        </div>
    )
}

