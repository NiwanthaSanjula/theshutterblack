"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

type AlbumFiltersProps = {
    categories: string[];
};

export default function AlbumFilters({
    categories,
}: AlbumFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentSearch = searchParams.get("search") ?? "";
    const currentCategory = searchParams.get("category") ?? "all";

    const [search, setSearch] = useState(currentSearch);

    const updateFilters = (nextCategory: string, nextSearch: string) => {
        const params = new URLSearchParams();

        if (nextCategory && nextCategory !== "all") {
            params.set("category", nextCategory);
        }

        if (nextSearch.trim()) {
            params.set("search", nextSearch.trim());
        }
        // no `page` set here — always resets to page 1 on filter change

        const query = params.toString();

        router.push(query ? `/albums?${query}` : "/albums");
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        updateFilters(currentCategory, search);
    };

    return (
        <div className="space-y-6">
            {/* Search */}
            <form onSubmit={handleSubmit} className="relative max-w-xl">
                <input
                    type="search"
                    value={search}
                    maxLength={100}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search albums, locations..."
                    className="
                        w-full rounded-full
                        bg-white
                        px-5 py-3.5 pr-14
                        text-sm text-black
                        outline-none
                        transition
                        placeholder
                        focus:border-primary/60
                        focus:ring-2
                        focus:ring-primary/20
                    "
                />

                <button
                    type="submit"
                    aria-label="Search albums"
                    className="
                        absolute right-2 top-1/2
                        flex h-10 w-10
                        -translate-y-1/2
                        items-center justify-center
                        rounded-full
                        bg-primary
                        text-neutral-950
                        transition
                        hover:bg-primary/85
                    "
                >
                    →
                </button>
            </form>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none [&::-webkit-scrollbar]:hidden">
                <button
                    type="button"
                    onClick={() => updateFilters("all", search)}
                    className={`
                        shrink-0 rounded-full
                        px-5 py-2.5
                        text-xs font-medium
                        uppercase tracking-[0.15em]
                        transition
                        ${currentCategory === "all"
                            ? "bg-primary text-neutral-950"
                            : "border border-white/15 text-white/50 hover:border-white/30 hover:text-white"
                        }
                    `}
                >
                    All
                </button>

                {categories.map((category) => (
                    <button
                        key={category}
                        type="button"
                        onClick={() => updateFilters(category, search)}
                        className={`
                            shrink-0 rounded-full
                            px-5 py-2.5
                            text-xs font-medium
                            uppercase tracking-[0.15em]
                            transition
                            ${currentCategory === category
                                ? "bg-primary text-neutral-950"
                                : "border border-white/15 text-white/50 hover:border-white/30 hover:text-white"
                            }
                        `}
                    >
                        {category}
                    </button>
                ))}
            </div>
        </div>
    );
}