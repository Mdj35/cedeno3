import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './payment.module.css'; // Import the CSS module

function Payment() {
    const location = useLocation();
    const navigate = useNavigate();
    const { totalPrice } = location.state || { totalPrice: 0 };
    const [error, setError] = useState(''); // State to manage error messages

    const handleGCashPayment = async () => {
        try {
            const amountInCentavos = Math.round(totalPrice * 100); // Convert to centavos
            const response = await axios.post('http://localhost:5000/api/payment-link', {
                data: {
                    attributes: {
                        amount: amountInCentavos,
                        description: "Payment for Order",
                        remarks: "none"
                    }
                }
            });

            if (response.data && response.data.data && response.data.data.attributes) {
                // Redirect to the payment link
                window.open(response.data.data.attributes.checkout_url, '_blank');
                setTimeout(() => {
                    navigate('/order'); // Redirect to the homepage after initiating payment
                }, 3000); // Adjust delay if necessary
            }
        } catch (error) {
            if (error.response) {
                setError(`Payment error: ${error.response.data.message || 'An error occurred'}`);
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        }
    };

    return (
        <div className={`${styles.gradientBackground} flex items-center justify-center h-screen`}>
            <div className={`${styles.container} p-8 rounded-lg`}>
                <div className={`${styles.card} flex flex-col items-center justify-center w-full md:w-[50%] p-6 rounded-lg shadow-lg bg-white`}>
                    <h1 className="text-2xl font-bold text-center mb-4">Payment Method</h1>
                    <p className="text-gray-600 mb-6 text-center">
                        Complete your payment of <span className="font-semibold">PHP {totalPrice}</span>.
                    </p>

                    {error && <p className="text-red-500 mb-4">{error}</p>} {/* Display error if exists */}

                    <div className="flex justify-center items-center w-full">
                        {/* Paymongo Option */}
                        <div
                            onClick={handleGCashPayment}
                            className={`${styles.paymentOption} cursor-pointer flex flex-col items-center transition-transform transform hover:scale-105`}
                        >
                            <img
                                src="paymongo.png" // Ensure this image path is correct
                                alt="Paymongo Logo"
                                className="w-32 h-auto mb-2"
                            />
                            <p className="text-blue-500 font-semibold">Pay with Paymongo</p>
                        </div>
                    </div>

                    <p className="text-sm text-gray-500 mt-4">
                        By choosing a payment option, you agree to our terms and conditions.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Payment;
