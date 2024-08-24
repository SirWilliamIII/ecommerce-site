import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';

import Login from './components/Login';
import Register from './components/Register';
import ItemList from './components/ItemList';
import Cart from './components/Cart';
import Checkout from './components/Checkout';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setIsAuthenticated(false);
    };

    return (
        <Router>
            <div>
                <nav>
                    {isAuthenticated ? (
                        <>
                            <button onClick={handleLogout}>Logout</button>
                            <Link to="/items">Items</Link>
                            <Link to="/cart">Cart</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </>
                    )}
                </nav>


                    <Routes>
                        <Route path="/login" element={isAuthenticated ? <Navigate to="/items" /> : <Login onLogin={handleLogin} />} />
                        <Route path="/register" element={isAuthenticated ? <Navigate to="/items" /> : <Register />} />
                        <Route path="/items" element={isAuthenticated ? <ItemList token={token} /> : <Navigate to="/login" />} />
                        <Route path="/cart" element={isAuthenticated ? <Cart token={token} /> : <Navigate to="/login" />} />
                        <Route path="/checkout" element={isAuthenticated ? <Checkout token={token} /> : <Navigate to="/login" />} />
                        <Route path="/" element={<Navigate to="/items" />} />
                    </Routes>
            </div>
        </Router>
    );
}

export default App;
