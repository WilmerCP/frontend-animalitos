import { abi as animalitos_abi } from './animalitos_abi.json';
import { abi as usdt_abi } from './usdt_abi.json';

const abi = [...animalitos_abi, ...usdt_abi];

import { formatAmount, simplifyAmount } from './utils';

import { createPublicClient, http, createWalletClient, custom } from 'viem';
import { hardhat } from 'viem/chains'
import { parseAccount } from 'viem/accounts';

const CONTRACT = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
const USDT_CONTRACT = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const HARDHAT_CHAIN_ID = "0x7A69"; // 31337 in hex

const publicClient = createPublicClient({
    transport: http('http://localhost:8545'), // default Hardhat RPC URL
    chain: hardhat
});

//Switch MetaMask to Hardhat first
await window.ethereum.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: HARDHAT_CHAIN_ID }],
});

const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });

const walletClient = createWalletClient({
    chain: hardhat,
    transport: custom(window.ethereum),
    account: parseAccount(account),
})



async function getChainId() {
    const chainId = await publicClient.getChainId();
    console.log('Chain ID:', chainId);
    return chainId;
}

async function approve(amount) {

    const txHash = await walletClient.writeContract({
        address: USDT_CONTRACT,
        abi: usdt_abi,
        functionName: 'approve',
        args: [CONTRACT, formatAmount(amount)],
        chain: hardhat
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
        args: [account,CONTRACT]
    });
    return simplifyAmount(balance);
}

async function fetchRoundStatus(){

    const isActive = await publicClient.readContract({
        address: CONTRACT,
        abi: animalitos_abi,
        functionName: 'roundActive',
      });

    return isActive;

}

async function fetchRoundNumber(){

    const round = await publicClient.readContract({
          address: CONTRACT,
          abi: animalitos_abi,
          functionName: 'currentRound'
        });

    return round;

}

async function fetchWinner(round_number){

    if(round_number == null){
        return null;
    }

    const winner = await publicClient.readContract({
          address: CONTRACT,
          abi: animalitos_abi,
          functionName: 'getWinningAnimal',
          args: [round_number]
        });

    return winner;

}

async function fetchUserBets(round_number){

    const bets = await publicClient.readContract({
          address: CONTRACT,
          abi: animalitos_abi,
          functionName: 'getUserBets',
          args: [round_number,account]
        });

    return bets.map((big)=>(simplifyAmount(big)));

}

async function placeBet(animalId,amount){

    const txHash = await walletClient.writeContract({
      address: CONTRACT,
      abi: abi,
      functionName: 'placeBet',
      args: [animalId, formatAmount(amount)],
      chain: hardhat,
      gas: 500000n
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

export default {

    getChainId,
    approve,
    placeBet,
    fetchRoundStatus,
    fetchRoundNumber,
    fetchAllowance,
    fetchUserBets,
    fetchWinner,
    CONTRACT,
    ANIMALITOS_ABI : animalitos_abi,
    publicClient

}