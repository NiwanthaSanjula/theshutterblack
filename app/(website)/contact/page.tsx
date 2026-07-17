import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact",
    description: "Contact The Shutter Black for photography services.",
};

const page = () => {
    return (
        <main className="mx-auto min-h-[70vh] max-w-7xl px-6 py-20">
            <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
                Contact
            </p>

            <h1 className="mt-3 text-4xl font-semibold">
                Let&apos;s create something memorable
            </h1>

            <p className="mt-4 max-w-2xl text-neutral-600">
                The booking inquiry form will be developed after the database is
                connected.
            </p>
        </main>
    );
}

export default page