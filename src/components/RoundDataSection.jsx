import { useEffect, useState } from "react"
import { fetchRoundInfo } from '../lib/blockchain'
import ANIMALS from '../lib/animals'

export default function RecentWinners({ currentRound, roundIsActive }) {
    const [rounds, setRounds] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadRounds() {
            try {

                const roundsToFetch = []

                if (roundIsActive === false) {
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
                        return { round, winner: roundInfo.winningAnimal, pool: roundInfo.claimablePrize }
                    })
                )

                setRounds(results)
            } catch (err) {
                console.error("Error fetching winners:", err)
            } finally {
                setLoading(false)
            }
        }
        if(currentRound != null){
            loadRounds()
        }
    }, [currentRound,roundIsActive])

    if (loading) {
        return (
            <div className="p-4 text-white  bg-white/5 border border-white/10 rounded-xl w-full text-center">
                Cargando resultados de las últimas rondas...
            </div>
        )
    }

    return (
        <div className="p-4 text-white  bg-white/5 border border-white/10 rounded-xl w-full flex">
            <div className="w-full md:w-1/2 flex justify-center items-center flex-col">

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
                        {rounds.map(({ round, winner }, i) => {
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

            <div className="w-full md:w-1/2 flex justify-center items-center flex-col">

                <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                    Premios Recientes 💰
                </h2>

                <div className="w-full max-w-md">

                    {/* Header */}
                    <div className="flex justify-between text-sm text-white/50 px-3 mb-1">
                        <span>Ronda</span>
                        <span>Premio</span>
                    </div>

                    {/* Rows */}
                    <div className="space-y-1">
                        {rounds.map(({ round, pool }, i) => {
                            return (
                                <div
                                    key={round}
                                    className={`
                flex justify-between items-center px-3 py-2 rounded-lg transition
                ${i % 2 === 0
                                                ? "bg-white/5"
                                                : "bg-white/10"
                                        }
                hover:bg-white/15
              `}
                                >
                                    <span className="font-medium">#{round}</span>

                                    <span className="flex items-center gap-2 font-semibold">
                                        <span>💵</span>
                                        <span>{pool.toFixed(2)}</span>
                                    </span>
                                </div>
                            )
                        })}
                    </div>

                </div>
            </div>
        </div>
    )
}