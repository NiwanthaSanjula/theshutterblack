import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const name =
            typeof body.name === "string"
                ? body.name.trim()
                : "";

        const email =
            typeof body.email === "string"
                ? body.email.trim()
                : "";

        const message =
            typeof body.message === "string"
                ? body.message.trim()
                : "";

        const rating =
            typeof body.rating === "number"
                ? body.rating
                : null;

        const consentToPublish =
            body.consentToPublish === true;

        const website =
            typeof body.website === "string"
                ? body.website.trim()
                : "";

        // If honeypot is filled out, it's a spam bot! Discard silently and mock success.
        if (website) {
            return NextResponse.json(
                {
                    success: true,
                    id: "mock-id-for-spam-bot",
                },
                { status: 201 },
            );
        }

        // Basic validation
        if (!name) {
            return NextResponse.json(
                { error: "Please enter your name." },
                { status: 400 }
            );
        }

        if (name.length > 120) {
            return NextResponse.json(
                { error: "Name is too long." },
                { status: 400 }
            );
        }

        if (!message) {
            return NextResponse.json(
                { error: "Please enter your experience." },
                { status: 400 }
            );
        }

        if (message.length > 5000) {
            return NextResponse.json(
                { error: "Your message is too long." },
                { status: 400 }
            );
        }

        if (rating !== null && (rating < 1 || rating > 5)) {
            return NextResponse.json(
                { error: "Invalid rating." },
                { status: 400 }
            );
        }

        if (!consentToPublish) {
            return NextResponse.json(
                {
                    error:
                        "Please agree to the testimonial publishing consent.",
                },
                { status: 400 }
            );
        }

        const testimonial = await prisma.testimonial.create({
            data: {
                name,
                email: email || null,
                message,
                rating,
                consentToPublish: true,
                status: "PENDING",
            },
        });

        return NextResponse.json(
            {
                success: true,
                id: testimonial.id,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error(
            "Testimonial submission error:",
            error
        );

        return NextResponse.json(
            {
                error:
                    "Something went wrong. Please try again later.",
            },
            { status: 500 }
        );
    }
}