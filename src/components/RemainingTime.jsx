import { useState, useEffect } from "react"

export default function RemainingTime({ timestamp }) {
  const [remaining, setRemaining] = useState(null)

  useEffect(() => {
    const targetMs = timestamp * 1000
    let interval;

    function tick() {
      const diff = targetMs - Date.now()
      if (diff <= 0) {
        setRemaining({
        hours:   0,
        minutes: 0,
        seconds: 0,
      })
        clearInterval(interval)
        return
      }
      const totalSec = diff / 1000
      setRemaining({
        hours:   Math.floor(totalSec / 3600),
        minutes: Math.floor((totalSec % 3600) / 60),
        seconds: Math.floor(totalSec % 60),
      })
    }

    tick() // run immediately so there's no 1s delay on mount
    interval = setInterval(tick, 1000)

    return () => clearInterval(interval) // cleanup on unmount

  }, [timestamp]) 

  if (!remaining) return null

  return (
    <div className="grid grid-cols-3 gap-3 z-10 absolute bottom-10 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none">
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