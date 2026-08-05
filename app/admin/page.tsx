import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";


export default async function adminDashboardPage() {
    const [
        totalAlbums,
        publishedAlbums,
        draftAlbums,
        totalPhotos,
    ] = await Promise.all([
        prisma.album.count(),

        prisma.album.count({
            where: {
                status: "PUBLISHED"
            }
        }),

        prisma.album.count({
            where: {
                status: "DRAFT",
            },
        }),

        prisma.photo.count(),
    ]);



    const dashboardCards = [
        {
            label: "Total albums",
            value: totalAlbums,
        },
        {
            label: "Published albums",
            value: publishedAlbums,
        },
        {
            label: "Draft albums",
            value: draftAlbums,
        },
        {
            label: "Total photos",
            value: totalPhotos,
        },
    ];


    return (
        <div>
            <div>
                <p className="text-sm text-neutral-500">Overview</p>
                <h1 className="mt-1 text-3xl font-semibold">Dashboard</h1>
            </div>

            <section className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {dashboardCards.map((card) => (
                    <article
                        key={card.label}
                        className="rounded-xl border border-neutral-800 border-l-3 border-l-primary bg-neutral-950 p-6"
                    >
                        <p className="text-sm text-neutral-400">{card.label}</p>
                        <p className="mt-3 text-3xl font-semibold text-primary">{card.value}</p>

                    </article>
                ))}
            </section>

            <section className="mt-8 rounded-lg border border-black/10 bg-neutral-950 p-6">
                <h2 className="text-lg font-semibold">Recent albums</h2>

                <p className="mt-4 text-sm text-neutral-500">
                    Recently created albums will appear here after PostgreSQL is
                    connected.
                </p>
            </section>
        </div>
    )
}

