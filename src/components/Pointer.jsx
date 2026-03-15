import React from "react";

function Pointer() {
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: 0,
        transform: "translateX(-50%)",
        zIndex: 10,
        width: 40,
        height: 40,
        pointerEvents: "none"
      }}
    >
      <svg width="40" height="40" viewBox="0 0 40 40">
        <polygon
          points="10,10 30,10 20,35"
          fill="hsl(4, 67%, 50%)"
          stroke="hsl(228, 25%, 14%)"
          strokeWidth="2"
          filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))"
        />
      </svg>
    </div>
  );
}

export default Pointer;
