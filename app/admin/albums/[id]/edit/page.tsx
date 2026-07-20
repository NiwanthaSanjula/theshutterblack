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
        <div className="max-w-7xl">
            <AlbumForm
                mode="edit"
                formAction={updateAlbumWithId}
                initialValues={initialValues}
            />
        </div>
    );
}

