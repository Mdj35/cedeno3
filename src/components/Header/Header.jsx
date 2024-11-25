// Header.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import classes from './header.module.css';
import { useCart } from '../../hooks/useCart';
import cartLogo from '../../assets/cart.png';

export default function Header({ user, setUser, isAdmin, setIsAdmin }) {
    const { cart, clearCart } = useCart();
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();

    const logout = () => {
        const confirmLogout = window.confirm("Are you sure you want to logout?");
        if (confirmLogout) {
            // Clear localStorage and state
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('isAdmin');
            setUser(null);
            setIsAdmin(false);

            // Clear cart on logout
            clearCart();

            // Redirect to the login page after logout
            navigate('/login');
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`${classes.header} ${isScrolled ? classes.scrolled : ''}`}>
            <div className={classes.container}>
                <Link to="/" className={classes.logo}>PZAM Cups Printing Davao!</Link>
                <nav>
                    <ul>
                        {user ? (
                            <li className={classes.menu_container}>
                                <span>{user} {isAdmin && '(Admin)'}</span>
                                <div className={classes.menu}>
                                    {isAdmin ? (
                                        <Link to="/admin-dashboard">Dashboard</Link>
                                    ) : (
                                        <>
                                            <Link to="/profile">Profile</Link>
                                            <Link to="/order">Orders</Link> {/* Added Orders link */}
                                        </>
                                    )}
                                    <a onClick={logout}>Logout</a>
                                </div>
                            </li>
                        ) : (
                            <Link to="/login">Login</Link>
                        )}
                        <li>
                            <Link to="/cart" className={classes.cartLink}>
                                <img src={cartLogo} alt="Cart" className={classes.cartIcon} />
                                {cart.totalCount > 0 && (
                                    <span className={classes.cartCount}>{cart.totalCount}</span>
                                )}
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}
