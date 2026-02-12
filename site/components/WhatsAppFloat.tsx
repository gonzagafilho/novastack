"use client";

export default function WhatsAppFloat() {
  const whatsapp =
    "https://wa.me/5561996088711?text=Ol%C3%A1%21%20Quero%20um%20or%C3%A7amento%20na%20NovaStack%20(Desenvolvimento).";

  return (
    <a
      href={whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-[999] group"
      aria-label="Falar no WhatsApp"
      title="Falar no WhatsApp"
    >
      {/* Tooltip */}
      <div className="pointer-events-none absolute -left-3 top-1/2 hidden -translate-x-full -translate-y-1/2 whitespace-nowrap rounded-xl border border-white/10 bg-[#0D1224]/90 px-3 py-2 text-xs text-[#EAF0FF] shadow-xl shadow-cyan-400/10 opacity-0 transition group-hover:opacity-100 md:block">
        Falar no WhatsApp
      </div>

      {/* Button */}
      <div className="relative grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 shadow-2xl shadow-cyan-400/20 transition hover:scale-[1.03] active:scale-[0.98]">
        {/* Glow ring */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-400/40 to-violet-500/40 blur-md opacity-70" />

        {/* Icon */}
        <svg
          className="relative"
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M20.52 3.48A11.67 11.67 0 0 0 12.06 0C5.5 0 .18 5.3.18 11.85c0 2.09.55 4.13 1.6 5.94L0 24l6.39-1.74a11.9 11.9 0 0 0 5.66 1.44h.01c6.55 0 11.87-5.31 11.87-11.86 0-3.16-1.23-6.12-3.41-8.36ZM12.06 21.6h-.01a9.82 9.82 0 0 1-5-1.36l-.36-.21-3.79 1.03 1.01-3.69-.23-.38a9.76 9.76 0 0 1-1.5-5.14c0-5.4 4.4-9.8 9.82-9.8a9.77 9.77 0 0 1 6.95 2.88 9.73 9.73 0 0 1 2.86 6.94c0 5.4-4.4 9.79-9.8 9.79Zm5.38-7.35c-.3-.15-1.77-.88-2.05-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.96 1.18-.18.2-.35.23-.65.08-.3-.15-1.26-.46-2.4-1.48-.88-.79-1.48-1.77-1.65-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.08-.15-.68-1.64-.93-2.25-.24-.58-.48-.5-.68-.5h-.58c-.2 0-.53.08-.8.38-.27.3-1.05 1.03-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.12 3.23 5.13 4.53.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.41.25-.69.25-1.28.17-1.41-.08-.13-.28-.2-.58-.35Z"
            fill="#070A12"
          />
        </svg>
      </div>
    </a>
  );
}
