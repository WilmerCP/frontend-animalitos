import { useGameContext } from "../store/game-context";

export default function RemainingTime({ timestamp }) {
  let { remaining } = useGameContext();

  return (
    <div className="md:grid grid-cols-3 gap-3 z-10 md:absolute hidden bottom-10 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none">
      {[
        { label: "horas",   value: remaining.hours },
        { label: "minutos", value: remaining.minutes },
        { label: "segundos", value: remaining.seconds },
      ].map(({ label, value }) => (
        <div
          key={label}
          className="bg-slate-700 rounded-lg p-1 text-center"
        >
          <div className="text-xl font-semibold tabular-nums">
            {String(value).padStart(2, "0")}
          </div>
          <div className="text-xs text-slate-400">
            {label}
          </div>
        </div>
      ))}
    </div>
  )
}