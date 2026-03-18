import { useState } from 'react'
import Wheel from './components/Wheel.jsx'
import BettingGrid from './components/BettingGrid.jsx'
import TicketSelector from './components/TicketSelector.jsx'
import BetLedger from './components/BetLedger.jsx'
import './App.css'
import { ANIMALS } from './lib/animals.js'

function App() {

  let [winnerId, setWinnerId] = useState(null);
  let [placedBets, setPlacedBets] = useState([]);
  let [selectedAnimalId, setSelectedAnimalId] = useState(null);
  let [sidebarOpen, setSidebarOpen] = useState(true);


  return (
    <div className=' flex flex-col md:flex-row overflow-x-hidden w-full h-screen bg-slate-950 text-white'>
      <div className="flex flex-col items-center justify-center w-full md:w-1/2 h-full py-10 px-1 box-border">
        <Wheel isSpinning={true} winnerId={winnerId} highlightedId={null} />
      </div>


      <div className={`flex flex-col gap-2  box-border flex-1 px-5 pb-10 ${sidebarOpen ? "md:pr-12 md:py-8" : "md:px-10 md:py-10"} `}>
        <BettingGrid
          onSelectAnimal={(id) => { setSelectedAnimalId(id) }}
          selectedAnimal={null}
          onHoverAnimal={() => { }}
          disabled={false}
          columnNumber={sidebarOpen ? '4' : '6'}
        />
        {selectedAnimalId != null &&
          <TicketSelector
            maxTickets={5}
            bets={placedBets}
            setBet={setPlacedBets}
            onClose={()=> { setSelectedAnimalId(null) }}
            onConfirm={()=>{ setSidebarOpen(true) }}
            animalId={selectedAnimalId}
            compact={sidebarOpen}        
            />}
      </div>
      <BetLedger bets={placedBets} isOpen={sidebarOpen} onToggle={()=>{setSidebarOpen((state)=>!state)}} />
    </div>
  )
}

export default App
