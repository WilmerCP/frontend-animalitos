export default function ClaimReward({onClaim, earnings, claimed}) {

    const boton = (claimed ?
         <button disabled
            className="bg-green-300 text-stone-800 p-2 rounded-md">
                Pago realizado
            </button> : 
            <button onClick={onClaim}
            className="bg-green-500 border-green-800 hover:bg-green-300 hover:border-green-300 border-1 text-stone-800 p-2 rounded-md transition-all">
                Reclamar ganancias
            </button>)

    return <div>
        <div
            className={`flex flex-col items-center gap-1 p-2 rounded-md text-sm transition-all bg-yellow-100 ring-2 ring-yellow-400`}>
            <span className="font-semibold flex-1 text-stone-800">¡Felicidades!</span>
            <span className="font-body text-xs text-stone-800">
                Has ganado:
            </span>
            <span className="font-semibold text-md text-green-800">
                {earnings}$
            </span>

            {boton}

        </div>
    </div>;


}