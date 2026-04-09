import { useEffect, useRef } from "react";
import { FaChevronLeft, FaTimes } from "react-icons/fa";

/**
 * DrawerMenu
 *
 * Overlays exactly where the sidebar (BetLedger) sits.
 * Props:
 *   isOpen        — same sidebar isOpen signal (controls right-edge position)
 *   isDrawerOpen  — whether this drawer is visible
 *   onClose       — callback to close the drawer
 *   children      — drawer content
 */
const DrawerMenu = ({ isOpen, isDrawerOpen, onClose, children }) => {
  const drawerRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape" && isDrawerOpen) onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isDrawerOpen, onClose]);

  // Close on outside click (backdrop)
  const handleBackdropClick = (e) => {
    if (drawerRef.current && !drawerRef.current.contains(e.target)) {
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop — only covers the non-sidebar area so the sidebar shadow effect is preserved */}
      <div
        onClick={handleBackdropClick}
        className={`
          fixed inset-0 z-40
          bg-black/30 backdrop-blur-[1px]
          transition-opacity duration-300
          ${isDrawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      />

      {/*
        The drawer mirrors the sidebar's position logic exactly:
        - right-0 always
        - When sidebar isOpen: w-1/5
        - When sidebar is closed: w-0 (but drawer ignores that — it stays at right-0 edge)

        We position it fixed to the right edge. Its width mirrors the sidebar width
        so it perfectly overlays it. When the sidebar is closed the drawer also
        slides to the far right (translate-x-full) so they move together.
      */}
      <div
        ref={drawerRef}
        className={`
          fixed top-0 right-0 bottom-0 z-50
          flex flex-col
          bg-zinc-200 text-card-foreground
          shadow-2xl
          transition-all duration-300

          ${isOpen ? "md:w-1/5" : "md:w-1/5"}

          ${isDrawerOpen
            ? isOpen
              ? "translate-x-0"          // sidebar open: sit right on top of it
              : "translate-x-0 md:right-0" // sidebar closed: drawer slides in from right edge
            : "translate-x-full"          // hidden: off-screen right
          }
        `}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-300 flex items-center justify-between">
          <h2 className="text-xl font-bold text-stone-950 tracking-tight">Menú</h2>
          <button
            onClick={onClose}
            className="text-stone-600 hover:text-stone-950 transition p-1 rounded-md hover:bg-zinc-200"
            aria-label="Cerrar menú"
          >
            <FaTimes />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400 scrollbar-track-zinc-200 p-4">
          {children ?? <MenuContent onClose={onClose} />}
        </div>
      </div>
    </>
  );
};

const MenuContent = ({ onClose }) => {
  const links = [
    { label: "Inicio", icon: "🎡" },
    { label: "Historial", icon: "📋" },
    { label: "Estadísticas", icon: "📊" },
    { label: "Configuración", icon: "⚙️" },
    { label: "Ayuda", icon: "❓" },
  ];

  return (
    <nav className="space-y-1">
      {links.map(({ label, icon }) => (
        <button
          key={label}
          onClick={onClose}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-stone-800 hover:bg-zinc-200 transition-colors text-left"
        >
          <span className="text-base">{icon}</span>
          {label}
        </button>
      ))}
    </nav>
  );
};

export default DrawerMenu;