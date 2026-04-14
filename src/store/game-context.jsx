import { createContext, useContext, useState, useEffect } from "react";
import * as blockchain from '../lib/blockchain.js';
import { useLoaderData } from 'react-router-dom';

const GameContext = createContext(null);

export function GameContextProvider({ children }) {

  let { initialAccount, initialRoundNumber, initialRoundInfo, initialRoundIsActive } = useLoaderData();

  let [drawerOpen, setDrawerOpen] = useState(false);

  let [tokenBalance, setTokenBalance] = useState(0);
  let [hideBalance, setHideBalance] = useState(true);

  let [roundIsActive, setRoundIsActive] = useState(initialRoundIsActive !== null ? initialRoundIsActive : false);
  let [currentRound, setCurrentRound] = useState(initialRoundNumber);
  let [roundInfo, setRoundInfo] = useState(initialRoundInfo ? initialRoundInfo : {
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
  let [walletState, setWalletState] = useState(initialAccount ? 'connected' : 'no-metamask');

  useEffect(() => {
    const connect = async () => {
      const account = await blockchain.connectMetaMask();
      if (account !== null) {
        setWalletState('connected');
      } else {
        setWalletState('no-metamask');
      }
    };
    connect();
  }, []);

  async function updateRoundInfo(round) {
    //Returns an array, not an object
    let info = await blockchain.fetchRoundInfo(round);
    console.log("ROUND INFO")
    console.log(info)

    setRoundInfo(info);

    if (info.isSpecial) {

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

  useEffect(() => {
  if (!window.ethereum) return;

  const handleAccountChange = async (accounts) => {

    if (accounts[0]) {
      setWalletState('changing');
      await blockchain.connectMetaMask(); // re-runs with new account
      setWalletState('connected');
    } else {
      setWalletState('no-metamask');
    }
  };

  window.ethereum.on('accountsChanged', handleAccountChange);
  return () => window.ethereum.removeListener('accountsChanged', handleAccountChange);
}, []);

  const value = {
    currentRound, setCurrentRound, roundIsActive, setRoundIsActive, tokenBalance, jackpotAmount,
    setTokenBalance, hideBalance, setHideBalance, roundInfo, setRoundInfo, drawerOpen, setDrawerOpen,
    walletState, setWalletState
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