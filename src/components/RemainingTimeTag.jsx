import { useGameContext } from "../store/game-context";

export default function RemainingTimeTag() {

let { roundIsActive, remaining } = useGameContext();

  const { hours, minutes, seconds } = remaining;
  const expired = hours === 0 && minutes === 0 && seconds === 0;

  return (
    <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1">
      <span className="text-xs text-slate-400 tabular-nums">
        {`${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`}
      </span>
    </div>
  )
}