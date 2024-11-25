import React, { useEffect, useState } from 'react';
import classes from './cartPage.module.css';
import { useCart } from '../../hooks/useCart';
import Title from '../../components/Title/Title';
import { Link, useNavigate } from 'react-router-dom';
import Price from '../../components/Price/Price';

export default function CartPage() {
    const { cart, removeFromCart, changeQuantity } = useCart();
    const navigate = useNavigate();
    const [stockData, setStockData] = useState({});
    const isLoggedIn = localStorage.getItem('token');

    // Fetch stock data from the inventory table
    useEffect(() => {
        const fetchStocks = async () => {
            try {
                const response = await fetch('https://vynceianoani.helioho.st/cedeno/stocks.php'); // Endpoint to fetch stock data
                const data = await response.json();
                const stockMap = data.reduce((acc, item) => {
                    acc[item.product_id] = item.stocks;
                    return acc;
                }, {});
                setStockData(stockMap);
            } catch (error) {
                console.error('Error fetching stock data:', error);
            }
        };

        fetchStocks();
    }, []);

    const handleProceedToCheckout = () => {
        if (!isLoggedIn) {
            alert('You need to be logged in to proceed to checkout.');
            navigate('/login');
        } else {
            navigate('/checkout');
        }
    };

    return (
        <>
            <Title title="Cart Page" margin="1.5rem 0 0 2.5rem" />

            {cart && cart.items.length > 0 && (
                <div className={classes.container}>
                    <ul className={classes.list}>
                        {cart.items.map(item => {
                            const availableStock = stockData[item.cup.id] || 0; // Get available stock for the item

                            return (
                                <li key={item.cup.id}>
                                    <div>
                                        <img
                                            src={`/cups/${item.cup.imageUrl}`}
                                            alt={item.cup.name}
                                        />
                                    </div>
                                    <div>
                                        <Link to={`/cup/${item.cup.id}`}>{item.cup.name}</Link>
                                    </div>
                                    <div>
                                        <p>
                                            <strong>Available Stock:</strong> {availableStock}
                                        </p>
                                    </div>
                                    <div>
                                        <select
                                            value={item.quantity}
                                            onChange={e => changeQuantity(item, Number(e.target.value))}
                                        >
                                            {[200, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 5000].map(option => (
                                                <option
                                                    key={option}
                                                    value={option}
                                                    disabled={option > availableStock} // Disable options greater than available stock
                                                >
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <Price price={item.price} />
                                    </div>
                                    <div>
                                        <button className={classes.remove_button} onClick={() => removeFromCart(item.cup.id)}>
                                            Remove
                                        </button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>

                    <div className={classes.checkout}>
                        <div>
                            <div className={classes.cups_count}>{cart.totalCount}</div>
                            <div className={classes.total_price}>
                                <Price price={cart.totalPrice} />
                            </div>
                        </div>
                        <button onClick={handleProceedToCheckout}>
                            Proceed To Checkout
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
