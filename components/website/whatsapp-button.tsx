"use client";

type WhatsAppButtonProps = {
    phoneNumber: string;
};

export default function WhatsAppButton({ phoneNumber }: WhatsAppButtonProps) {
    // Strip non-digits from the phone number
    const cleanNumber = phoneNumber.replace(/\D/g, "");

    if (!cleanNumber) {
        return null;
    }

    const message = encodeURIComponent(
        "Hello The Shutter Black, I'd like to check your photography packages!"
    );
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${message}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="
                fixed bottom-6 right-6 z-50
                flex h-14 w-14 items-center justify-center
                rounded-full bg-[#25D366] text-white shadow-lg
                transition-all duration-300 ease-out
                hover:scale-110 hover:bg-[#20ba5a] hover:shadow-xl
                active:scale-95
                ring-4 ring-white/10 hover:ring-white/25
            "
        >
            <svg
                viewBox="0 0 24 24"
                className="h-7 w-7 fill-current"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 2.007 14.07 1.01 11.467 1.01 6.035 1.01 1.611 5.381 1.607 10.81c-.001 1.674.452 3.3 1.311 4.7l-.859 3.136 3.209-.844 1.379.82zM17.41 14.546c-.318-.16-1.879-.927-2.197-1.043-.318-.116-.55-.174-.782.174-.231.348-.897 1.157-1.1 1.39-.202.231-.405.261-.723.101-.318-.16-1.344-.495-2.559-1.579-.947-.844-1.58-1.887-1.769-2.205-.189-.318-.02-.491.139-.649.144-.143.318-.376.478-.564.16-.188.213-.318.318-.53.106-.213.053-.406-.027-.566-.08-.16-.782-1.884-1.072-2.58-.282-.677-.571-.587-.782-.597-.203-.01-.434-.01-.666-.01-.231 0-.608.087-.927.435-.318.348-1.217 1.189-1.217 2.9 0 1.71 1.246 3.361 1.419 3.593.174.231 2.45 3.743 5.937 5.247.83.358 1.478.57 1.983.73.834.266 1.593.228 2.194.139.67-.099 1.879-.768 2.143-1.477.264-.71.264-1.319.186-1.448-.078-.13-.287-.213-.605-.373z" />
            </svg>
        </a>
    );
}
