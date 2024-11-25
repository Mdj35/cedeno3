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

            // PayMongo payment link creation API call
            const response = await axios.post('https://api.paymongo.com/v1/links', {
                data: {
                    attributes: {
                        amount: amountInCentavos,
                        description: "Payment for Order",
                        remarks: "none"
                    }
                }
            }, {
                headers: {
                    'accept': 'application/json',
                    'authorization': `Basic ${btoa('sk_test_qktYNDx5UjE2gznY1es6vnba')}`, // Encoding secret key
                    'content-type': 'application/json'
                }
            });

            // Handling the response
            console.log('Payment link created:', response.data);
            if (response.data && response.data.data && response.data.data.attributes) {
                // Open the payment link in a new tab
                window.open(response.data.data.attributes.checkout_url, '_blank');

                // Optionally navigate to homepage after payment initiation
                setTimeout(() => {
                    navigate('/');
                }, 3000); // Adjust delay if necessary
            }
        } catch (error) {
            // Handle errors gracefully
            if (error.response) {
                console.error('Payment error:', error.response.data);
                setError(`Payment error: ${error.response.data.message || 'An error occurred'}`);
            } else {
                console.error('Payment error:', error);
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
