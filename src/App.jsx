import './App.css'
import { createHashRouter , RouterProvider } from "react-router-dom";
import { GameContextProvider } from './store/game-context.jsx';

import Home from './pages/Home.jsx'
import Faq from './pages/Faq.jsx'

//createBrowserRouter
const router = createHashRouter ([
    { path: '/', element: <GameContextProvider><Home/></GameContextProvider> },
    { path:'/faq', element: <GameContextProvider><Faq/></GameContextProvider>}
]);

export default function App() {

    return <RouterProvider router={router}/>

}