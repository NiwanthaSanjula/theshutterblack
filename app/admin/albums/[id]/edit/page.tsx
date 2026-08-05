import { notFound } from "next/navigation";

import { updateAlbum } from "@/actions/album-actions";
import AlbumForm from "@/components/admin/album-form";

import { prisma } from "@/lib/prisma";
import AlbumFeaturedImageUploader from "@/components/admin/album-featured-image-uploader";

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
            featuredImagePublicId: true,
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

            {album.isFeatured ? (
                <div className="mt-8">
                    <AlbumFeaturedImageUploader
                        albumId={album.id}
                        featuredImagePublicId={
                            album.featuredImagePublicId
                        }
                    />
                </div>
            ) : (
                <div className="mt-8 rounded-lg border border-dashed border-neutral-700 bg-neutral-800/50 p-8 text-center">
                    <h2 className="text-sm font-medium text-neutral-300">
                        Featured image is not available
                    </h2>

                    <p className="mt-2 text-sm text-neutral-500">
                        Mark this album as featured and save the changes
                        before uploading its homepage image.
                    </p>
                </div>
            )}
        </div>
    );
}

