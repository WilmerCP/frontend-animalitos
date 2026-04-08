import { useState, useEffect } from "react";
import ANIMALS from "../lib/animals.js";

function TicketSelector({ animalId, onConfirm, onClose, bets = [], compact }) {
  const [tickets, setTickets] = useState(1);
  const animal = ANIMALS[animalId];

  const disabled = bets.some(bet => bet.id === animalId);

  function placeBet() {

    if (!disabled) {

      onConfirm(animalId,tickets);

    }

  }

  useEffect(() => {
    const placedBet = bets.find(bet => bet.id === animalId);
    if (placedBet) {
      setTickets(placedBet.amount);
    } else {
      setTickets(1);
    }
  }, [animalId, bets]);



  if (compact) {

    return <div className="flex flex-col w-full gap-1 bg-slate-700 rounded-lg p-4 mt-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="flex justify-between items-center">
        <span className="flex flex-row gap-2">
          <span className="text-2xl">{animal.emoji}</span>
          <span className="font-semibold text-lg">{animal.name}</span>
        </span>

        <button onClick={onClose} className="text-slate-500 hover:text-white text-lg ml-1">
          ✕
        </button>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 mx-auto">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => {
                if (!disabled) {

                  setTickets(n)

                }

              }}
              className={`w-7 h-7 rounded text-sm font-medium transition-all

              ${tickets === n
                  ? disabled
                    ? "bg-yellow-500"
                    : "bg-red-500"
                  : "bg-slate-600 hover:bg-slate-500"
                }`}
            >
              {n}
            </button>
          ))}
        </div>
        <button
          onClick={placeBet}
          className={`p-2 rounded font-sm font-medium transition-all ml-2 
           ${disabled ? "bg-slate-600 hover:bg-slate-500" : "bg-red-500 hover:bg-red-400 "}`}
        >
          Comprar
        </button>
      </div>


    </div>

  } else {

    return <div className="flex flex-row items-center justify-between w-full gap-1 px-4 bg-slate-700 rounded-lg p-4 mt-3 animate-in fade-in slide-in-from-bottom-2 duration-200">


      <span className="text-2xl">{animal.emoji}</span>
      <span className="font-semibold text-lg">{animal.name}</span>


      <div className="flex items-center gap-2 ml-auto">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => {
              if (!disabled) {

                setTickets(n)

              }

            }}
            className={`w-7 h-7 rounded text-sm font-medium transition-all

              ${tickets === n
                ? disabled
                  ? "bg-yellow-500"
                  : "bg-red-500"
                : "bg-slate-600 hover:bg-slate-500"
              }`}
          >
            {n}
          </button>
        ))}
      </div>
      <button
        onClick={placeBet}
        className={`py-2 px-4 rounded font-sm font-medium transition-all ml-3 
           ${disabled ? "bg-slate-600 hover:bg-slate-500" : "bg-red-500 hover:bg-red-400 "}`}
      >
        Comprar
      </button>
      <button onClick={onClose} className="text-slate-500 hover:text-white text-lg mx-2">
        ✕
      </button>

    </div>

  }
};

export default TicketSelector;
