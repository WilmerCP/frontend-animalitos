import { useGameContext } from "../store/game-context";

export default function PulseDot() {

    let { roundIsActive, remaining } = useGameContext();

    if (!remaining) return null;

    const { hours, minutes, seconds } = remaining;
    const expired = hours === 0 && minutes === 0 && seconds === 0;

    const roundStatus = roundIsActive ? (expired ? "pending" : "active") : "finished";  // "active" | "pending" | "finished" 

    return (
        <span className="relative flex h-2 w-2">
            <span
                className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
                    roundStatus === "active" ? "bg-emerald-400" :
                    roundStatus === "pending" ? "bg-yellow-400" :
                    "bg-red-400"
                }`}
            />
            <span
                className={`relative inline-flex h-2 w-2 rounded-full ${
                    roundStatus === "active" ? "bg-emerald-400" :
                    roundStatus === "pending" ? "bg-yellow-400" :
                    "bg-red-400"
                }`}
            />
        </span>
    );
}