import { useEffect } from "react";

export default function AllowancePopup({ onClose, onConfirm, onConfirmSingle, animal }) {

    let multiple = animal === undefined ? true : false;

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    return <div className="fixed top-0 bottom-0 left-0 right-0 bg-black/50 flex items-center justify-center z-50">
        <div className="flex flex-col items-center justify-center w-full md:max-w-md max-w-[90%] gap-4 px-4 bg-slate-700 rounded-lg p-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
        {!multiple && <span className="md:text-2xl text-xl text-zinc-100 text-shadow-black text-shadow-xs">¿Permitir que el contrato gaste tus tokens para apostar por {animal}?</span>}
        {multiple && <span className="md:text-2xl text-xl text-zinc-100 text-shadow-black text-shadow-xs">¿Permitir que el contrato gaste tus tokens para apostar?</span>}
        <div className="flex items-center justify-center flex-wrap md:gap-4 gap-y-2 gap-x-4 ">
            <button onClick={onConfirmSingle} className="py-3 px-4 rounded flex-1 font-sm whitespace-nowrap md:font-medium transition-all bg-green-700 hover:bg-green-400 text-zinc-200">
                Solo esta apuesta
            </button>
            <span className="w-full sm:hidden" />
            <button onClick={onConfirm} className="py-3 px-4 rounded flex-1 font-sm md:font-medium transition-all bg-green-700 hover:bg-green-400 text-zinc-200">
                Permitir
            </button>
            <button onClick={onClose} className="py-3 px-4 rounded flex-1 font-sm md:font-medium transition-all bg-red-500 hover:bg-red-400 text-zinc-200">
                Cancelar
            </button>
        </div>
        <span className="text-sm text-gray-400">El contrato nunca intentará gastar más de lo que apuestes manualmente.</span>
    </div>
    </div>

}