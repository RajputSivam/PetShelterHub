const pool = require('../db');

async function createVolunteer(req, res, next) {
    try {
        const { name, email, phone, availability, interests = '' } = req.body;
        if (!name?.trim() || !email?.trim() || !phone?.trim() || !availability?.trim()) {
            return res.status(400).json({ message: 'Name, email, phone, and availability are required.' });
        }

        await pool.execute(
            'INSERT INTO volunteers (user_id, name, email, phone, availability, interests) VALUES (?, ?, ?, ?, ?, ?)',
            [req.session.user?.id || null, name.trim(), email.trim().toLowerCase(), phone.trim(), availability.trim(), interests.trim()]
        );
        res.status(201).json({ message: 'Thanks for stepping up. Our volunteer coordinator will contact you.' });
    } catch (error) {
        next(error);
    }
}

module.exports = { createVolunteer };