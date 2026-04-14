import './App.css'
import { createHashRouter , RouterProvider, Outlet } from "react-router-dom";
import { GameContextProvider } from './store/game-context.jsx';
import { connectMetaMask, fetchRoundNumber, fetchRoundInfo, fetchRoundStatus} from './lib/blockchain.js';

import Home from './pages/Home.jsx'
import Faq from './pages/Faq.jsx'
import GameHeader from './components/GameHeader.jsx';

async function gameLoader() {
  const initialAccount = await connectMetaMask();
  const initialRoundNumber = await fetchRoundNumber();
  const initialRoundInfo = await fetchRoundInfo(initialRoundNumber);
  const initialRoundIsActive = await fetchRoundStatus();
  return { initialAccount, initialRoundNumber, initialRoundInfo, initialRoundIsActive };
}

//createBrowserRouter
const router = createHashRouter([
    { path: '/', element: <GameContextProvider><Home/></GameContextProvider>, loader: gameLoader },
    {
        element: (
            <GameContextProvider>
                <GameHeader />
                <Outlet />
            </GameContextProvider>
        ),
        loader: gameLoader,
        children: [
            { path: '/faq', element: <Faq /> },
        ]
    }
]);

export default function App() {

    return <RouterProvider router={router}/>

}