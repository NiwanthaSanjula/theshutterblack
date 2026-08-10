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

    const updateFilters = (
        nextCategory: string,
        nextSearch: string,
    ) => {
        const params = new URLSearchParams();

        if (nextCategory && nextCategory !== "all") {
            params.set("category", nextCategory);
        }

        if (nextSearch.trim()) {
            params.set("search", nextSearch.trim());
        }

        const query = params.toString();

        router.push(
            query ? `/albums?${query}` : "/albums",
        );
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        updateFilters(
            currentCategory,
            search,
        );
    };

    return (
        <div className="mt-12 space-y-6">
            {/* Search */}
            <form
                onSubmit={handleSubmit}
                className="relative max-w-xl"
            >
                <input
                    type="search"
                    value={search}
                    onChange={(event) =>
                        setSearch(event.target.value)
                    }
                    placeholder="Search albums, locations..."
                    className="
                        w-full rounded-full
                        border border-neutral-200
                        bg-white
                        px-5 py-3.5 pr-14
                        text-sm text-neutral-900
                        outline-none
                        transition
                        placeholder:text-neutral-400
                        focus:border-neutral-500
                        focus:ring-2
                        focus:ring-neutral-200
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
                        bg-neutral-900
                        text-white
                        transition
                        hover:bg-neutral-700
                    "
                >
                    →
                </button>
            </form>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none [&::-webkit-scrollbar]:hidden">
                <button
                    type="button"
                    onClick={() =>
                        updateFilters("all", search)
                    }
                    className={`
                        shrink-0 rounded-full
                        px-5 py-2.5
                        text-xs font-medium
                        uppercase tracking-[0.15em]
                        transition
                        ${currentCategory === "all"
                            ? "bg-neutral-900 text-white"
                            : "border border-neutral-200 text-neutral-500 hover:border-neutral-400 hover:text-neutral-900"
                        }
                    `}
                >
                    All
                </button>

                {categories.map((category) => (
                    <button
                        key={category}
                        type="button"
                        onClick={() =>
                            updateFilters(
                                category,
                                search,
                            )
                        }
                        className={`
                            shrink-0 rounded-full
                            px-5 py-2.5
                            text-xs font-medium
                            uppercase tracking-[0.15em]
                            transition
                            ${currentCategory === category
                                ? "bg-neutral-900 text-white"
                                : "border border-neutral-200 text-neutral-500 hover:border-neutral-400 hover:text-neutral-900"
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