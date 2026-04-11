import { createContext, useContext, useState, useEffect } from "react";
import * as blockchain from '../lib/blockchain.js';
import { simplifyAmount, sumAllElements } from '../lib/utils.js';

const GameContext = createContext(null);

export function GameContextProvider({ children }) {

  let [drawerOpen, setDrawerOpen] = useState(false);

  let [tokenBalance, setTokenBalance] = useState(0);
  let [hideBalance, setHideBalance] = useState(true);

  let [roundIsActive, setRoundIsActive] = useState(false);
  let [currentRound, setCurrentRound] = useState(null);
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
  let [jackpotAmount, setJackpotAmount] = useState(0);

  async function updateRoundInfo(round) {
    //Returns an array, not an object
    let info = await blockchain.fetchRoundInfo(round);
    console.log("ROUND INFO")
    console.log(info)

    setRoundInfo(info);

    if(info.isSpecial){

      let jackpot = await blockchain.fetchJackpotAmount();

      setJackpotAmount(jackpot);

    }

  }

  useEffect(() => {
    let unwatch;

    async function fetchData() {
      const isActive = await blockchain.fetchRoundStatus();
      setRoundIsActive(isActive);

      const round = await blockchain.fetchRoundNumber();
      setCurrentRound(round);

      updateRoundInfo(round);

      if (isActive) {
        unwatch = blockchain.publicClient.watchContractEvent({
          address: blockchain.CONTRACT,
          abi: blockchain.ANIMALITOS_ABI,
          eventName: 'RoundEnded',
          onLogs: (logs) => {
            console.log("Round ended event received:", logs);
            logs.forEach((log) => {
              const { roundNumber, winningAnimal } = log.args;
              setRoundIsActive(false);
              updateRoundInfo(round);

            });
          },
        });
      } else {
        updateRoundInfo(round);

        unwatch = blockchain.publicClient.watchContractEvent({
          address: blockchain.CONTRACT,
          abi: blockchain.ANIMALITOS_ABI,
          eventName: 'RoundStarted',
          onLogs: (logs) => {
            console.log("Round started event received:", logs);
            logs.forEach((log) => {
              const { roundNumber } = log.args;
              setCurrentRound(Number(roundNumber));
              setRoundInfo({
                totalPool: null,
                winningAnimal: null,
                finished: null,
                roundStartTime: null,
                roundEndTime: null,
                isSpecial: false,
                claimablePrize: 0,
                remainingPrize: 0
              });
              setRoundIsActive(true);
              setJackpotAmount(0);
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

  const value = {
    currentRound, setCurrentRound, roundIsActive, setRoundIsActive, tokenBalance, jackpotAmount,
    setTokenBalance, hideBalance, setHideBalance, roundInfo, setRoundInfo, drawerOpen, setDrawerOpen
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext() {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error("useGameContext must be used inside an GameContextProvider");
  }

  return context;
}