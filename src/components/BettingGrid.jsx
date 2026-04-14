import React, { useRef } from "react";
import ANIMALS from "../lib/animals";
import { useIsMobile } from '../hooks/useIsMobile.js'

function BettingGrid({
  onSelectAnimal,
  selectedAnimal,
  onHoverAnimal,
  disabled,
  columnNumber
}) {
  const isMobile = useIsMobile()
  const gridRef = useRef(null)

  function handleSelect(id) {
    onSelectAnimal(id)
    if (isMobile && gridRef.current) {
      const top = gridRef.current.getBoundingClientRect().top + window.scrollY - 20 // adjust 80 to your liking
      window.scrollTo({ top, behavior: "smooth" })
    }
  }

  return (
    <div ref={gridRef} className={`grid md:grid-cols-${columnNumber} grid-cols-4 gap-1.5 mx-0 mt-6 transition-all duration-300`}>
      {ANIMALS.map((animal) => {
        const isSelected = selectedAnimal === animal.id;
        return (
          <button
            key={animal.id}
            disabled={disabled}
            onClick={() => handleSelect(animal.id)}
            onMouseEnter={() => onHoverAnimal(animal.id)}
            onMouseLeave={() => onHoverAnimal(null)}
            className={`
              flex flex-col items-center justify-center p-1.5 rounded-md text-xs
              transition-all duration-150 font-body
              ${isSelected
                ? "bg-slate-500 text-parchment ring-2 scale-105"
                : "bg-slate-700 text-foreground hover:bg-muted/80 hover:scale-105"
              }
              ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
          >
            <span className="text-lg leading-none">{`${animal.id + 1} ${animal.emoji}`}</span>
            <span className="mt-0.5 text-sm font-semibold truncate w-full text-center">
              {animal.name}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default BettingGrid;