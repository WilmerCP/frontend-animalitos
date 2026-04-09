export default function AllowancePopup({ onClose, onConfirm, onConfirmSingle, animal }) {

    let multiple = animal === undefined ? true : false;

    return <div className="fixed top-0 bottom-0 left-0 right-0 bg-black/50 flex items-center justify-center z-50">
        <div className="flex flex-col items-center justify-center w-full max-w-md gap-4 px-4 bg-slate-700 rounded-lg p-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
        {!multiple && <span className="text-2xl text-white text-shadow-black text-shadow-sm">¿Permitir que el contrato gaste tus tokens para apostar por {animal}?</span>}
        {multiple && <span className="text-2xl text-white text-shadow-black text-shadow-sm">¿Permitir que el contrato gaste tus tokens para apostar?</span>}
        <div className="flex items-center gap-4">
            <button onClick={onConfirm} className="py-2 px-4 rounded font-sm font-medium transition-all bg-green-500 hover:bg-green-400">
                Permitir
            </button>
            <button onClick={onConfirmSingle} className="py-2 px-4 rounded font-sm font-medium transition-all bg-green-500 hover:bg-green-400">
                Solo esta apuesta
            </button>
            <button onClick={onClose} className="py-2 px-4 rounded font-sm font-medium transition-all bg-red-500 hover:bg-red-400">
                Cancelar
            </button>
        </div>
        <span className="text-sm text-gray-400">El contrato nunca intentará gastar más de lo que apuestes manualmente.</span>
    </div>
    </div>

}