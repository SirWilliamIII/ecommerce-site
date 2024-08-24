import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ItemList({ token }) {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get('/items', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setItems(response.data);
            } catch (error) {
                console.error('Failed to fetch items:', error);
            }
        };
        fetchItems();
    }, [token]);

    const addToCart = async (itemId) => {
        try {
            await axios.post(
                '/cart',
                { itemId, quantity: 1 },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Item added to cart!');
        } catch (error) {
            console.error('Failed to add item to cart:', error);
        }
    };

    return (
        <div>
            <h2>Items</h2>
            <ul>
                {items.map((item) => (
                    <li key={item.id}>
                        {item.name} - ${item.price}
                        <button onClick={() => addToCart(item.id)}>Add to Cart</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ItemList;