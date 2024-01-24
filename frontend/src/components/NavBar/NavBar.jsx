import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
    const [menuVisible, setMenuVisible] = useState(false);

    const cerrarMenu = () => {
        setMenuVisible(false);
    };

    const abrirMenu = () => {
        setMenuVisible(true);
    };

    return (
        <header>
            <Link className='logo' to="/">
                <img className='logoNav' src="../img/logo2.png" alt="" />
                <h1>SIM</h1>
            </Link>

            <nav className={`nav ${menuVisible ? 'visible' : ''}`}>
                <button className='cerrarMenu' onClick={cerrarMenu}><img className='icono' src="../img/close.png" alt="close" /></button>
                <ul className='navl'>
                    <li>
                        <NavLink className="estiloCat" to="/products/camisetas">Camisetas</NavLink>
                    </li>
                    <li>
                        <NavLink className="estiloCat" to="/products/pantalones">Pantalones</NavLink>
                    </li>
                    <li>
                        <NavLink className="estiloCat" to="/products/camperas">Camperas</NavLink>
                    </li>
                    <NavLink to="/login"><img className='icono' src="../img/account.svg" alt="burger" /></NavLink>
                </ul>
            </nav>

            <button className='abrirMenu' onClick={abrirMenu}><img className='icono' src="../img/account.svg" alt="cuenta" /></button>
        </header>
    );
};

export default NavBar;
