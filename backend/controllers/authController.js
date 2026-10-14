const bcrypt = require('bcrypt');
const pool = require('../db');

async function register(req, res, next) {
    try {
        const { name, email, password } = req.body;
        if (!name?.trim() || !email?.trim() || !password || password.length < 8) {
            return res.status(400).json({ message: 'Name, email, and a password of at least 8 characters are required.' });
        }

        const [existing] = await pool.execute('SELECT id FROM users WHERE email = ?', [email.trim().toLowerCase()]);
        if (existing.length) return res.status(409).json({ message: 'An account with this email already exists.' });

        const passwordHash = await bcrypt.hash(password, 12);
        const [result] = await pool.execute(
            'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
            [name.trim(), email.trim().toLowerCase(), passwordHash]
        );
        req.session.user = { id: result.insertId, name: name.trim(), email: email.trim().toLowerCase() };
        res.status(201).json({ user: req.session.user });
    } catch (error) {
        console.error('REAL ERROR:', error.code, error.message);
        return res.status(500).json({ message: error.message });
    }
}

async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        if (!email?.trim() || !password) return res.status(400).json({ message: 'Email and password are required.' });

        const [users] = await pool.execute(
            'SELECT id, name, email, password_hash FROM users WHERE email = ?',
            [email.trim().toLowerCase()]
        );
        if (!users.length || !(await bcrypt.compare(password, users[0].password_hash))) {
            return res.status(401).json({ message: 'Email or password is incorrect.' });
        }

        const { id, name, email: userEmail } = users[0];
        req.session.user = { id, name, email: userEmail };
        res.json({ user: req.session.user });
    } catch (error) {
        console.error('REAL ERROR:', error.code, error.message);
        return res.status(500).json({ message: error.message });
    }
}

function currentUser(req, res) {
    res.json({ user: req.session.user || null });
}

function logout(req, res, next) {
    req.session.destroy((error) => {
        if (error) return next(error);
        res.clearCookie('PetShelterHub.sid');
        res.json({ message: 'You have been signed out.' });
    });
}

module.exports = { register, login, currentUser, logout };