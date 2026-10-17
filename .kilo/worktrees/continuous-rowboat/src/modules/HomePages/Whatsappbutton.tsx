type WhatsAppButtonProps = {
  phoneNumber?: string;
  message?: string;
};

export default function WhatsAppButton({
  phoneNumber = "8801895610891",
  message = "Hi, I need help with my Apple device repair.",
}: WhatsAppButtonProps) {
  const link = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-16 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
    >
      <svg
        viewBox="0 0 32 32"
        className="w-8 h-8"
        fill="white"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.34.652 4.53 1.786 6.39L4 29l7.85-1.75A11.93 11.93 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm0 21.7c-1.94 0-3.75-.56-5.28-1.53l-.38-.24-4.66 1.04 1.02-4.55-.25-.4a9.63 9.63 0 0 1-1.54-5.02c0-5.35 4.36-9.7 9.7-9.7 2.59 0 5.02 1.01 6.85 2.84a9.6 9.6 0 0 1 2.85 6.86c.01 5.35-4.35 9.7-9.34 9.7Zm5.32-7.27c-.29-.15-1.71-.84-1.98-.94-.27-.1-.46-.15-.66.15-.19.29-.75.94-.92 1.13-.17.19-.34.22-.63.07-.29-.15-1.23-.45-2.34-1.44-.87-.77-1.45-1.72-1.62-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.15-.66-1.6-.91-2.19-.24-.57-.48-.49-.66-.5h-.56c-.19 0-.51.07-.78.36-.27.29-1.02 1-1.02 2.44s1.05 2.83 1.19 3.03c.15.19 2.06 3.15 5 4.41.7.3 1.24.48 1.67.62.7.22 1.34.19 1.84.12.56-.08 1.71-.7 1.95-1.37.24-.68.24-1.26.17-1.37-.07-.12-.26-.19-.55-.34Z" />
      </svg>
    </a>
  );
}
