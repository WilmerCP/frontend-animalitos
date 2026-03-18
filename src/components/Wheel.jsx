import { useMemo, useEffect, useState } from "react";
import { ANIMALS } from "../lib/animals.js";
import Pointer from "./Pointer.jsx";

const SEGMENT_ANGLE = 360 / 32;



function Wheel({ isSpinning, highlightedId, winnerId }) {

  const [rotation, setRotation] = useState(0);
  const [speed, setSpeed] = useState(0.05); // grados por frame, lento al inicio

  useEffect(() => {
    if (winnerId != null) {
      spinToWinner(winnerId);
      console.log("winner has id: " + winnerId)
    }
  }, [winnerId]);

  useEffect(() => {
    let raf;

    function animate() {
      setRotation(prev => (prev + speed) % 360);
      raf = requestAnimationFrame(animate);
    }

    if (isSpinning && speed > 0) {
      raf = requestAnimationFrame(animate);
    }

    return () => cancelAnimationFrame(raf);
  }, [isSpinning, speed]);

  const spinToWinner = (winnerId) => {
    const N = ANIMALS.length;
    const SEGMENT_ANGLE = 360 / N;

    const targetAngle = winnerId * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;

    // Añadimos varias vueltas extra
    const extraRotations = 5;
    const finalAngle = targetAngle + 360 * extraRotations;

    // Desactivamos el giro lento
    setSpeed(0);

    // Animación CSS para girar rápido y detenerse en el animal
    setRotation(prev => prev); // fuerza el repaint
    setTimeout(() => {
      setRotation(finalAngle);
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
    <div className="relative md:flex-1 w-full md:w-auto aspect-square mx-0">
      {/* Pointer component positioned above the wheel */}
      <Pointer />
      <svg
        viewBox="0 0 400 400"
        className="w-full max-w-[700px] md:mx-auto"
        style={{
          transform: `rotate(-${rotation}deg)`,
          transition: speed === 0
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
