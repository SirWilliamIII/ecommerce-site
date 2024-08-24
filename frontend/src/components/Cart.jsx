import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Cart({ token }) {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await axios.get('/cart', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCartItems(response.data);
            } catch (error) {
                console.error('Failed to fetch cart items:', error);
            }
        };
        fetchCartItems();
    }, [token]);

    const totalAmount = cartItems.reduce((total, item) => {
        return total + item.item.price * item.quantity;
    }, 0);

    return (
        <div>
            <h2>Cart</h2>
            <ul>
                {cartItems.map((cartItem) => (
                    <li key={cartItem.id}>
                        {cartItem.item.name} - Quantity: {cartItem.quantity} - $
                        {cartItem.item.price * cartItem.quantity}
                    </li>
                ))}
            </ul>
            <p>Total: ${totalAmount.toFixed(2)}</p>
            <Link to="/checkout">
                <button>Proceed to Checkout</button>
            </Link>
        </div>
    );
}

export default Cart;