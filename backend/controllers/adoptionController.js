const pool = require('../db');

async function createAdoption(req, res, next) {
    try {
        const { petId, name, email, phone, message = '' } = req.body;
        if (!Number.isInteger(Number(petId)) || !name?.trim() || !email?.trim() || !phone?.trim()) {
            return res.status(400).json({ message: 'Choose a pet and provide your name, email, and phone number.' });
        }

        const [pets] = await pool.execute("SELECT id FROM pets WHERE id = ? AND status = 'available'", [Number(petId)]);
        if (!pets.length) return res.status(404).json({ message: 'This pet is no longer available.' });

        await pool.execute(
            'INSERT INTO adoptions (user_id, pet_id, applicant_name, email, phone, message) VALUES (?, ?, ?, ?, ?, ?)',
            [req.session.user?.id || null, Number(petId), name.trim(), email.trim().toLowerCase(), phone.trim(), message.trim()]
        );
        res.status(201).json({ message: 'Your adoption request has been received. We will be in touch soon.' });
    } catch (error) {
        next(error);
    }
}

module.exports = { createAdoption };