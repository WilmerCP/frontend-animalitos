import ANIMALS from "../lib/animals.js";
import { FaChevronLeft, FaChevronRight, FaPlus, FaMinus } from "react-icons/fa";
import ClaimReward from './ClaimReward.jsx';
import { useState, useEffect } from "react";
import { claimReward, fetchTotalAnimalBets } from '../lib/blockchain.js'
import { useGameContext } from "../store/game-context.jsx";

function BetLedger({ bets = [], cart = [], roundNumber, roundIsActive, onToggle, isOpen, didWin, claimed, setClaimed, updateCartItem, handleBuyAll }) {

    const { roundInfo } = useGameContext();

  let [earnings, setEarnings] = useState(null);

  const winningId = roundInfo.winningAnimal;

  const cartNotEmpty = cart.some((element) => element > 0);

  async function calculateEarnings() {

    const totalAnimalBets = await fetchTotalAnimalBets(roundNumber, winningId);
    console.log("total animal bets: ", totalAnimalBets);

    const winningBet = bets.find(bet => bet.id === winningId);

    const prize = (winningBet.amount * roundInfo.claimablePrize) / totalAnimalBets;
    setEarnings(prize);


  }

  useEffect(() => {

    if (didWin) {

      calculateEarnings();


    }

  }, [didWin]);

  async function handleClaims() {

    let result = await claimReward(roundNumber);

    if (result) {

      setClaimed(true);

    }

  }


  return (
    <div className={`betledger h-screen sticky top-0 bg-zinc-200 text-card-foreground flex flex-col transition-all duration-300 ${isOpen ? "md:translate-x-0 md:w-1/5" : "md:translate-x-full md:w-0"} `}>
      <div className="p-4 border-b border-gray-300">
        <h2 className=" text-xl font-bold text-stone-950 tracking-tight text-start">Apuestas</h2>
        <p className="text-xs mt-0.5 text-stone-800 text-start">Ronda #{roundNumber} - {roundIsActive ? "Activa" : "Finalizada"}</p>
      </div>

      <div className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400 scrollbar-track-gray-200 scrollbar-track-zinc-200">

        {cartNotEmpty && roundIsActive &&
          <div className="space-y-2 p-3 rounded-xl border-2 border-dashed border-red-400 bg-yellow-400/5 mb-5">
            <p className="text-xs uppercase text-stone-950 font-semibold">
              Pendiente
            </p>
            {cart.map((amount, index) => {
              const animal = ANIMALS[index];

              if (amount <= 0) {
                return null;
              }

              return (
                <div
                  key={index + 100}
                  className={`flex items-center gap-2 p-2 rounded-md text-sm transition-all bg-gray-100`}>
                  <span className="text-base">{animal.emoji}</span>
                  <span className="font-semibold flex-1 text-stone-800">{animal.name}</span>
                  <span className="font-body text-xs text-stone-800">
                    {amount} {amount === 1 ? "ticket" : "tickets"}
                  </span>
                  <button className={"text-black"} onClick={() => { updateCartItem(index, amount - 1) }}>
                    <FaMinus />
                  </button>
                  <button className="text-black" onClick={() => { updateCartItem(index, amount + 1) }}>
                    <FaPlus />
                  </button>

                </div>
              );
            })}
            <button
              onClick={handleBuyAll}
              className={`
                w-full mt-3 py-3 rounded-md text-sm
                transition-all duration-200

                bg-green-600

                hover:bg-green-500
                hover:scale-[1.02]

                active:scale-[0.98]

                disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100

                shadow-lg shadow-yellow-500/20
                `}>
              Comprar todo
            </button>
          </div>
        }

        {bets.length === 0 ? (
          <p className="text-sm italic text-center text-stone-700 mt-8">
            No has hecho ninguna apuesta
          </p>
        ) : (
          <div className="space-y-2">
            {didWin && <ClaimReward earnings={earnings} claimed={claimed} onClaim={handleClaims} />}
            {bets.map((bet) => {
              const animal = ANIMALS[bet.id];
              const isWinner = winningId === bet.id;
              return (
                <div
                  key={bet.id}
                  className={`flex items-center gap-2 p-2 rounded-md text-sm transition-all ${isWinner
                    ? "bg-yellow-100 ring-2 ring-yellow-400"
                    : "bg-gray-100"
                    }`}
                >
                  <span className="text-base">{animal.emoji}</span>
                  <span className="font-semibold flex-1 text-stone-800">{animal.name}</span>
                  <span className="font-body text-xs text-stone-800">
                    {bet.amount} {bet.amount === 1 ? "ticket" : "tickets"}
                  </span>
                  {isWinner && (
                    <span className=" text-xs font-body font-semibold text-green-600">WIN</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-b border-gray-300">
        <div className="flex justify-between text-xs font-body text-stone-800">
          <span>Total de animales</span>
          <span>{bets.length}</span>
        </div>
        <div className="flex justify-between text-xs font-body text-stone-800 mt-1">
          <span>Total de tickets</span>
          <span>{bets.reduce((s, b) => s + b.amount, 0)}</span>
        </div>
      </div>

      <button
        className="absolute left-[-32px] bottom-6 bg-zinc-200 text-stone-900 hover:text-yellow-500 rounded-l-md p-2  transition"
        onClick={() => onToggle()}
      >
        {isOpen ? <FaChevronRight /> : <FaChevronLeft />}
      </button>
    </div>
  );
};

export default BetLedger;
