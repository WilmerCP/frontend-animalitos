export default function PulseDot({ active }) {
    return (
        <span className="relative flex h-2 w-2">
            <span
                className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${active ? "bg-emerald-400" : "bg-red-400"
                    }`}
            />
            <span
                className={`relative inline-flex h-2 w-2 rounded-full ${active ? "bg-emerald-400" : "bg-red-400"
                    }`}
            />
        </span>
    );
}