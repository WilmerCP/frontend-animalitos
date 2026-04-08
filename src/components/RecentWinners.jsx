import { useEffect, useState } from "react"
import { fetchRoundInfo } from '../lib/blockchain'
import ANIMALS from '../lib/animals'

export default function RecentWinners({ currentRound, roundIsActive }) {
  const [winners, setWinners] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadWinners() {
      try {

        const roundsToFetch = []

        if(roundIsActive === false){
          roundsToFetch.push(currentRound);
        }

        // last 5 rounds (avoid negatives)
        for (let i = 0; i < 5; i++) {
          const round = currentRound - i - 1
          if (round > 0) {
            roundsToFetch.push(round)
          }
        }

        const results = await Promise.all(
          roundsToFetch.map(async (round) => {
            const roundInfo = await fetchRoundInfo(round)
            return { round, winner: roundInfo.winningAnimal }
          })
        )

        setWinners(results)
      } catch (err) {
        console.error("Error fetching winners:", err)
      } finally {
        setLoading(false)
      }
    }
    console.log("current round in RecentWinners: ", currentRound)
    loadWinners()
  }, [currentRound])

  if (loading) {
    return (
      <div className="p-4 text-white">
        Cargando resultados de las últimas rondas...
      </div>
    )
  }

  return (
    <div className="p-4 text-white flex justify-center items-center flex-col bg-white/5 border border-white/10 rounded-xl w-full md:w-1/2">

      <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
        Ganadores Recientes 🏆
      </h2>

      <div className="w-full max-w-md">

        {/* Header */}
        <div className="flex justify-between text-sm text-white/50 px-3 mb-1">
          <span>Ronda</span>
          <span>Ganador</span>
        </div>

        {/* Rows */}
        <div className="space-y-1">
          {winners.map(({ round, winner }, i) => {
            const animal = ANIMALS[winner]

            return (
              <div
                key={round}
                className={`
                flex justify-between items-center px-3 py-2 rounded-lg transition
                ${i === 0
                    ? "bg-yellow-500/10 border border-yellow-400/30"
                    : i % 2 === 0
                      ? "bg-white/5"
                      : "bg-white/10"
                  }
                hover:bg-white/15
              `}
              >
                <span className="font-medium">#{round}</span>

                <span className="flex items-center gap-2 font-semibold">
                  <span>{animal.emoji}</span>
                  <span>{animal.name}</span>
                </span>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}