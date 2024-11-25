import React, { useEffect, useState } from 'react';
import classes from './cupPage.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { getById } from '../../Services/cupServices';
import StarRating from '../../components/StarRating/StarRating';
import Tags from '../../components/Tags/Tags';
import Price from '../../components/Price/Price';
import { useCart } from '../../hooks/useCart';
import axios from 'axios';

export default function CupPage() {
    const [cup, setCup] = useState(null);
    const [stock, setStock] = useState(null);
    const [printOption, setPrintOption] = useState('without');
    const { id } = useParams();
    const { addToCart } = useCart();
    const navigate = useNavigate();

    const handleAddToCart = () => {
        if (cup && stock >= 200) { // Ensure stock is 200 or more
            let finalPrice = cup.price;
            if (printOption === 'with') {
                finalPrice += 5;
            }
            let adjustedCup = { ...cup, price: finalPrice };
            addToCart(adjustedCup);
            navigate('/cart');
        }
    };

    useEffect(() => {
        const fetchCupData = async () => {
            try {
                const cupData = await getById(id);  // Assuming this works correctly
                setCup(cupData);
        
                const stockData = await axios.get(`https://vynceianoani.helioho.st/cedeno/cups.php?id=${id}`);
                
                // Directly set stock from the response
                const cupStock = stockData.data.stock;  // stock is already returned in the response
                setStock(cupStock !== undefined ? cupStock : 0);
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };

        fetchCupData();
    }, [id]);

    if (!cup) {
        return <div>Loading...</div>;
    }

    return (
        <div className={classes.container}>
            <div className={classes.details}>
                <div className={classes.header}>
                    <span className={classes.name}>{cup.name}</span>            
                </div>

                <div className={classes.imageContainer}>
                    <img
                        className={classes.image}
                        src={`/cups/${cup.imageUrl}`}
                        alt={cup.name}
                    />
                </div>

                <div className={classes.rating}>
                    <StarRating stars={cup.stars} size={25} />
                </div>

                <div className={classes.tags}>
                    {cup.tags && (
                        <Tags tags={cup.tags.map(tag => ({ name: tag }))} forCupPage={true} />
                    )}
                </div>

                <div className={classes.price}>
                    <Price price={printOption === 'with' ? cup.price + 5 : cup.price} />
                </div>

                <div className={classes.description}>
                    <p>{cup.description}</p>
                </div>

                <div className={classes.printOptionContainer}>
                    <label 
                        className={`${classes.printOption} ${printOption === 'without' ? classes.selected : ''}`} 
                        onClick={() => setPrintOption('without')}
                    >
                        <input 
                            type="radio" 
                            value="without" 
                            checked={printOption === 'without'} 
                            onChange={() => setPrintOption('without')} 
                        />
                        Without Print
                    </label>
                    <label 
                        className={`${classes.printOption} ${printOption === 'with' ? classes.selected : ''}`} 
                        onClick={() => setPrintOption('with')}
                    >
                        <input 
                            type="radio" 
                            value="with" 
                            checked={printOption === 'with'} 
                            onChange={() => setPrintOption('with')} 
                        />
                        With Print (+₱5.00)
                    </label>
                </div>

                <div className={classes.stock}>
                    <span>Available Stock: {stock !== null ? stock : 'Loading...'}</span>
                </div>

                <button 
                    onClick={handleAddToCart} 
                    disabled={stock < 200} // Disable button if stock is less than 200
                    className={stock < 200 ? classes.outOfStockButton : ''}
                >
                    {stock < 200 ? 'Unavailable (Stock < 200)' : 'Add To Cart'}
                </button>
            </div>
        </div>
    );
}
