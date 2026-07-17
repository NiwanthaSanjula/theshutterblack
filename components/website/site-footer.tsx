export default function SiteFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-black/10 bg-neutral-900">
            <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-8 text-sm text-neutral-300 sm:flex-row sm:items-center sm:justify-between">
                <p>
                    © {currentYear} The Shutter Black. All rights reserved.
                </p>

                <p>Photography portfolio and album management.</p>
            </div>
        </footer>
    );
}