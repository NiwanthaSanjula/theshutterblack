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

        const phone =
            typeof body.phone === "string"
                ? body.phone.trim()
                : "";

        const eventType =
            typeof body.eventType === "string"
                ? body.eventType.trim()
                : "";

        const eventDate =
            typeof body.eventDate === "string"
                ? body.eventDate.trim()
                : "";

        const location =
            typeof body.location === "string"
                ? body.location.trim()
                : "";

        const message =
            typeof body.message === "string"
                ? body.message.trim()
                : "";

        if (!name || !email || !message) {
            return NextResponse.json(
                {
                    error: "Name, email and message are required.",
                },
                { status: 400 },
            );
        }

        if (name.length > 100) {
            return NextResponse.json(
                { error: "Name is too long." },
                { status: 400 },
            );
        }

        if (email.length > 150) {
            return NextResponse.json(
                { error: "Email address is too long." },
                { status: 400 },
            );
        }

        if (message.length > 2000) {
            return NextResponse.json(
                { error: "Message is too long." },
                { status: 400 },
            );
        }

        let parsedEventDate: Date | null = null;

        if (eventDate) {
            const date = new Date(`${eventDate}T00:00:00`);

            if (Number.isNaN(date.getTime())) {
                return NextResponse.json(
                    { error: "Invalid event date." },
                    { status: 400 },
                );
            }

            parsedEventDate = date;
        }

        await prisma.inquiry.create({
            data: {
                name,
                email,
                phone: phone || null,
                eventType: eventType || null,
                eventDate: parsedEventDate,
                location: location || null,
                message,
                status: "NEW",
            },
        });

        return NextResponse.json(
            {
                success: true,
            },
            { status: 201 },
        );
    } catch (error) {
        console.error("Contact inquiry error:", error);

        return NextResponse.json(
            {
                error: "Unable to send your inquiry right now. Please try again later.",
            },
            { status: 500 },
        );
    }
}