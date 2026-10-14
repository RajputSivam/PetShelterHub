const pool = require('../db');

async function createDonation(req, res, next) {
    try {
        const { name, email, amount, message = '' } = req.body;
        const donationAmount = Number(amount);
        if (!name?.trim() || !email?.trim() || !Number.isFinite(donationAmount) || donationAmount <= 0) {
            return res.status(400).json({ message: 'Provide your name, email, and a donation amount greater than zero.' });
        }

        await pool.execute(
            'INSERT INTO donations (user_id, donor_name, email, amount, message) VALUES (?, ?, ?, ?, ?)',
            [req.session.user?.id || null, name.trim(), email.trim().toLowerCase(), donationAmount, message.trim()]
        );
        res.status(201).json({ message: 'Thank you for supporting the animals in our care.' });
    } catch (error) {
        next(error);
    }
}

module.exports = { createDonation };