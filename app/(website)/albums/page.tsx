import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import AlbumCard from "@/components/website/album-card";
import AlbumFilters from "@/components/website/album-filters";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Albums",
    description: "Explore photography albums from The Shutter Black.",
};

const PAGE_SIZE = 12;

type AlbumsPageProps = {
    searchParams: Promise<{
        category?: string;
        search?: string;
        page?: string;
    }>;
};

// Isolated so TypeScript infers the return type from the real `select`
// instead of us hand-declaring a type that can drift out of sync with it.
async function getAlbumsData(
    category: string,
    search: string,
    currentPage: number,
) {
    const where = {
        status: "PUBLISHED" as const,
        ...(category && category !== "all"
            ? { category: { equals: category, mode: "insensitive" as const } }
            : {}),
        ...(search
            ? {
                OR: [
                    { title: { contains: search, mode: "insensitive" as const } },
                    { location: { contains: search, mode: "insensitive" as const } },
                    { category: { contains: search, mode: "insensitive" as const } },
                ],
            }
            : {}),
    };

    const [totalAlbums, albums, categoryResults] = await Promise.all([
        prisma.album.count({ where }),

        prisma.album.findMany({
            where,
            orderBy: [{ displayOrder: "asc" }, { publishedAt: "desc" }],
            skip: (currentPage - 1) * PAGE_SIZE,
            take: PAGE_SIZE,
            select: {
                id: true,
                title: true,
                slug: true,
                category: true,
                location: true,
                eventDate: true,
                _count: {
                    select: { photos: { where: { isVisible: true } } },
                },
                photos: {
                    where: { isVisible: true },
                    orderBy: [
                        { isCover: "desc" },
                        { displayOrder: "asc" },
                        { createdAt: "asc" },
                    ],
                    take: 1,
                    select: { publicid: true, secureUrl: true, altText: true },
                },
            },
        }),

        prisma.album.findMany({
            where: {
                status: "PUBLISHED",
                category: { not: null },
            },
            distinct: ["category"],
            select: { category: true },
            orderBy: { category: "asc" },
        }),
    ]);

    const categories = categoryResults
        .map((item) => item.category)
        .filter((category): category is string => Boolean(category))
        // "all" is the reserved sentinel for "no filter" in the URL/UI,
        // so a real category with that exact name can't be selected.
        .filter((category) => category.toLowerCase() !== "all");

    return { totalAlbums, albums, categories };
}

const page = async ({ searchParams }: AlbumsPageProps) => {
    const params = await searchParams;

    const category = params.category?.trim() || "";
    const search = params.search?.trim().slice(0, 100) || ""; // defensive cap even if the UI is bypassed
    const isFiltered = Boolean(category && category !== "all") || Boolean(search);
    const currentPage = Math.max(1, Number(params.page) || 1);

    let data: Awaited<ReturnType<typeof getAlbumsData>> | null = null;
    let loadError = false;

    try {
        data = await getAlbumsData(category, search, currentPage);
    } catch (error) {
        console.error("Failed to load albums:", error);
        loadError = true;
    }

    const albums = data?.albums ?? [];
    const categories = data?.categories ?? [];
    const totalAlbums = data?.totalAlbums ?? 0;
    const totalPages = Math.max(1, Math.ceil(totalAlbums / PAGE_SIZE));

    const showSpotlight = !isFiltered && currentPage === 1 && albums.length > 0;
    const [featuredAlbum, ...restAlbums] = albums;

    const buildPageHref = (targetPage: number) => {
        const urlParams = new URLSearchParams();
        if (category && category !== "all") urlParams.set("category", category);
        if (search) urlParams.set("search", search);
        if (targetPage > 1) urlParams.set("page", String(targetPage));
        const query = urlParams.toString();
        return query ? `/albums?${query}` : "/albums";
    };

    return (
        <main className="min-h-screen bg-neutral-950">
            {/* Header */}
            <div className="relative overflow-hidden border-b border-white/10">
                {/* Cover photo as a fading hero background */}
                <div className="absolute inset-0">
                    <Image
                        src="/albums-cover-ii.jpg"
                        alt=""
                        aria-hidden="true"
                        fill
                        priority
                        sizes="100vw"
                        className="object-cover"
                    />
                    {/* Fades the image into the page's bg-neutral-950 at the bottom,
                        plus a top-down darken so nav/text stay readable over the photo. */}
                    <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/50 to-neutral-950" />
                </div>

                {/* Big "ALBUMS" background text — kept above the photo, below the content */}
                <p
                    aria-hidden="true"
                    className="
                        pointer-events-none absolute
                        -top-6 right-0
                        select-none whitespace-nowrap
                        font-serif
                        text-[clamp(3rem,10vw,9rem)]
                        leading-none tracking-[0.02em]
                        text-white/6
                    "
                >
                    ALBUMS
                </p>

                <div className="relative mx-auto max-w-7xl px-6 pb-14 pt-32 text-center sm:px-8 sm:pt-40 lg:px-12 lg:pt-48">
                    <div className="flex items-center justify-center gap-4">
                        <span className="h-px w-10 bg-primary/60" />
                        <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary">
                            Portfolio
                        </p>
                    </div>

                    <h1 className="mx-auto mt-5 max-w-2xl font-serif text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
                        Albums
                    </h1>

                    <p className="mx-auto mt-5 max-w-xl text-white/60">
                        Explore weddings, portraits, events and memorable
                        stories captured through photography.
                    </p>

                    <div className="mt-10 flex justify-center">
                        <AlbumFilters categories={categories} />
                    </div>
                </div>
            </div>

            {/* Results */}
            <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-12">
                {loadError ? (
                    <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-16 text-center">
                        <h2 className="font-serif text-2xl text-white">
                            Something went wrong
                        </h2>
                        <p className="mt-2 text-white/50">
                            We couldn&apos;t load albums right now. Please try
                            refreshing the page.
                        </p>
                    </div>
                ) : albums.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-16 text-center">
                        <h2 className="font-serif text-2xl text-white">
                            {isFiltered
                                ? "No albums found"
                                : "No published albums yet"}
                        </h2>

                        <p className="mt-2 text-white/50">
                            {isFiltered
                                ? "Try another search or choose a different category."
                                : "Published photography collections will appear here."}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="mb-8 flex items-center justify-between">
                            <p className="text-sm text-white/40">
                                Showing{" "}
                                <span className="font-medium text-white">
                                    {albums.length}
                                </span>{" "}
                                of{" "}
                                <span className="font-medium text-white">
                                    {totalAlbums}
                                </span>{" "}
                                {totalAlbums === 1 ? "album" : "albums"}
                            </p>
                        </div>

                        {/* Spotlight — first album, full-bleed */}
                        {showSpotlight && (
                            <div className="mb-6">
                                <AlbumCard
                                    key={featuredAlbum.id}
                                    title={featuredAlbum.title}
                                    slug={featuredAlbum.slug}
                                    category={featuredAlbum.category}
                                    location={featuredAlbum.location}
                                    eventDate={featuredAlbum.eventDate}
                                    photoCount={featuredAlbum._count.photos}
                                    coverPublicId={
                                        featuredAlbum.photos[0]?.publicid ?? null
                                    }
                                    coverAlt={featuredAlbum.photos[0]?.altText ?? null}
                                    index={1}
                                    featured
                                />
                            </div>
                        )}

                        {/* Grid */}
                        <section
                            className="
                                grid grid-cols-1 gap-5
                                sm:grid-cols-2 sm:gap-6
                                lg:grid-cols-3
                            "
                        >
                            {(showSpotlight ? restAlbums : albums).map(
                                (album, i) => (
                                    <AlbumCard
                                        key={album.id}
                                        title={album.title}
                                        slug={album.slug}
                                        category={album.category}
                                        location={album.location}
                                        eventDate={album.eventDate}
                                        photoCount={album._count.photos}
                                        coverPublicId={
                                            album.photos[0]?.publicid ?? null
                                        }
                                        coverAlt={album.photos[0]?.altText ?? null}
                                        index={i + (showSpotlight ? 2 : 1)}
                                    />
                                ),
                            )}
                        </section>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <nav
                                aria-label="Album pages"
                                className="mt-14 flex items-center justify-center gap-2"
                            >
                                <Link
                                    href={buildPageHref(Math.max(1, currentPage - 1))}
                                    aria-disabled={currentPage === 1}
                                    className={`
                                        flex h-10 w-10 items-center justify-center
                                        rounded-full border border-white/15
                                        text-sm text-white
                                        transition
                                        ${currentPage === 1
                                            ? "pointer-events-none opacity-30"
                                            : "hover:border-primary hover:text-primary"
                                        }
                                    `}
                                >
                                    ←
                                </Link>

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                                    (pageNumber) => (
                                        <Link
                                            key={pageNumber}
                                            href={buildPageHref(pageNumber)}
                                            aria-current={
                                                pageNumber === currentPage
                                                    ? "page"
                                                    : undefined
                                            }
                                            className={`
                                                flex h-10 w-10 items-center justify-center
                                                rounded-full text-sm
                                                transition
                                                ${pageNumber === currentPage
                                                    ? "bg-primary text-neutral-950"
                                                    : "border border-white/15 text-white/60 hover:border-primary hover:text-primary"
                                                }
                                            `}
                                        >
                                            {pageNumber}
                                        </Link>
                                    ),
                                )}

                                <Link
                                    href={buildPageHref(
                                        Math.min(totalPages, currentPage + 1),
                                    )}
                                    aria-disabled={currentPage === totalPages}
                                    className={`
                                        flex h-10 w-10 items-center justify-center
                                        rounded-full border border-white/15
                                        text-sm text-white
                                        transition
                                        ${currentPage === totalPages
                                            ? "pointer-events-none opacity-30"
                                            : "hover:border-primary hover:text-primary"
                                        }
                                    `}
                                >
                                    →
                                </Link>
                            </nav>
                        )}
                    </>
                )}
            </div>
        </main>
    );
};

export default page;