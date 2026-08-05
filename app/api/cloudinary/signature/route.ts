import { getAdminSession } from "@/lib/auth/require-admin";
import { cloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type SignatureRequestBody = {
    paramsToSign?: Record<string, unknown>
}

const albumsFolderPrefix = "the-shutter-black/albums/";
const testimonialsFolderPrefix =
    "the-shutter-black/testimonials/";

function getAlbumIdFromUploadFolder(
    folder: unknown,
): string | null {
    if (
        typeof folder !== "string" ||
        !folder.startsWith(albumsFolderPrefix)
    ) {
        return null
    }

    const relativeFolder = folder.slice(
        albumsFolderPrefix.length,
    );

    const folderParts = relativeFolder.split("/");

    // Normal album photographs:
    // the-shutter-black/albums/{albumId}
    if (
        folderParts.length === 1 && folderParts[0]
    ) {
        return folderParts[0];
    }

    // Homepage featured image:
    // the-shutter-black/albums/{albumId}/featured
    if (
        folderParts.length === 2 &&
        folderParts[0] &&
        folderParts[1] === "featured"
    ) {
        return folderParts[0];
    }

    return null;
}

function getTestimonialIdFromUploadFolder(
    folder: unknown,
): string | null {
    if (
        typeof folder !== "string" ||
        !folder.startsWith(
            testimonialsFolderPrefix,
        )
    ) {
        return null;
    }

    const testimonialId = folder.slice(
        testimonialsFolderPrefix.length,
    );

    /*
     * Only allow:
     * the-shutter-black/testimonials/{testimonialId}
     *
     * Reject missing IDs and additional folders.
     */
    if (
        !testimonialId ||
        testimonialId.includes("/")
    ) {
        return null;
    }

    return testimonialId;
}

export async function POST(request: Request) {
    const adminSession = await getAdminSession();

    if (!adminSession) {
        return Response.json(
            {
                success: false,
                error:
                    "Your administrator session is missing or has expired.",
            },
            {
                status: 401,
            },
        );
    }

    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!apiSecret) {
        return NextResponse.json(
            {
                error: "Cloudinary API secret is missing."
            },
            {
                status: 500,
            }
        );
    }

    let body: SignatureRequestBody;

    try {
        body = (await request.json()) as SignatureRequestBody
    } catch {
        return NextResponse.json(
            {
                error: "Invalid request body."
            },
            {
                status: 400
            },
        );
    }

    const paramsToSign = body.paramsToSign;

    if (!paramsToSign) {
        return NextResponse.json(
            {
                error: "Upload parameters are missing."
            },
            {
                status: 400
            },
        );
    }

    const albumId =
        getAlbumIdFromUploadFolder(
            paramsToSign.folder,
        );

    const testimonialId =
        getTestimonialIdFromUploadFolder(
            paramsToSign.folder,
        );

    if (!albumId && !testimonialId) {
        return NextResponse.json(
            {
                error:
                    "Invalid Cloudinary upload folder.",
            },
            {
                status: 400,
            },
        );
    }

    if (albumId) {
        const albumExists =
            await prisma.album.findUnique({
                where: {
                    id: albumId,
                },

                select: {
                    id: true,
                },
            });

        if (!albumExists) {
            return NextResponse.json(
                {
                    error:
                        "The selected album does not exist.",
                },
                {
                    status: 404,
                },
            );
        }
    }

    if (testimonialId) {
        const testimonialExists =
            await prisma.testimonial.findUnique({
                where: {
                    id: testimonialId,
                },

                select: {
                    id: true,
                },
            });

        if (!testimonialExists) {
            return NextResponse.json(
                {
                    error:
                        "The selected testimonial does not exist.",
                },
                {
                    status: 404,
                },
            );
        }
    }

    const signature = cloudinary.utils.api_sign_request(
        paramsToSign as Parameters<typeof cloudinary.utils.api_sign_request>[0], apiSecret,
    );

    return NextResponse.json({
        signature
    })
}


export async function GET() {
    return NextResponse.json({
        working: true,
        route: "/api/cloudinary/signature",
    });
}