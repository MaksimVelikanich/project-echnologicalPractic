import React from 'react';
import '../css/Header.css'; 
import { useNavigate } from 'react-router-dom';


function Header() {
    const navigate = useNavigate();
    return (
        <header className="header">
            <div className="header-logo">
                <h1>Currency Exchange</h1> {}
            </div>
            <nav className="header-nav">
                <ul className='navig'>
                    <li><a href="/" className='nav'>Convert</a></li>
                    <li><a href="/exchange-history" className='nav'>Exchange History</a></li>
                    <li><a href="/register" className="button button-register" onClick={() => navigate('/register')}>Register</a></li>
                    <li><a href="/login" className="button button-login" onClick={() => navigate('/login')}>Login</a></li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;
