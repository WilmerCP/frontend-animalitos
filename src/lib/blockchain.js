import { abi as animalitos_abi } from './animalitos_abi.json';
import { abi as usdt_abi } from './usdt_abi.json';

const abi = [...animalitos_abi, ...usdt_abi];

import { formatAmount, simplifyAmount, formatAmountArray } from './utils';

import { createPublicClient, http, createWalletClient, custom } from 'viem';
import { polygonAmoy, hardhat } from 'viem/chains';
import { parseAccount } from 'viem/accounts';


const MODE = import.meta.env.VITE_MODE || 'local';
const CONTRACT = import.meta.env.VITE_CONTRACT_ADDRESS;
const USDT_CONTRACT = import.meta.env.VITE_USDT_ADDRESS;
const RPC_URL = import.meta.env.VITE_RPC_URL;
const CHAIN_ID = import.meta.env.VITE_CHAIN_ID;

const CHAIN = MODE == 'local' ? hardhat : polygonAmoy;

//Public client can always be created
const publicClient = createPublicClient({
  transport: http(RPC_URL),
  chain: CHAIN
});


const isMetaMaskAvailable = () => !!window.ethereum;

//Wallet state — populated only after connecting
let walletClient = null;
let account = null;

async function connectMetaMask() {

  if (!window.ethereum) return null;

  //Switch MetaMask to correct chain first
  await window.ethereum.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: CHAIN_ID }],
  });

  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

  account = accounts[0];

  walletClient = createWalletClient({
    chain: CHAIN,
    transport: custom(window.ethereum),
    account: parseAccount(account),
  })

  return account;
}

// Helper to guard any function that needs a wallet
function requireWallet() {
  if (!walletClient || !account) {
    throw new Error('Wallet not connected. Please connect MetaMask first.');
  }
}


//For debugging
async function getChainId() {
  const chainId = await publicClient.getChainId();
  console.log('Chain ID:', chainId);
  return chainId;
}

async function getGasFees() {
  // Skip fee estimation for local networks
  if (publicClient.chain.id === hardhat.id) return {}

  const fees = await publicClient.estimateFeesPerGas()
  return {
    maxPriorityFeePerGas: fees.maxPriorityFeePerGas,
    maxFeePerGas: fees.maxFeePerGas,
  }
}

async function approve(amount) {

  requireWallet();

  const fees = await publicClient.estimateFeesPerGas()

  const txHash = await walletClient.writeContract({
    address: USDT_CONTRACT,
    abi: usdt_abi,
    functionName: 'approve',
    args: [CONTRACT, formatAmount(amount)],
    chain: CHAIN,
    ...await getGasFees()
  })

  console.log('Transaction sent:', txHash)

  // optional: wait for it to be mined
  const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash })

  if (receipt.status === 'success') {
    console.log('Approve transaction confirmed and successful!', receipt);

    return true;

  } else {
    console.error('Approve transaction failed!', receipt);
    return false;
  }



}

async function fetchTokenBalance() {
  const balance = await publicClient.readContract({
    address: USDT_CONTRACT,
    abi: usdt_abi,
    functionName: 'balanceOf',
    args: [account]
  });
  return simplifyAmount(balance);
}

async function fetchAllowance() {
  const balance = await publicClient.readContract({
    address: USDT_CONTRACT,
    abi: usdt_abi,
    functionName: 'allowance',
    args: [account, CONTRACT]
  });
  return simplifyAmount(balance);
}

async function fetchRoundStatus() {

  const isActive = await publicClient.readContract({
    address: CONTRACT,
    abi: animalitos_abi,
    functionName: 'roundActive',
  });

  return isActive;

}

async function fetchRoundNumber() {

  const round = await publicClient.readContract({
    address: CONTRACT,
    abi: animalitos_abi,
    functionName: 'currentRound'
  });

  return Number(round);

}

async function fetchRoundInfo(round_number) {

  if (round_number == null) {
    return null;
  }

  const roundInfo = await publicClient.readContract({
    address: CONTRACT,
    abi: animalitos_abi,
    functionName: 'rounds',
    args: [round_number]
  });

  const [
    totalPool,
    winningAnimal,
    finished,
    roundStartTime,
    roundEndTime,
    isSpecial,
    claimablePrize,
    remainingPrize
  ] = roundInfo;

  return {
    totalPool: simplifyAmount(totalPool),
    winningAnimal,
    finished,
    roundStartTime: Number(roundStartTime),
    roundEndTime: Number(roundEndTime),
    isSpecial,
    claimablePrize: simplifyAmount(claimablePrize),
    remainingPrize: simplifyAmount(remainingPrize)
  };

}

async function fetchUserBets(round_number) {

  const bets = await publicClient.readContract({
    address: CONTRACT,
    abi: animalitos_abi,
    functionName: 'getUserBets',
    args: [round_number, account]
  });

  return bets.map((big) => (simplifyAmount(big)));

}

async function fetchTotalAnimalBets(round_number, animalId) {

  if (round_number == null || animalId == null) return 0;

  const totalAnimalBets = await publicClient.readContract({
    address: CONTRACT,
    abi: animalitos_abi,
    functionName: 'totalAnimalBets',
    args: [round_number, animalId]
  });

  return simplifyAmount(totalAnimalBets);

}

async function fetchClaimedStatus(round_number) {

  const status = await publicClient.readContract({
    address: CONTRACT,
    abi: animalitos_abi,
    functionName: 'claimed',
    args: [round_number, account]
  });

  return status;

}

async function fetchJackpotAmount() {

  const amount = await publicClient.readContract({
    address: CONTRACT,
    abi: animalitos_abi,
    functionName: 'jackpotPool',
    args: []
  });

  return simplifyAmount(amount);

}

async function placeBet(animalId, amount) {

  requireWallet();

  const txHash = await walletClient.writeContract({
    address: CONTRACT,
    abi: abi,
    functionName: 'placeBet',
    args: [animalId, formatAmount(amount)],
    chain: CHAIN,
    ...await getGasFees()
  })

  console.log('Transaction sent:', txHash)

  // optional: wait for it to be mined
  const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash })

  if (receipt.status === 'success') {
    console.log('Bet placing transaction confirmed and successful!', receipt);

    return true;

  } else {
    console.error('Bet placing transaction failed!', receipt);
    return false;
  }


}

async function claimReward(round_number) {

  requireWallet();

  const txHash = await walletClient.writeContract({
    address: CONTRACT,
    abi: abi,
    functionName: 'claimPrize',
    args: [round_number],
    chain: CHAIN,
    ...await getGasFees()
  })

  console.log('Transaction sent:', txHash)

  // optional: wait for it to be mined
  const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash })

  if (receipt.status === 'success') {
    console.log('Prize claiming transaction confirmed and successful!', receipt);

    return true;

  } else {
    console.error('Prize claim transaction failed!', receipt);
    return false;
  }


}

async function placeMultipleBets(list) {

  requireWallet();

  const txHash = await walletClient.writeContract({
    address: CONTRACT,
    abi: abi,
    functionName: 'placeMultipleBets',
    args: [formatAmountArray(list)],
    chain: CHAIN,
    ...await getGasFees()
  })

  console.log('Transaction sent:', txHash)

  // optional: wait for it to be mined
  const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash })

  if (receipt.status === 'success') {
    console.log('Bet placing transaction confirmed and successful!', receipt);

    return true;

  } else {
    console.error('Bet placing transaction failed!', receipt);
    return false;
  }


}

export {

  isMetaMaskAvailable,
  connectMetaMask,
  getChainId,
  approve,
  placeBet,
  claimReward,
  fetchRoundStatus,
  fetchRoundNumber,
  fetchAllowance,
  fetchUserBets,
  fetchRoundInfo,
  fetchJackpotAmount,
  fetchTotalAnimalBets,
  fetchClaimedStatus,
  fetchTokenBalance,
  placeMultipleBets,
  CONTRACT,
  animalitos_abi as ANIMALITOS_ABI,
  publicClient

}