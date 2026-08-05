-- CreateEnum
CREATE TYPE "PackageStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "TestimonialStatus" AS ENUM ('PENDING', 'PUBLISHED', 'REJECTED');

-- AlterTable
ALTER TABLE "albums" ADD COLUMN     "featuredImagePublicId" TEXT,
ADD COLUMN     "featuredImageUrl" TEXT;

-- CreateTable
CREATE TABLE "service_packages" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "slug" VARCHAR(180) NOT NULL,
    "shortDescription" VARCHAR(320),
    "description" TEXT,
    "priceLabel" VARCHAR(120),
    "durationLabel" VARCHAR(120),
    "features" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "coverUrl" TEXT,
    "coverPublicId" TEXT,
    "status" "PackageStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "testimonials" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "email" VARCHAR(254),
    "message" TEXT NOT NULL,
    "rating" INTEGER,
    "consentToPublish" BOOLEAN NOT NULL DEFAULT false,
    "imageUrl" TEXT,
    "imagePublicId" TEXT,
    "status" "TestimonialStatus" NOT NULL DEFAULT 'PENDING',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "testimonials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "service_packages_slug_key" ON "service_packages"("slug");

-- CreateIndex
CREATE INDEX "service_packages_status_idx" ON "service_packages"("status");

-- CreateIndex
CREATE INDEX "service_packages_publishedAt_idx" ON "service_packages"("publishedAt");

-- CreateIndex
CREATE INDEX "testimonials_status_createdAt_idx" ON "testimonials"("status", "createdAt");

-- CreateIndex
CREATE INDEX "testimonials_publishedAt_idx" ON "testimonials"("publishedAt");

-- Testimonial rating must be between 1 and 5 when provided
ALTER TABLE "testimonials"
ADD CONSTRAINT "testimonials_rating_range_check"
CHECK (
    "rating" IS NULL
    OR ("rating" >= 1 AND "rating" <= 5)
);

-- Published testimonials must have consent and an uploaded image
ALTER TABLE "testimonials"
ADD CONSTRAINT "testimonials_published_requirements_check"
CHECK (
    "status" <> 'PUBLISHED'::"TestimonialStatus"
    OR (
        "consentToPublish" = TRUE
        AND "imageUrl" IS NOT NULL
        AND LENGTH(BTRIM("imageUrl")) > 0
        AND "imagePublicId" IS NOT NULL
        AND LENGTH(BTRIM("imagePublicId")) > 0
    )
);
