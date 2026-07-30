import { getAdminSession } from "@/lib/auth/require-admin";
import { cloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type SignatureRequestBody = {
    paramsToSign?: Record<string, unknown>
}

const albumsFolderPrefix = "the-shutter-black/albums/";

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

    const folder = paramsToSign.folder

    if (
        typeof folder !== "string" ||
        !folder.startsWith(albumsFolderPrefix)
    ) {
        return NextResponse.json(
            {
                error: "Invalid Cloudinary upload folder."
            },
            {
                status: 400
            },
        );
    }

    const albumId = folder.slice(
        albumsFolderPrefix.length,
    );

    if (!albumId) {
        return NextResponse.json(
            {
                error: "Album ID is missing."
            },
            {
                status: 400
            },
        );
    }

    const albumExists = await prisma.album.findUnique({
        where: {
            id: albumId,
        },

        select: {
            id: true
        },
    });

    if (!albumExists) {
        return NextResponse.json(
            {
                error: "The selected album does not exist."
            },
            {
                status: 404
            },
        );
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