import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './OrderStatus.css';
import { useLocation } from 'react-router-dom';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const location = useLocation();
    const username = location.state?.username || localStorage.getItem('user'); // Fallback to localStorage if username is not in state

    // Fetch orders when the component mounts
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('https://vynceianoani.helioho.st/cedeno/users-orders.php', {
                    params: { username } // Pass the username as a query parameter
                });
                setOrders(response.data); // Store orders in state
            } catch (err) {
                console.error('Error fetching orders:', err);
                setError('Unable to fetch orders. Please try again later.');
            }
        };

        fetchOrders();
    }, [username]); // Dependency array includes username to refetch if it changes

    return (
        <div className='order'>
            <div className='head'>
                <div className='order-id-label'>
                    <h5>User ID</h5>
                </div>
                <div className='id-label'>
                    <h5>Cup Name</h5>
                </div>
                <div className='price-label'>
                    <h5>Quantity</h5>
                </div>
                <div className='qty-label'>
                    <h5>Price</h5>
                </div>
                <div className='status-label'>  
                    <h5>Product ID</h5>
                </div>
                <div className='status-label'>  
                    <h5>Status</h5>
                </div>
                <div className='status-label'>  
                    <h5>Image</h5>
                </div>
            </div>
            <div className='list'>
                {orders.length > 0 ? (
                    orders.map((order) => (
                        <div className='order-item' key={order.id}>                
                            <div className='order-id'>
                                <p>{order.user_id}</p>
                            </div>
                            <div className='id'>
                                <p>{order.product_name}</p>
                            </div>
                            <div className='price'>
                                <p>{order.quantity}</p>
                            </div>
                            <div className='qty'>
                                <p>{order.total_price}</p>
                            </div>
                            <div className='status'>  
                                <p>{order.product_id}</p>
                            </div>
                            <div className='status'>  
                                {/* Conditionally applying the status classes */}
                                <span className={order.status === 'Delivered' ? 'status-delivered' : 'status-pending'}>
                                    {order.status}
                                </span>
                            </div>
                            <div className='status'>  
                                <img className='imagesz' src={order.image} alt="Order image"></img>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No orders found.</p>
                )}
            </div>
        </div>
    );
};

export default Orders;
