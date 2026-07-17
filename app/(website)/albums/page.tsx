import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Albums",
    description: "Explore photography albums from The Shutter Black."
}

const page = () => {
    return (
        <main className="mx-auto min-h-screen max-w-7xl px-6 py-20">
            <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
                Portfolio
            </p>

            <h1 className="mt-3 text-4xl font-semibold">Photography albums</h1>

            <p className="mt-4 max-w-2xl text-neutral-600">
                Published albums from PostgreSQL will be displayed on this page.
            </p>

            <div className="mt-12 rounded-lg border border-dashed border-neutral-300 bg-white p-12 text-center">
                <p className="text-neutral-500">No albums have been published yet.</p>
            </div>
        </main>
    )
}

export default page