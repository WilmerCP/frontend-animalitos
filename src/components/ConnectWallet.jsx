import { useState } from "react";
import { connectMetaMask } from "../lib/blockchain";
import { useGameContext } from "../store/game-context";

export default function ConnectWallet() {

    let [ignored, setIgnored] = useState(false);
    let { walletState, setWalletState } = useGameContext();

    if (ignored || walletState == 'connected' || walletState == 'changing') return null;

    if (walletState == "no-metamask") return (
        <div className="flex flex-col md:flex-row md:gap-3 items-center justify-between fixed md:p-5 p-3 md:bottom-5 md:left-0 md:right-0 md:top-auto  gap-3 mx-auto bottom-5 left-4 right-4 max-w-[1000px] bg-slate-700 z-30 rounded-xl">

            <div className="flex-row flex items-center gap-5">
                <span className="bg-amber-600 p-2 text-xl rounded-xl">🦊</span>
                <div className="text-left">
                    <h3 className="md:text-xl text-sm text-white">Conecta tu cartera</h3>
                    <p className="md:text-md text-xs text-white">Instala la cartera <a href="https://metamask.io/" className="underline" target="_blank" rel="noopener noreferrer">Metamask</a> en tu navegador para poder apostar</p>
                </div>
            </div>
            <div className="flex flex-row gap-2 md:w-fit w-full">
                <button className="md:text-sm text-sm flex-1 md:flex-0 bg-slate-400 md:p-2 p-2 rounded hover:bg-slate-500 transition-all" onClick={() => { setIgnored(true) }}>Ignorar</button>
                <button className="md:text-sm text-sm flex-1 md:flex-0 bg-red-500 md:p-2 p-2 rounded text-zinc-200 hover:bg-red-400 transition-all" onClick={() => { window.open('https://metamask.io/download/', '_blank') }}>Instalar</button>
            </div>
        </div>);

}