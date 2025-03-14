import { useEffect, useState } from 'react';
import '../css/navbar.css'
import { NavLink, Link } from 'react-router-dom';

function Navbar() {
    const [isFixed, setIsFixed] = useState(false);
    
    function handleScroll(){
        if(window.scrollY > 50){
            setIsFixed(true);
        }else{
            setIsFixed(false);
        }
    }

    useEffect(() => {
        handleScroll();

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, []);

    return (
        <nav className={`navbar ${isFixed ? "fixed" : ""}`}>
            <div className='part1'>
                <Link className='link'>KINOGO</Link>
                <NavLink className='link' to={'/'}>Главное</NavLink>
                <NavLink className='link' to={'/popular'}>Популярное</NavLink>
                <NavLink className='link' to={'/topFilm'}>Лучшие</NavLink>
                <NavLink className='link' to={'/actors'}>Актеры</NavLink>
            </div>
        </nav>
    )
}

export default Navbar;