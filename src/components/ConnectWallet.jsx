import { useState } from "react";
import { connectMetaMask } from "../lib/blockchain";
import { useGameContext } from "../store/game-context";

export default function ConnectWallet() {

    let [ignored, setIgnored] = useState(false);
    let { walletState, setWalletState } = useGameContext();

    if(ignored || walletState == 'connected' || walletState == 'changing') return null;

    if(walletState == "no-metamask") return (<div className="flex flex-row gap-3 items-center justify-between absolute p-5 bottom-5 left-0 right-0 mx-auto max-w-[1000px] bg-slate-700 z-30 rounded-xl">

        <div className="flex-row flex items-center gap-5">
        <span className="bg-amber-600 p-2 text-xl rounded-xl">🦊</span>
        <div className="text-left">
            <h3 className="text-xl text-white">Conecta tu cartera</h3>
            <p className="text-md text-white">Instala la cartera <a href="https://metamask.io/" className="underline" target="_blank" rel="noopener noreferrer">Metamask</a> en tu navegador para poder apostar</p>
        </div>
        </div>
        <div className="flex flex-row gap-2">
            <button className="bg-slate-400 p-2 rounded hover:bg-slate-500 transition-all" onClick={()=>{setIgnored(true)}}>Ignorar</button>
            <button className="bg-red-500 p-2 rounded text-white hover:bg-red-400 transition-all" onClick={()=>{window.open('https://metamask.io/download/', '_blank')}}>Instalar</button>
        </div>
    </div>);

}