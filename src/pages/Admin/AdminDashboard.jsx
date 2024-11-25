import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import './AdminDashboard.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [showOrders, setShowOrders] = useState(false);
    const [showChart, setShowChart] = useState(false);
    const [showInventory, setShowInventory] = useState(false);
    const [newStock, setNewStock] = useState({});
    const [editingProduct, setEditingProduct] = useState(null); // Track editing state

    // Fetch orders and inventory data
    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('https://vynceianoani.helioho.st/cedeno/orders.php', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Check if the response is an array, if not, initialize orders as an empty array
                if (Array.isArray(response.data)) {
                    setOrders(response.data);
                } else {
                    setError('Received unexpected data format for orders');
                    setOrders([]);
                }
            } catch (err) {
                setError('Failed to fetch orders');
            } finally {
                setLoading(false);
            }
        };

        const fetchInventory = async () => {
            try {
                const response = await axios.get('https://vynceianoani.helioho.st/cedeno/inventory.php');
                setInventory(response.data);
            } catch (err) {
                setError('Failed to fetch inventory data');
            }
        };

        fetchOrders();
        fetchInventory();
    }, []);

    // Accept an order by its ID
    const acceptOrder = async (orderId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(
                `https://vynceianoani.helioho.st/cedeno/orders.php?id=${orderId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.id === orderId ? { ...order, status: 'Accepted' } : order
                )
            );
        } catch {
            setError('Failed to update order status');
        }
    };

    // Handle stock input change
    const handleStockChange = (productId, value) => {
        setNewStock((prev) => ({
            ...prev,
            [productId]: value,
        }));
    };

    // Update stock in the database
    const updateStock = async (productId) => {
        const stockValue = newStock[productId];
    
        if (!stockValue) {
            setError('Stock value is required');
            return;
        }
    
        try {
            // URL format depends on your API's design
            await axios.put(
                `https://vynceianoani.helioho.st/cedeno/inventory.php?id=${productId}`, // or `/inventory.php/${productId}`
                { newStock: stockValue }
            );
            
            setInventory((prevInventory) =>
                prevInventory.map((item) =>
                    item.product_id === productId ? { ...item, stocks: stockValue } : item
                )
            );
            setEditingProduct(null); // Exit editing mode after successful update
        } catch {
            setError('Failed to update stock');
        }
    };
    

    // Chart data for total sales
    const totalSalesChartData = {
        labels: orders.map((order) => new Date(order.order_date).toLocaleDateString()),
        datasets: [
            {
                label: 'Total Sales',
                data: orders.map((order) => order.total_price),
                fill: false,
                backgroundColor: 'rgba(75,192,192,1)',
                borderColor: 'rgba(75,192,192,1)',
                tension: 0.1,
            },
        ],
    };

    const totalSalesChartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            tooltip: { enabled: true },
        },
        scales: {
            x: { beginAtZero: true },
            y: { beginAtZero: true },
        },
    };

    return (
        <div className="admin-dashboard">
            {loading && <p>Loading...</p>}
            {error && <p className="error-message">{error}</p>}

            {/* Inventory Section */}
            <button onClick={() => setShowInventory((prev) => !prev)}>
                {showInventory ? 'Hide Inventory' : 'Show Inventory'}
            </button>
            {showInventory && (
                <table className="inventory-table">
                    <thead>
                        <tr>
                            <th>Product ID</th>
                            <th>Cup Name</th>
                            <th>Stocks</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventory.map((item) => (
                            <tr key={item.product_id}>
                                <td>{item.product_id}</td>
                                <td>{item.cup_name}</td>
                                <td>{item.stocks}</td>
                                <td>
                                    {editingProduct === item.product_id ? (
                                        <>
                                            <input
                                                type="number"
                                                value={newStock[item.product_id] || ''}
                                                onChange={(e) => handleStockChange(item.product_id, e.target.value)}
                                            />
                                            <button onClick={() => updateStock(item.product_id)}>Save</button>
                                            <button onClick={() => setEditingProduct(null)}>Cancel</button>
                                        </>
                                    ) : (
                                        <button onClick={() => setEditingProduct(item.product_id)}>
                                            Edit
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Orders Section */}
            <button onClick={() => setShowOrders((prev) => !prev)}>
                {showOrders ? 'Hide Orders Table' : 'Show Orders Table'}
            </button>
            {showOrders && (
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>User ID</th>
                            <th>Total Price</th>
                            <th>Name</th>
                            <th>Address</th>
                            <th>Payment Link</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.user_id}</td>
                                <td>{order.total_price}</td>
                                <td>{order.name || 'N/A'}</td>
                                <td>{order.address || 'N/A'}</td>
                                <td>{order.payment_link || 'N/A'}</td>
                                <td>{order.status}</td>
                                <td>
                                    {order.status !== 'Accepted' && (
                                        <button onClick={() => acceptOrder(order.id)}>Accept Order</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Chart Section */}
            <button onClick={() => setShowChart((prev) => !prev)}>
                {showChart ? 'Hide Charts' : 'Show Charts'}
            </button>
            {showChart && (
                <div className="charts">
                    <h2>Total Sales</h2>
                    <Line data={totalSalesChartData} options={totalSalesChartOptions} />
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
