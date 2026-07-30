import AlbumPhotoUploader from "@/components/admin/album-photo-uploader";
import DeletePhotoButton from "@/components/admin/delete-photo-button";
import SetAlbumCoverButton from "@/components/admin/set-album-cover-button";
import TogglePhotoVisibilityButton from "@/components/admin/toggle-photo-visibility-button";
import { prisma } from "@/lib/prisma";
import CldImage from "@/components/common/cloudinary-image";
import { notFound } from "next/navigation";

type AlbumPhotosPageProps = {
    params: Promise<{ id: string }>;
}

/*function formatFileSize(bytes: number | null) {
    if (!bytes) {
        return null;
    }

    const megabytes = bytes / 1_000_000;

    return `${megabytes.toFixed(1)} MB`
}*/

export default async function AlbumPhotosPage({
    params,
}: AlbumPhotosPageProps) {
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

            photos: {
                orderBy: [
                    {
                        displayOrder: "asc",
                    },
                    {
                        createdAt: "asc"
                    }
                ],

                select: {
                    id: true,
                    publicid: true,
                    secureUrl: true,
                    caption: true,
                    altText: true,
                    width: true,
                    height: true,
                    format: true,
                    fileSize: true,
                    isVisible: true,
                    isCover: true,
                },
            },
        },
    });

    if (!album) {
        notFound();
    }

    return (
        <div>
            <div>
                <AlbumPhotoUploader albumId={album.id} />
            </div>

            <section className="mt-8">
                <div>
                    <h2 className="text-xl font-semibold">
                        Album photographs
                    </h2>
                </div>

                {album.photos.length === 0 ? (
                    <div className="mt-6 rounded-lg border border-dashed border-neutral-700 bg-neutral-800/50 p-12 text-center">
                        <h3 className="font-medium">
                            No photographs uploaded
                        </h3>

                        <p className="mt-2 text-sm text-neutral-500">
                            Use the upload button above to add the first
                            photographs to this album.
                        </p>
                    </div>
                ) : (
                    <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {album.photos.map((photo, index) => (
                            <article
                                key={photo.id}
                                className="overflow-hidden rounded-lg border border-black/10 bg-neutral-800 shadow-black/50 shadow-lg"
                            >
                                <div className="relative aspect-4/3 bg-neutral-800">
                                    <CldImage
                                        src={photo.publicid}
                                        alt={
                                            photo.altText ??
                                            `${album.title} photograph ${index + 1}`
                                        }
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                        className={
                                            photo.isVisible
                                                ? "object-cover"
                                                : "object-cover opacity-30 grayscale"
                                        }
                                    />
                                    {!photo.isVisible && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                            <span className="rounded-full border border-white/20 bg-black/75 px-3 py-1.5 text-xs font-medium text-white">
                                                Hidden from public album
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="p-4">
                                    <p className="text-sm font-medium">
                                        Photograph {index + 1}
                                    </p>

                                    <div className="mt-2 flex flex-col gap-1 text-xs text-neutral-500">
                                        <div className="flex items-center gap-x-2">
                                            {photo.width && photo.height && (
                                                <span>
                                                    {photo.width} × {photo.height}
                                                </span>
                                            )}
                                            |

                                            {photo.format && (
                                                <span>
                                                    {photo.format.toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-xs text-neutral-500">
                                            Photo ID: {photo.id.slice(-6)}
                                        </span>

                                        {/*photo.fileSize && (
                                            <span>
                                                {formatFileSize(photo.fileSize)}
                                            </span>
                                        )*/}

                                        <div className="mt-1 w-full flex items-center justify-between border-t border-neutral-700 pt-2">

                                            <TogglePhotoVisibilityButton
                                                photoId={photo.id}
                                                isVisible={photo.isVisible}
                                            />

                                            <SetAlbumCoverButton
                                                photoId={photo.id}
                                                isCover={photo.isCover}
                                                isVisible={photo.isVisible}
                                            />

                                            {!photo.isVisible && (
                                                <span className="mt-3 inline-block rounded-full bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-600">
                                                    Hidden
                                                </span>
                                            )}

                                            <DeletePhotoButton
                                                photoId={photo.id}
                                                photoLabel={`Photograph ${index + 1}`}
                                                isCover={photo.isCover}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}