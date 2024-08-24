// server.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');

const prisma = new PrismaClient();
const app = express();

app.use(express.static(path.join(__dirname, '../frontend/build')));


app.use(express.json());

// User registration
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
            },
        });
        res.json({ message: 'User created successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Username already exists' });
    }
});

// User login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
        return res.status(400).json({ error: 'Invalid username or password' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.status(400).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ userId: user.id }, 'your-secret-key', { expiresIn: '1h' });
    res.json({ token });
});

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, 'your-secret-key', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Get all items
app.get('/items', authenticateToken, async (req, res) => {
    const items = await prisma.item.findMany();
    res.json(items);
});

// Add item to cart
app.post('/cart', authenticateToken, async (req, res) => {
    const { itemId, quantity } = req.body;
    const userId = req.user.userId;

    try {
        const cartItem = await prisma.cartItem.create({
            data: {
                userId,
                itemId,
                quantity,
            },
        });
        res.json(cartItem);
    } catch (error) {
        res.status(400).json({ error: 'Failed to add item to cart' });
    }
});

// Get cart items
app.get('/cart', authenticateToken, async (req, res) => {
    const userId = req.user.userId;

    const cartItems = await prisma.cartItem.findMany({
        where: { userId },
        include: { item: true },
    });
    res.json(cartItems);
});

// Checkout
app.post('/checkout', authenticateToken, async (req, res) => {
    const { ccNumber } = req.body;
    const userId = req.user.userId;

    try {
        const cartItems = await prisma.cartItem.findMany({
            where: { userId },
            include: { item: true },
        });

        const totalAmount = cartItems.reduce((total, cartItem) => {
            return total + cartItem.item.price * cartItem.quantity;
        }, 0);

        const order = await prisma.order.create({
            data: {
                userId,
                totalAmount,
                status: 'COMPLETED',
                orderItems: {
                    create: cartItems.map((cartItem) => ({
                        itemId: cartItem.itemId,
                        quantity: cartItem.quantity,
                        price: cartItem.item.price,
                    })),
                },
            },
        });

        // Clear the user's cart
        await prisma.cartItem.deleteMany({ where: { userId } });

        res.json({ orderId: order.id, totalAmount: order.totalAmount });
    } catch (error) {
        res.status(400).json({ error: 'Checkout failed' });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));