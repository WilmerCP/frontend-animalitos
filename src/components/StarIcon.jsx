export default function StarIcon() {
    return (
        <>
            <style>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.18); opacity: 0.7; }
        }
      `}</style>
            <svg
                viewBox="0 0 24 24"
                fill="#fbbf24"
                style={{ width: 18, height: 18, animation: "breathe 2s ease-in-out infinite" }}
            >
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
            </svg>
        </>
    );
}