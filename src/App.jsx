import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from './pages/Home.jsx'
import Faq from './pages/Faq.jsx'

const router = createBrowserRouter([
    { path: '/', element: <Home/> },
    { path:'/faq', element: <Faq/>}
]);

export default function App() {

    return <RouterProvider router={router}/>

}