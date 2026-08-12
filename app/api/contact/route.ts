import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

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

        const honeypot =
            typeof body.honeypot === "string"
                ? body.honeypot
                : "";

        // If honeypot is filled out, it's a spam bot! Discard silently and mock success.
        if (honeypot) {
            return NextResponse.json(
                { success: true },
                { status: 201 },
            );
        }

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

        if (resend) {
            try {
                // Send email notification to admin.
                // NOTE: Resend's free tier requires using 'onboarding@resend.dev' as the 'from' address
                // until you add and verify your custom domain in the Resend dashboard.
                await resend.emails.send({
                    from: "The Shutter Black <onboarding@resend.dev>",
                    to: process.env.ADMIN_EMAIL ?? "dinkaxo1@gmail.com",
                    subject: `📸 New Inquiry from ${name} (${eventType || "General"})`,
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; padding: 24px; border-radius: 12px; background-color: #ffffff; color: #1f2937;">
                            <h2 style="color: #c5a880; font-family: Georgia, serif; font-size: 20px; font-weight: normal; margin-top: 0; border-bottom: 1px solid #e5e7eb; padding-bottom: 12px; letter-spacing: 0.05em;">New Website Inquiry</h2>
                            <p style="margin: 12px 0;"><strong style="color: #4b5563;">Name:</strong> ${name}</p>
                            <p style="margin: 12px 0;"><strong style="color: #4b5563;">Email:</strong> <a href="mailto:${email}" style="color: #c5a880; text-decoration: none;">${email}</a></p>
                            ${phone ? `<p style="margin: 12px 0;"><strong style="color: #4b5563;">Phone:</strong> <a href="tel:${phone}" style="color: #c5a880; text-decoration: none;">${phone}</a></p>` : ""}
                            ${eventType ? `<p style="margin: 12px 0;"><strong style="color: #4b5563;">Event Type:</strong> ${eventType}</p>` : ""}
                            ${eventDate ? `<p style="margin: 12px 0;"><strong style="color: #4b5563;">Event Date:</strong> ${eventDate}</p>` : ""}
                            ${location ? `<p style="margin: 12px 0;"><strong style="color: #4b5563;">Location:</strong> ${location}</p>` : ""}
                            
                            <div style="margin-top: 24px; border-left: 3px solid #c5a880; padding-left: 16px; font-style: italic; color: #4b5563; line-height: 1.6;">
                                <p style="white-space: pre-wrap; margin: 0;">${message}</p>
                            </div>
                            
                            <hr style="border: 0; border-top: 1px solid #e5e7eb; margin-top: 32px;" />
                            <p style="font-size: 11px; color: #9ca3af; text-align: center; margin-top: 16px; margin-bottom: 0; letter-spacing: 0.05em; text-transform: uppercase;">
                                Submitted via The Shutter Black Contact Form
                            </p>
                        </div>
                    `
                });
            } catch (emailError) {
                console.error("Failed to send inquiry email notification:", emailError);
                // We intentionally do not crash the response here. The inquiry was successfully
                // saved to the database, so the customer's request was recorded.
            }
        }

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


