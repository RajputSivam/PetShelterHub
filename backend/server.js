const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const session = require('express-session');

const authRoutes = require('./routes/auth');
const adoptionRoutes = require('./routes/adoption');
const donationRoutes = require('./routes/donations');
const paymentRoutes = require('./routes/payments');
const volunteerRoutes = require('./routes/volunteers');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 8080;
const allowedOrigins = process.env.FRONTEND_ORIGIN
    ? process.env.FRONTEND_ORIGIN.split(',').map((origin) => origin.trim())
    : ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5500', 'http://127.0.0.1:5500'];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
app.use(express.json());
app.use(session({
    name: 'PetShelterHub.sid',
    secret: process.env.SESSION_SECRET || 'replace-this-development-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24
    }
}));

app.get('/api/health', async (req, res, next) => {
    try {
        await pool.query('SELECT 1');
        res.json({ status: 'ok' });
    } catch (error) {
        console.error('REAL ERROR:', error.code, error.message);
        return res.status(500).json({ message: error.message });
    }
});

app.get('/api/pets', async (req, res, next) => {
    try {
        const [pets] = await pool.execute(
            "SELECT id, name, species, breed, age, sex, description, image_url FROM pets WHERE status = 'available' ORDER BY created_at DESC"
        );
        res.json(pets);
    } catch (error) {
        console.error('REAL ERROR:', error.code, error.message);
        return res.status(500).json({ message: error.message });
    }
});

app.use('/api/auth', authRoutes);
app.use('/api/adoptions', adoptionRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/volunteers', volunteerRoutes);

app.use('/api', (req, res) => res.status(404).json({ message: 'API endpoint not found.' }));
app.use(express.static(path.join(__dirname, '..', 'frontend')));
app.use((error, req, res, next) => {
    console.error(error.code || 'UNKNOWN_ERROR', error.message);
    console.error(error.stack || error);
    const message = error.code === 'ER_ACCESS_DENIED_ERROR'
        ? 'Database authentication failed. Check DB_HOST, DB_USER, DB_PASSWORD, and DB_NAME in backend/.env.'
        : error.message || 'Something went wrong.';
    res.status(500).json({ message });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    pool.query('SELECT 1')
        .then(() => console.log('Database connection successful.'))
        .catch((error) => console.error('Database connection failed:', error.message));
});
