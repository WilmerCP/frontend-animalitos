import { useMemo, useEffect, useState } from "react";
import ANIMALS from "../lib/animals.js";
import Pointer from "./Pointer.jsx";

const SEGMENT_ANGLE = 360 / 32;



function Wheel({ isSpinning, highlightedId, winnerId }) {

  const [rotation, setRotation] = useState(0);
  const [showWinner, setShowWinner] = useState(false);

  useEffect(() => {
    if (isSpinning == false && winnerId != null) {
      setShowWinner(false); 
      spinToWinner(winnerId);
      console.log("winner has id: " + winnerId)
    }else{
      setShowWinner(false);
    }
  }, [winnerId,isSpinning]);

  useEffect(() => {
    let raf;

    function animate() {
      setRotation(prev => (prev + 0.05) % 360);
      raf = requestAnimationFrame(animate);
    }

    if (isSpinning) {
      raf = requestAnimationFrame(animate);
    }

    return () => cancelAnimationFrame(raf);
  }, [isSpinning]);

  const spinToWinner = (winnerId) => {
    const N = ANIMALS.length;
    const SEGMENT_ANGLE = 360 / N;

    const targetAngle = winnerId * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;

    // Añadimos varias vueltas extra
    const extraRotations = 5;
    const finalAngle = targetAngle + 360 * extraRotations;

    // Animación CSS para girar rápido y detenerse en el animal
    setRotation(prev => prev); // fuerza el repaint
    setTimeout(() => {
      setRotation(finalAngle);
      setTimeout(() => {
      setShowWinner(true); // Show winner label after animation
    }, 4000);
    }, 50);
  };

  const segments = useMemo(() => {
    return ANIMALS.map((animal, i) => {
      const startAngle = i * SEGMENT_ANGLE;
      const endAngle = startAngle + SEGMENT_ANGLE;
      const startRad = (Math.PI / 180) * (startAngle - 90);
      const endRad = (Math.PI / 180) * (endAngle - 90);

      const x1 = 200 + 190 * Math.cos(startRad);
      const y1 = 200 + 190 * Math.sin(startRad);
      const x2 = 200 + 190 * Math.cos(endRad);
      const y2 = 200 + 190 * Math.sin(endRad);

      const midRad = (Math.PI / 180) * ((startAngle + SEGMENT_ANGLE / 2) - 90);
      const textX = 200 + 170 * Math.cos(midRad);
      const textY = 200 + 170 * Math.sin(midRad);
      const textRotation = startAngle + SEGMENT_ANGLE / 2;

      const isHighlighted = highlightedId === animal.id;
      const isWinner = winnerId === animal.id && !isSpinning;

      return (
        <g key={animal.id}>
          <path
            d={`M200,200 L${x1},${y1} A190,190 0 0,1 ${x2},${y2} Z`}
            fill={animal.color}
            stroke="hsl(228, 25%, 14%)"
            strokeWidth="1.5"
            opacity={isHighlighted || isWinner ? 1 : 0.75}
            className="transition-opacity duration-200"
          />
          {isWinner && (
            <path
              d={`M200,200 L${x1},${y1} A190,190 0 0,1 ${x2},${y2} Z`}
              fill="hsl(4, 94%, 41%)"
              opacity={0.9}
            />
          )}
          <text
            x={textX}
            y={textY}
            textAnchor="middle"
            dominantBaseline="middle"
            transform={`rotate(${textRotation}, ${textX}, ${textY})`}
            fill="hsl(40, 20%, 94%)"
            fontSize="18"
            fontFamily="'Cormorant Garamond', serif"
            fontWeight="600"
          >
            {animal.emoji}
          </text>
        </g>
      );
    });
  }, [highlightedId, winnerId, isSpinning]);

  return (
    <div className="relative md:flex-1 w-full h-full md:w-auto aspect-square mx-0">
      {/* Pointer component positioned above the wheel */}
      <Pointer />
      {showWinner && winnerId != null &&
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 rounded-xl
          shadow-lg border-4 border-slate-900 text-black font-bold text-2xl drop-shadow-[0_2px_8px_rgba(255,215,0,0.7)] text-center p-2 animate-in fade-in duration-500">
          {`Ganador:`} <br/>
          {`${ANIMALS[winnerId].name} ${ANIMALS[winnerId].emoji}`}
        </span>}
      <svg
        viewBox="0 0 400 400"
        className="w-full max-w-[700px] md:mx-auto"
        style={{
          transform: `rotate(-${rotation}deg)`,
          transition: isSpinning == false
            ? "transform 4s cubic-bezier(0.15, 0.6, 0.25, 1)"
            : "none"
        }}
      >
        {/* Outer ring */}
        <circle cx="200" cy="200" r="195" fill="none" stroke="hsl(228, 15%, 25%)" strokeWidth="3" />
        {segments}
        {/* Center hub */}
        <circle cx="200" cy="200" r="30" fill="hsl(228, 25%, 14%)" stroke="hsl(228, 15%, 25%)" strokeWidth="2" />
        <circle cx="200" cy="200" r="15" fill="hsl(4, 67%, 50%)" opacity="0.8" />
      </svg>
    </div>
  );
};

export default Wheel;
