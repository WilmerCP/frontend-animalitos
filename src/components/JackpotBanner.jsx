export default function JackpotBanner({ amount }) {
    const [visible, setVisible] = useState(true);
    if (!visible) return null;

    return (
        <div className="relative flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-500/20 via-yellow-400/20 to-amber-500/20 border-y border-amber-400/30 px-5 py-2 overflow-hidden">
            {/* Shimmer sweep */}
            <div className="pointer-events-none absolute inset-0 animate-[shimmer_2.4s_linear_infinite]"
                style={{
                    background: "linear-gradient(90deg, transparent 0%, rgba(251,191,36,0.15) 50%, transparent 100%)",
                    backgroundSize: "200% 100%",
                }}
            />

            {/* Trophy icon */}
            <span className="text-amber-400 text-base leading-none select-none">⭐</span>

            <p className="text-xs font-medium text-amber-200 whitespace-nowrap">
                <span className="text-amber-400 font-semibold">¡Ronda Especial!</span>
                {" "}Jackpot activo —{" "}
                <span className="text-white font-semibold">
                    ${amount.toLocaleString()}
                </span>{" "}
                bonus
            </p>

            {/* Dismiss */}
            <button
                onClick={() => setVisible(false)}
                className="absolute right-3 text-amber-400/60 hover:text-amber-300 text-base leading-none transition-colors"
                aria-label="Cerrar"
            >
                ×
            </button>
        </div>
    );
}