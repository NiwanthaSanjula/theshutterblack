import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "About",
    description: "Learn more about The Shutter Black photographer.",
};

const page = () => {
    return (
        <main className="mx-auto min-h-screen max-w-7xl px-6 py-20">
            <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
                About
            </p>

            <h1 className="mt-3 text-4xl font-semibold">Meet the photographer</h1>

            <p className="mt-4 max-w-2xl text-neutral-600">
                Learn more about the photographer behind The Shutter Black.
            </p>

            <div className="mt-12 rounded-lg border border-dashed border-neutral-300 bg-white p-12 text-center">
                <p className="text-neutral-500">About section coming soon...</p>
            </div>
        </main>
    );
};

export default page;