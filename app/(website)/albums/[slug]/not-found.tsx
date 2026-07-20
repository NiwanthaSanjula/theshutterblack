import Link from "next/link";

export default function AlbumNotFound() {
    return (
        <main className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-6 py-20">
            <div className="max-w-lg text-center">
                <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
                    404
                </p>

                <h1 className="mt-4 text-4xl font-semibold">
                    Album not found
                </h1>

                <p className="mt-4 leading-7 text-neutral-600">
                    This album does not exist, has been removed, or is
                    currently saved as a draft.
                </p>

                <Link
                    href="/albums"
                    className="mt-8 inline-block bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
                >
                    Explore available albums
                </Link>
            </div>
        </main>
    );
}