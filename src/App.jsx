import { useState, useEffect } from 'react'
import Wheel from './components/Wheel.jsx'
import BettingGrid from './components/BettingGrid.jsx'
import TicketSelector from './components/TicketSelector.jsx'
import BetLedger from './components/BetLedger.jsx'
import AllowancePopup from './components/AllowancePopup.jsx'
import RecentWinners from './components/RecentWinners.jsx'
import RecentPrizes from './components/RecentPrizes.jsx'
import RoundDataSection from './components/RoundDataSection.jsx'
import './App.css'
import ANIMALS  from './lib/animals.js'
import * as blockchain from './lib/blockchain.js'
import { simplifyAmount } from './lib/utils.js'

function App() {

  let [placedBets, setPlacedBets] = useState([]);
  let [selectedAnimalId, setSelectedAnimalId] = useState(null);
  let [sidebarOpen, setSidebarOpen] = useState(true);
  let [roundIsActive, setRoundIsActive] = useState(false);
  let [currentRound, setCurrentRound] = useState(null);
  let [showAllowancePopup, setShowAllowancePopup] = useState(false);
  //let [tokenAllowance, setAllowance] = useState(0);
  let [pendingTransaction, setPendingTransaction] = useState(null);
  let [roundInfo, setRoundInfo] = useState({
    totalPool: null,
    winningAnimal: null,
    finished: null,
    roundStartTime: null,
    roundEndTime: null,
    isSpecial: false,
    claimablePrize: 0,
    remainingPrize: 0
  });
  let [claimed, setClaimed ] = useState(false);

  const didWin = placedBets.some((bet)=>bet.id === roundInfo.winningAnimal);


  async function updateRoundInfo(round,bets) {
    //Returns an array, not an object
    let info = await blockchain.fetchRoundInfo(round);
    console.log("ROUND INFO")
    console.log(info)
    
    setRoundInfo(info);

    if(bets.some((bet)=>bet.id === info.winningAnimal)){

      let status = await blockchain.fetchClaimedStatus(round);

      console.log("claimed: "+status)

      setClaimed(status);

    }

  }

  useEffect(() => {
    let unwatch;

    async function fetchData() {
      const isActive = await blockchain.fetchRoundStatus();
      setRoundIsActive(isActive);

      const round = await blockchain.fetchRoundNumber();
      setCurrentRound(round);

      const amounts = await blockchain.fetchUserBets(round);
      const bets = amounts
        .map((amount, id) => ({ id, amount }))
        .filter((bet) => bet.amount > 0);
      setPlacedBets(bets);

      if (isActive) {
        unwatch = blockchain.publicClient.watchContractEvent({
          address: blockchain.CONTRACT,
          abi: blockchain.ANIMALITOS_ABI,
          eventName: 'roundEnded',
          onLogs: (logs) => {
            console.log("Round ended event received:", logs);
            logs.forEach((log) => {
              const { roundNumber, winningAnimal } = log.args;
              setRoundIsActive(false);
              updateRoundInfo(round,bets);

            });
          },
        });
      } else {
        updateRoundInfo(round,bets);

        unwatch = blockchain.publicClient.watchContractEvent({
          address: blockchain.CONTRACT,
          abi: blockchain.ANIMALITOS_ABI,
          eventName: 'roundStarted',
          onLogs: (logs) => {
            console.log("Round started event received:", logs);
            logs.forEach((log) => {
              const { roundNumber } = log.args;
              setCurrentRound(Number(roundNumber));
              setWinnerId(null);
              setRoundIsActive(true);
            });
          },
        });
      }
    }

    fetchData();

    return () => {
      if (unwatch) unwatch();
    };
  }, [roundIsActive]);



  async function placeBet(animalId, amount) {

    setSidebarOpen(true)

    let allowance = await blockchain.fetchAllowance();

    //setAllowance(allowance);

    if (allowance >= amount) {

      let result = await blockchain.placeBet(animalId, amount);

      if (result == true) {

        setPlacedBets(prev => [
          ...prev,
          { id: animalId, amount: amount }
        ]);

        setSelectedAnimalId(null);
        setPendingTransaction(null);

      }

    } else {

      setShowAllowancePopup(true);
      setPendingTransaction({ animalId, amount });

      console.log("allowance not enough");
      console.log("allowance: " + allowance);
      console.log("amount: " + amount);


    }

  }

  async function allowSpending() {

    let response = await blockchain.approve(1000);

    if (response == true) {

      setShowAllowancePopup(false);
      if (pendingTransaction != null) {

        placeBet(pendingTransaction.animalId, pendingTransaction.amount);

      }

    }

  }

  async function allowTransaction() {

    if (pendingTransaction != null) {

      let response = await blockchain.approve(pendingTransaction.amount);

      if (response == true) {
        setShowAllowancePopup(false);
        placeBet(pendingTransaction.animalId, pendingTransaction.amount);

      }

    }

  }

  let roundStatusText = roundIsActive ? `🟢 Ronda #${currentRound} — ACTIVA` : `🔴 Ronda #${currentRound} — FINALIZADA`;


  return (
    <>
      {showAllowancePopup &&
        <AllowancePopup onClose={() => setShowAllowancePopup(false)}
          onConfirm={allowSpending}
          onConfirmSingle={allowTransaction}
          animal={ANIMALS.find(a => a.id === selectedAnimalId)?.name} />}

      <div className='flex flex-col md:flex-row w-full md:h-screen overflow-x-hidden bg-slate-950 text-white'>
        
        {/* Main scrollable content */}
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

          {/* Top section - wheel + betting grid, locked to viewport height */}
          <div className="grid md:grid-cols-2">

            {/* Wheel */}
            <div className="flex flex-col items-center justify-center h-screen py-10 px-1 overflow-hidden sticky top-0">
              <h2 className='mb-6 font-bold text-xl'>{roundStatusText}</h2>
              <Wheel isSpinning={roundIsActive} winnerId={roundInfo.winningAnimal} highlightedId={null} />
            </div>

            {/* Betting grid */}
            <div className={`flex flex-col gap-2 box-border flex-1 px-5 pb-10 ${sidebarOpen ? "md:pr-12 md:py-8" : "md:px-10 md:py-10"}`}>
              <BettingGrid
                onSelectAnimal={(id) => { setSelectedAnimalId(id) }}
                selectedAnimal={null}
                disabled={false}
                columnNumber={sidebarOpen ? '4' : '6'}
                onHoverAnimal={() => { }}
              />
              {selectedAnimalId != null &&
                <TicketSelector
                  maxTickets={5}
                  bets={placedBets}
                  onClose={() => { setSelectedAnimalId(null) }}
                  onConfirm={placeBet}
                  animalId={selectedAnimalId}
                  compact={sidebarOpen}
                />}
            </div>

          </div>

          {/* Below the fold - full width */}
          <div className="w-full bg-slate-950 text-white px-8 py-8">
            <RoundDataSection currentRound={currentRound} roundIsActive={roundIsActive}/>
          </div>

        </div>

        {/* Sticky sidebar */}
        <BetLedger bets={placedBets} roundInfo={roundInfo} isOpen={sidebarOpen} roundNumber={currentRound} didWin={didWin} claimed={claimed} setClaimed={setClaimed} onToggle={() => { setSidebarOpen((state) => !state) }} />

      </div>
    </>
  )
}

export default App
