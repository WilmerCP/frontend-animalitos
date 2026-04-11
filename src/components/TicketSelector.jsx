import ANIMALS from "../lib/animals.js";

function TicketSelector({ animalId, onConfirm, onAdd, onClose, bets = [], compact, roundIsActive, tickets, setTickets }) {
  const animal = ANIMALS[animalId];


  const disabled = bets.some(bet => bet.id === animalId);
  function placeBet() {

    if (!disabled && roundIsActive) {

      onConfirm(animalId, tickets);

    }

  }

  function addAnimal() {

    if (!disabled && roundIsActive) {

      onAdd(animalId, tickets);

    }

  }



  if (compact) {

    return <div className="flex flex-col w-full gap-1 bg-slate-700 rounded-lg p-4 mt-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="flex justify-between items-center">
        <span className="flex flex-row gap-2">
          <span className="text-2xl">{animal.emoji}</span>
          <span className="font-semibold text-lg">{animal.name}</span>
        </span>

        <button onClick={onClose} className="text-slate-500 hover:text-white text-lg ml-1">
          ✕
        </button>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 mx-auto">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => {
                if (!disabled && roundIsActive) {

                  setTickets(n)

                }

              }}
              className={`w-7 h-7 rounded text-sm font-medium transition-all
              

                ${tickets !== n
                  ? "bg-slate-600 hover:bg-slate-500"
                  : disabled
                    ? "bg-yellow-500"
                    : roundIsActive ? "bg-red-500" : "bg-slate-600 hover:bg-slate-500"
                }`}
            >
              {n}
            </button>
          ))}
        </div>
        <button
          onClick={placeBet}
          className={`p-2 rounded text-sm font-medium transition-all ml-2 
           ${disabled || !roundIsActive ? "bg-slate-600 hover:bg-slate-500" : "bg-red-500 hover:bg-red-400 "}`}
        >
          Comprar
        </button>
        <button
          onClick={addAnimal}
          className={`p-2 rounded text-sm font-medium transition-all ml-2 
           ${disabled || !roundIsActive ? "bg-slate-600 hover:bg-slate-500" : "bg-yellow-600 hover:bg-yellow-500 "}`}
        >
          Carrito
        </button>
      </div>


    </div>

  } else {

    return <div className="flex flex-row items-center justify-between w-full gap-1 px-4 bg-slate-700 rounded-lg p-4 mt-3 animate-in fade-in slide-in-from-bottom-2 duration-200">


      <span className="text-2xl">{animal.emoji}</span>
      <span className="font-semibold text-lg">{animal.name}</span>


      <div className="flex items-center gap-2 ml-auto">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => {
              if (!disabled && roundIsActive) {

                setTickets(n)

              }

            }}
            className={`w-7 h-7 rounded text-sm font-medium transition-all

              ${tickets === n
                ? disabled
                  ? "bg-yellow-500"
                  : "bg-red-500"
                : "bg-slate-600 hover:bg-slate-500"
              }`}
          >
            {n}
          </button>
        ))}
      </div>
      <button
        onClick={placeBet}
        className={`py-2 px-2 rounded text-sm font-medium transition-all ml-3 
           ${disabled || !roundIsActive ? "bg-slate-600 hover:bg-slate-500" : "bg-red-500 hover:bg-red-400 "}`}
      >
        Comprar
      </button>
      <button
        onClick={addAnimal}
        className={`py-2 px-2 rounded text-sm font-medium transition-all ml-3 
           ${disabled || !roundIsActive ? "bg-slate-600 hover:bg-slate-500" : "bg-yellow-600 hover:bg-yellow-500 "}`}
      >
        Carrito
      </button>
      <button onClick={onClose} className="text-slate-500 hover:text-white text-lg mx-2">
        ✕
      </button>

    </div>

  }
};

export default TicketSelector;
