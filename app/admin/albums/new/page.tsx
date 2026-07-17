import Link from "next/link"

import { createAlbum } from "@/actions/album-actions";
import AlbumForm from "@/components/admin/album-form"

const page = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <Link
                    href="/admin/albums"
                    className="text-sm text-neutral-500 transition hover:text-emerald-500"
                >
                    ← Back to albums
                </Link>

                <p className="mt-6 text-sm text-neutral-500">
                    Content management
                </p>

                <h1 className="mt-1 text-3xl font-semibold">
                    Create album
                </h1>

                <p className="mt-3 text-neutral-600">
                    Create the album first. Photos will be uploaded in a
                    later phase.
                </p>

                <AlbumForm
                    mode="create"
                    formAction={createAlbum}
                />
            </div>

        </div>
    )
}

export default page