import Link from 'next/link'
import React from 'react'

const page = () => {
    return (
        <main>
            <section className="mx-auto flex min-h-screen max-w-7xl items-center px-6 py-24">
                <div className='max-w-3xl'>
                    <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-neutral-500">
                        Professional Photography
                    </p>

                    <h1 className="text-5xl font-semibold leading-[1.15] tracking-tight sm:text-7xl">
                        Capturing stories that deserve to be remembered.
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-600">
                        A professional photography portfolio featuring weddings,
                        portraits, events and meaningful moments.
                    </p>

                    <div className='mt-10 flex flex-wrap gap-4'>
                        <Link
                            href="/albums"
                            className="bg-white px-6 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-800"
                        >
                            Explore albums
                        </Link>

                        <Link
                            href="/contact"
                            className="border border-white px-6 py-3 text-sm font-medium transition hover:bg-black hover:text-white"
                        >
                            Contact photographer
                        </Link>
                    </div>
                </div>
            </section>

            <section className="border-t border-black/10 bg-white">
                <div className="mx-auto max-w-7xl px-6 py-20">
                    <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
                        Featured work
                    </p>

                    <h2 className="mt-3 text-3xl font-semibold">
                        Featured albums will appear here
                    </h2>

                    <p className="mt-4 text-neutral-600">
                        Later, these albums will be loaded from PostgreSQL.
                    </p>
                </div>
            </section>
        </main>
    )
}

export default page