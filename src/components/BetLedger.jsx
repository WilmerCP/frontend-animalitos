import { ANIMALS } from "../lib/animals.js";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useState } from "react";

function BetLedger({ bets = [], roundNumber, winningId, onToggle, isOpen }) {

  return (
    <div className={`betledger h-screen sticky top-0 bg-zinc-200 text-card-foreground flex flex-col transition-all duration-300 ${isOpen ? "md:translate-x-0 md:w-1/5" : "md:translate-x-full md:w-0"} `}>
      <div className="p-4 border-b border-gray-300">
        <h2 className=" text-xl font-bold text-stone-950 tracking-tight text-start">Apuestas</h2>
        <p className="text-xs mt-0.5 text-stone-800 text-start">Ronda #{roundNumber}</p>
      </div>

      <div className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400 scrollbar-track-gray-200 scrollbar-track-zinc-200">
        {bets.length === 0 ? (
          <p className="text-sm italic text-center text-stone-700 mt-8">
            No has hecho ninguna apuesta
          </p>
        ) : (
          <div className="space-y-2">
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
                    <span className=" text-xs font-body font-semibold">WIN</span>
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
        {isOpen ? <FaChevronRight  /> : <FaChevronLeft />}
      </button>
    </div>
  );
};

export default BetLedger;
