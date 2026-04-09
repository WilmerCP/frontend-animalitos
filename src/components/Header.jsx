import { GiHamburgerMenu } from "react-icons/gi";
import { Link } from "react-router-dom";

export default function Header() {

    return <div className='flex flex-row items-center justify-between bg-slate-600 p-5 gap-6 sticky top-0 z-10'>
       <Link to={'/'}><h1 className='font-bold text-2xl text-white'>Crypto Animalitos</h1></Link>
        {/*<h2 className='font-semibold text-md'>{roundStatusText}</h2>*/}
        {/*<div className='bg-slate-600 hover:bg-slate-500 h-full py-3 px-2 flex flex-row items-center gap-1' onClick={() => setHideBalance(!hideBalance)}>
            <span className='text-md'>Balance: <b>{hideBalance ? '••••' : `${tokenBalance} $`}</b></span>
            {hideBalance ? <IoMdEyeOff className='text-lg' /> : <IoMdEye className='text-lg' />}
        </div>*/}
        <GiHamburgerMenu className='text-2xl text-white transition-all duration-200 hover:scale-[1.1] active:scale-[0.98] cursor-pointer' onClick={() => setDrawerOpen((prev) => { setSidebarOpen(!prev); return !prev })} />
    </div>
}