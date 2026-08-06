import AboutHome from '@/components/website/about-home';
import FeaturedAlbums, { FeaturedAlbumItem } from '@/components/website/featured-section'
import HeroSlider from '@/components/website/hero-slider'
import Services from '@/components/website/services';
import { prisma } from '@/lib/prisma'

export default async function HomePage() {

    const featuredAlbum =
        await prisma.album.findMany({
            where: {
                status: "PUBLISHED",
                isFeatured: true,

                featuredImagePublicId: {
                    not: null,
                },
            },

            orderBy: [
                {
                    displayOrder: "asc"
                },
                {
                    publishedAt: "desc"
                },
                {
                    createdAt: "desc"
                },
            ],
            take: 7,
            select: {
                id: true,
                title: true,
                slug: true,
                description: true,
                category: true,
                location: true,
                eventDate: true,
                featuredImagePublicId: true,
                photos: {
                    where: {
                        isVisible: true,
                        isCover: true,
                    },

                    take: 1,

                    select: {
                        publicid: true,
                    },
                },
            },
        });

    const preparedFeaturedAlbum: FeaturedAlbumItem[] =
        featuredAlbum.flatMap((album) => {
            if (!album.featuredImagePublicId) {
                return [];
            }

            return [
                {
                    id: album.id,
                    title: album.title,
                    slug: album.slug,
                    description: album.description,
                    category: album.category,
                    location: album.location,
                    eventDate: album.eventDate?.toISOString() ?? null,
                    featuredImagePublicId: album.featuredImagePublicId,
                    coverImagePublicId: album.photos[0]?.publicid ?? album.featuredImagePublicId,
                },
            ];
        });

    return (
        <div>
            <HeroSlider />
            <FeaturedAlbums albums={preparedFeaturedAlbum} />
            <Services />
            <AboutHome />

        </div>
    )
}
