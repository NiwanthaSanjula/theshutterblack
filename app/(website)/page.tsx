import HeroSlider from '@/components/website/hero-slider'

export default function HomePage() {
    return (
        <div>
            <HeroSlider />

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

        </div>
    )
}
