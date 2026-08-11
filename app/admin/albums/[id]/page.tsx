import { notFound } from "next/navigation";
import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { updateAlbum } from "@/actions/album-actions";

import AlbumForm from "@/components/admin/album-form";
import AlbumFeaturedImageUploader from "@/components/admin/album-featured-image-uploader";
import AlbumPhotoUploader from "@/components/admin/album-photo-uploader";
import DeletePhotoButton from "@/components/admin/delete-photo-button";
import SetAlbumCoverButton from "@/components/admin/set-album-cover-button";
import TogglePhotoVisibilityButton from "@/components/admin/toggle-photo-visibility-button";
import CldImage from "@/components/common/cloudinary-image";

type AlbumPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function AlbumPage({
    params,
}: AlbumPageProps) {
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
            slug: true,

            photos: {
                orderBy: [
                    {
                        displayOrder: "asc",
                    },
                    {
                        createdAt: "asc",
                    },
                ],

                select: {
                    id: true,
                    publicid: true,
                    altText: true,
                    width: true,
                    height: true,
                    format: true,
                    isVisible: true,
                    isCover: true,
                },
            },
        },
    });

    if (!album) {
        notFound();
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

            {/* =====================================================
                HEADER
            ===================================================== */}

            <Link
                href="/admin/albums"
                className="text-sm text-neutral-400 transition hover:text-white"
            >
                ← Back to albums
            </Link>

            <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="text-sm text-neutral-500">
                        Album management
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-3">
                        <h1 className="text-3xl font-semibold text-neutral-300 font-cinzel">
                            {album.title}
                        </h1>

                        <span
                            className={
                                album.status === "PUBLISHED"
                                    ? "rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-400"
                                    : "rounded-full bg-neutral-700 px-3 py-1 text-xs font-medium text-neutral-300"
                            }
                        >
                            {album.status === "PUBLISHED"
                                ? "Published"
                                : "Draft"}
                        </span>

                        {album.isFeatured && (
                            <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-medium text-amber-400">
                                Featured
                            </span>
                        )}
                    </div>

                    <p className="mt-3 text-sm text-neutral-400">
                        {album.photos.length}{" "}
                        {album.photos.length === 1
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


            {/* =====================================================
                ALBUM DETAILS + PUBLISHING SETTINGS
            ===================================================== */}

            <section className="mt-8">
                <AlbumForm
                    mode="edit"
                    formAction={updateAlbumWithId}
                    initialValues={initialValues}
                />
            </section>


            {/* =====================================================
                HOMEPAGE FEATURED IMAGE
            ===================================================== */}

            <section className="mt-10">
                <div className="mb-5">
                    <h2 className="text-xl font-semibold text-white">
                        Homepage featured image
                    </h2>

                    <p className="mt-1 text-sm text-neutral-500">
                        Manage the landscape image used when this
                        album appears in the homepage featured section.
                    </p>
                </div>

                {album.isFeatured ? (
                    <AlbumFeaturedImageUploader
                        albumId={album.id}
                        featuredImagePublicId={
                            album.featuredImagePublicId
                        }
                    />
                ) : (
                    <div className="rounded-lg border border-dashed border-neutral-700 bg-neutral-800/50 p-8 text-center">
                        <h3 className="text-sm font-medium text-neutral-300">
                            Featured image is not available
                        </h3>

                        <p className="mt-2 text-sm text-neutral-500">
                            Mark this album as featured and save the
                            changes before uploading its homepage image.
                        </p>
                    </div>
                )}
            </section>


            {/* =====================================================
                PHOTOGRAPH UPLOAD
            ===================================================== */}

            <section className="mt-10">
                <div className="mb-5">
                    <h2 className="text-xl font-semibold text-white">
                        Photographs
                    </h2>

                    <p className="mt-1 text-sm text-neutral-500">
                        Upload and manage the photographs belonging to
                        this album.
                    </p>
                </div>

                <AlbumPhotoUploader
                    albumId={album.id}
                />
            </section>


            {/* =====================================================
                PHOTOGRAPH GRID
            ===================================================== */}

            <section className="mt-8">

                {album.photos.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-neutral-700 bg-neutral-800/50 p-12 text-center">
                        <h3 className="font-medium text-neutral-300">
                            No photographs uploaded
                        </h3>

                        <p className="mt-2 text-sm text-neutral-500">
                            Use the upload button above to add the first
                            photographs to this album.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                        {album.photos.map((photo, index) => (
                            <article
                                key={photo.id}
                                className="overflow-hidden rounded-lg border border-neutral-700 bg-neutral-800 shadow-lg shadow-black/50"
                            >

                                {/* Image */}

                                <div className="relative aspect-4/3 bg-neutral-900">

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

                                    {photo.isCover && (
                                        <span className="absolute left-3 top-3 rounded-full border border-amber-500/50 bg-amber-500/15 px-3 py-1 text-xs font-medium text-amber-400 backdrop-blur">
                                            Album cover
                                        </span>
                                    )}

                                </div>


                                {/* Photo information */}

                                <div className="p-4">

                                    <p className="text-sm font-medium text-white">
                                        Photograph {index + 1}
                                    </p>

                                    <div className="mt-2 flex flex-col gap-1 text-xs text-neutral-500">

                                        <div className="flex items-center gap-x-2">
                                            {photo.width &&
                                                photo.height && (
                                                    <span>
                                                        {photo.width} ×{" "}
                                                        {photo.height}
                                                    </span>
                                                )}

                                            {photo.width &&
                                                photo.height &&
                                                photo.format && (
                                                    <span>|</span>
                                                )}

                                            {photo.format && (
                                                <span>
                                                    {photo.format.toUpperCase()}
                                                </span>
                                            )}
                                        </div>

                                        <span>
                                            Photo ID:{" "}
                                            {photo.id.slice(-6)}
                                        </span>

                                    </div>


                                    {/* Photo actions */}

                                    <div className="mt-4 flex items-center justify-between border-t border-neutral-700 pt-3">

                                        <TogglePhotoVisibilityButton
                                            photoId={photo.id}
                                            isVisible={
                                                photo.isVisible
                                            }
                                        />

                                        <SetAlbumCoverButton
                                            photoId={photo.id}
                                            isCover={
                                                photo.isCover
                                            }
                                            isVisible={
                                                photo.isVisible
                                            }
                                        />

                                        <DeletePhotoButton
                                            photoId={photo.id}
                                            photoLabel={`Photograph ${index + 1}`}
                                            isCover={
                                                photo.isCover
                                            }
                                        />

                                    </div>

                                </div>

                            </article>
                        ))}

                    </div>
                )}

            </section>

        </div>
    );
}