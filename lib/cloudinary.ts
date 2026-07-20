import { v2 as cloudinary } from "cloudinary";

const cloundName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloundName) {
    throw new Error(
        "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not defined"
    )
}

if (!apiKey) {
    throw new Error(
        "NEXT_PUBLIC_CLOUDINARY_API_KEY is not defined"
    )
}

if (!apiSecret) {
    throw new Error(
        "CLOUDINARY_API_SECRET is not defined"
    )
}

cloudinary.config({
    cloud_name: cloundName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true
});

export { cloudinary };

