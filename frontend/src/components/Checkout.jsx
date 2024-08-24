import React, { useState } from 'react';
import axios from 'axios';

function Checkout({ token }) {
    const [ccNumber, setCcNumber] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                '/checkout',
                { ccNumber },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert(`Order placed successfully! Order ID: ${response.data.orderId}`);
        } catch (error) {
            console.error('Checkout failed:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={ccNumber}
                onChange={(e) => setCcNumber(e.target.value)}
                placeholder="Credit Card Number"
                required
            />
            <button type="submit">Place Order</button>
        </form>
    );
}

export default Checkout;