import AboutHome from '@/components/website/about-home';
import FeaturedAlbums, { FeaturedAlbumItem } from '@/components/website/featured-section'
import HeroSlider from '@/components/website/hero-slider'
import PackagesHome from '@/components/website/packages-home';
import Services from '@/components/website/services';
import { prisma } from '@/lib/prisma'
import TestimonialsHome, {
    TestimonialHomeItem,
} from '@/components/website/testimonials-home';
import SiteFooter from '@/components/website/site-footer';

function getStartingPrice(priceLabel: string | null) {
    if (!priceLabel) {
        return Number.POSITIVE_INFINITY;
    }

    const match = priceLabel.match(
        /\d[\d,]*(?:\.\d+)?/,
    );

    if (!match) {
        return Number.POSITIVE_INFINITY;
    }

    return Number(
        match[0].replaceAll(",", ""),
    );
}

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

    const publishedPackagesResult = await prisma.servicePackage.findMany({
        where: {
            status: "PUBLISHED",
        },

        select: {
            id: true,
            name: true,
            slug: true,
            shortDescription: true,
            priceLabel: true,
            durationLabel: true,
            features: true,
        },
    });

    const publishedPackages = [...publishedPackagesResult,]
        .sort(
            (firstPackage, secondPackage) =>
                getStartingPrice(
                    firstPackage.priceLabel,
                ) -
                getStartingPrice(
                    secondPackage.priceLabel,
                ),
        ).slice(0, 6);

    const shouldShowPackages =
        publishedPackagesResult.length >= 3;

    const testimonials = await prisma.testimonial.findMany({
        where: {
            status: "PUBLISHED",
            consentToPublish: true,
            imagePublicId: {
                not: null,
            },
        },

        orderBy: [
            {
                publishedAt: "desc",
            },
            {
                createdAt: "desc",
            },
        ],

        take: 6,

        select: {
            id: true,
            name: true,
            message: true,
            rating: true,
            imagePublicId: true,
        },
    });
    const preparedTestimonials: TestimonialHomeItem[] =
        testimonials.filter(
            (
                testimonial,
            ): testimonial is TestimonialHomeItem =>
                testimonial.imagePublicId !== null,
        );


    return (
        <div>
            <HeroSlider />
            <FeaturedAlbums albums={preparedFeaturedAlbum} />
            <Services />
            <AboutHome />
            {shouldShowPackages && (
                <PackagesHome
                    packages={publishedPackages}
                />
            )}
            {preparedTestimonials.length > 0 && (
                <TestimonialsHome testimonials={preparedTestimonials} />
            )}
            <SiteFooter />

        </div>
    )
}
