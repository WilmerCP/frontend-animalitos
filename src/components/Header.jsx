import { GiHamburgerMenu } from "react-icons/gi";
import { Link } from "react-router-dom";
import { useGameContext } from "../store/game-context.jsx";
import PulseDot from "./PulseDot.jsx";
import StarIcon from "./StarIcon.jsx";

export default function Header() {

    const { setDrawerOpen, currentRound, roundIsActive, roundInfo, jackpotAmount } = useGameContext();

    return <div className='flex flex-row items-center justify-between bg-slate-600 p-5 gap-6 sticky top-0 z-10'>
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-10 h-10 flex items-center justify-center text-2xl">
                🐾
            </div>
            <h1 className="font-semibold text-2xl text-white tracking-tight">
                Crypto{" "}
                <span className="text-white text-2xl">Animalitos</span>
            </h1>
        </Link>
        <div className="flex flex-row gap-5 items-center">
            {/* Special round badge */}
            {roundInfo.isSpecial &&
                <div className="flex items-center gap-2 bg-white/[0.06] border border-white/[0.10] rounded-full px-3 py-1.5">
                    <StarIcon />
                    <span className="text-xs font-medium text-white/80 whitespace-nowrap">
                        {`Ronda Especial — ${jackpotAmount}$ BONUS`}
                    </span>
                </div>}
            {/* Round badge */}
            <div className="flex items-center gap-2 bg-white/[0.06] border border-white/[0.10] rounded-full px-3 py-1.5">
                <PulseDot active={roundIsActive} />
                <span className="text-xs font-medium text-white/80 whitespace-nowrap">
                    Ronda {currentRound} —{" "}
                    {roundIsActive ? "ACTIVA" : "FINALIZADA"}
                </span>
            </div>
            <GiHamburgerMenu
                className="text-2xl text-white h-6 w-6 transition-all duration-200 hover:scale-[1.1] active:scale-[0.98] cursor-pointer"
                onClick={() => setDrawerOpen(true)}
                style={{ display: "block" }}
            />
        </div>
    </div>
}