import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdEyeOff, IoMdEye } from "react-icons/io";
import { useGameContext } from "../store/game-context";
import PulseDot from "./PulseDot";
import RemainingTimeTag from "./RemainingTimeTag";


export default function GameHeader() {

    const { currentRound, roundIsActive, tokenBalance,
        hideBalance, setHideBalance, setDrawerOpen, roundInfo, remaining } = useGameContext();

    const { hours, minutes, seconds } = remaining;
    const expired = hours === 0 && minutes === 0 && seconds === 0;

    const roundStatus = roundIsActive ? (expired ? "Pendiente" : "Activa") : "Finalizada";

    let roundStatusText = `Ronda ${currentRound} — ${roundStatus}`;

    return (
        <>
            <div className="hidden md:flex flex-col w-full">
                {/* Top bar — title + hamburger */}
                <div className="bg-slate-800 px-6 py-4 flex items-center justify-between">
                    <span className="text-2xl font-medium text-slate-100 tracking-tight">Crypto Animalitos</span>
                    <button
                        onClick={() => setDrawerOpen(prev => !prev)}
                        className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-white/10 transition-colors"
                    >
                        <GiHamburgerMenu className="text-slate-400 text-lg" />
                    </button>
                </div>

                {/* Info bar — tags */}
                <div className="bg-slate-900 px-6 py-2 flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1">
                        <PulseDot active={!roundIsActive} />
                        <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                            {roundStatusText}
                        </span>
                    </div>
                    <RemainingTimeTag timestamp={roundInfo.roundEndTime} />
                    <div
                        className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1 cursor-pointer hover:bg-white/10 transition-colors ml-auto"
                        onClick={() => setHideBalance(!hideBalance)}
                    >
                        {hideBalance ? <IoMdEyeOff className="text-slate-400 text-xs" /> : <IoMdEye className="text-slate-400 text-xs" />}
                        <span className="text-xs text-slate-400">
                            Balance: <b className="text-slate-200">{hideBalance ? '••••' : `${tokenBalance} $`}</b>
                        </span>
                    </div>
                </div>
            </div>

            <div className="w-full md:hidden">
                {/* Top bar — title + hamburger */}
                <div className="bg-slate-800 px-4 py-3 flex items-center justify-between">
                    <span className="text-2xl font-medium text-slate-100 tracking-tight">Crypto Animalitos</span>
                    <button
                        onClick={() => setDrawerOpen(prev => !prev)}
                        className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-white/10 transition-colors"
                    >
                        <GiHamburgerMenu className="text-slate-400 text-lg" />
                    </button>
                </div>

                {/* Info bar — tags */}
                <div className="bg-slate-900 px-4 py-2 flex items-center justify-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1">
                        <PulseDot active={!roundIsActive} />
                        <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                            {roundStatusText}
                        </span>
                    </div>
                    <RemainingTimeTag timestamp={roundInfo.roundEndTime} />

                    <div
                        className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1 cursor-pointer hover:bg-white/10 transition-colors"
                        onClick={() => setHideBalance(!hideBalance)}
                    >
                        {hideBalance ? <IoMdEyeOff className="text-slate-400 text-xs" /> : <IoMdEye className="text-slate-400 text-xs" />}
                        <span className="text-xs text-slate-400">
                            Balance: <b className="text-slate-200">{hideBalance ? '••••' : `${tokenBalance} $`}</b>
                        </span>
                    </div>
                </div>
            </div>
        </>
    );


}