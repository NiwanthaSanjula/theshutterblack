import type { Metadata } from "next"

import AlbumCard from "@/components/website/album-card"

import AlbumFilters from "@/components/website/album-filters";
import { prisma } from "@/lib/prisma"


export const metadata: Metadata = {
    title: "Albums",
    description: "Explore photography albums from The Shutter Black."
}
type AlbumsPageProps = {
    searchParams: Promise<{
        category?: string;
        search?: string;
    }>;
};

const page = async ({ searchParams }: AlbumsPageProps) => {

    const params = await searchParams;

    const category = params.category?.trim() || "";
    const search = params.search?.trim() || "";

    const categoryResults = await prisma.album.findMany({
        where: {
            status: "PUBLISHED",
            category: {
                not: null,
            },
        },
        distinct: ["category"],
        select: {
            category: true,
        },
        orderBy: {
            category: "asc",
        },
    });

    const categories = categoryResults
        .map((item) => item.category)
        .filter(
            (category): category is string =>
                Boolean(category),
        );

    const albums = await prisma.album.findMany({
        where: {
            status: "PUBLISHED",

            ...(category && category !== "all"
                ? {
                    category: {
                        equals: category,
                        mode: "insensitive",
                    },
                }
                : {}),

            ...(search
                ? {
                    OR: [
                        {
                            title: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                        {
                            location: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                        {
                            category: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                    ],
                }
                : {}),
        },

        orderBy: [
            {
                displayOrder: "asc"
            },
            {
                publishedAt: "desc"
            }
        ],

        select: {
            id: true,
            title: true,
            slug: true,
            category: true,
            location: true,
            eventDate: true,

            _count: {
                select: {
                    photos: {
                        where: {
                            isVisible: true
                        }
                    }
                }
            },

            photos: {
                where: {
                    isVisible: true,
                },

                orderBy: [
                    {
                        isCover: "desc",
                    },
                    {
                        displayOrder: "asc",
                    },
                    {
                        createdAt: "asc",
                    },
                ],

                take: 1,

                select: {
                    publicid: true,
                    secureUrl: true,
                    altText: true
                }
            }
        }
    })

    return (
        <main className="mx-auto min-h-screen max-w-7xl px-6 py-20">
            <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
                Portfolio
            </p>

            <h1 className="mt-3 text-4xl font-semibold">Photography albums</h1>

            <p className="mt-4 max-w-2xl text-neutral-600">
                Explore weddings, portraits, events and memorable stories
                captured through photography.
            </p>

            <AlbumFilters categories={categories} />



            {albums.length === 0 ? (
                <div className="mt-12 rounded-lg border border-dashed border-neutral-300 bg-white p-12 text-center">
                    <h2 className="text-lg font-medium">
                        {category || search
                            ? "No albums found"
                            : "No published albums yet"}
                    </h2>

                    <p className="mt-2 text-neutral-500">
                        {category || search
                            ? "Try another search or choose a different category."
                            : "Published photography collections will appear here."}
                    </p>
                </div>
            ) : (
                <>
                    <p className="mt-8 text-sm text-neutral-500">
                        {albums.length}{" "}
                        {albums.length === 1 ? "album" : "albums"}
                    </p>

                    <section className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {albums.map((album) => (
                            <AlbumCard
                                key={album.id}
                                title={album.title}
                                slug={album.slug}
                                category={album.category}
                                location={album.location}
                                eventDate={album.eventDate}
                                photoCount={album._count.photos}
                                coverPublicId={album.photos[0]?.publicid ?? null}
                                coverAlt={album.photos[0]?.altText ?? null}
                            />
                        ))}
                    </section>
                </>
            )}
        </main>
    )
}

export default page