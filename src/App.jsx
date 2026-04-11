import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { GameContextProvider } from './store/game-context.jsx';

import Home from './pages/Home.jsx'
import Faq from './pages/Faq.jsx'

const router = createBrowserRouter([
    { path: '/', element: <GameContextProvider><Home/></GameContextProvider> },
    { path:'/faq', element: <GameContextProvider><Faq/></GameContextProvider>}
]);

export default function App() {

    return <RouterProvider router={router}/>

}