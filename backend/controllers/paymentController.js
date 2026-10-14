const crypto = require('crypto');
const Razorpay = require('razorpay');
const pool = require('../db');

function getRazorpayConfig() {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
        const error = new Error('Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in backend/.env.');
        error.statusCode = 503;
        throw error;
    }

    return {
        client: new Razorpay({ key_id: keyId, key_secret: keySecret }),
        keyId,
        keySecret
    };
}

function sendError(res, error) {
    console.error('REAL ERROR:', error.code, error.message);
    return res.status(error.statusCode || 500).json({
        message: error.message || 'The payment request could not be completed.'
    });
}

async function createOrder(req, res) {
    try {
        const { amount, name, email, message = '' } = req.body || {};
        const amountRupees = amount;
        const amountPaise = Math.round(amountRupees * 100);
        if (typeof amountRupees !== 'number' || !Number.isFinite(amountRupees) || amountRupees < 1 || !Number.isSafeInteger(amountPaise) || amountRupees > 99999999.99) {
            return res.status(400).json({ message: 'Donation amount must be at least INR 1 and no more than INR 99,999,999.99.' });
        }
        if (!name?.trim() || !email?.trim()) {
            return res.status(400).json({ message: 'Donor name and email are required.' });
        }

        const { client, keyId } = getRazorpayConfig();
        const receipt = `don-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
        const order = await client.orders.create({
            amount: amountPaise,
            currency: 'INR',
            receipt
        });

        await pool.execute(
            'INSERT INTO donations (user_id, donor_name, email, amount, message, razorpay_order_id, payment_status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [req.session.user?.id || null, name.trim(), email.trim().toLowerCase(), amountPaise / 100, message.trim(), order.id, 'pending']
        );

        return res.status(201).json({
            order_id: order.id,
            amount: amountPaise / 100,
            amount_paise: order.amount,
            currency: order.currency,
            key_id: keyId
        });
    } catch (error) {
        return sendError(res, error);
    }
}

async function verifyPayment(req, res) {
    try {
        const { razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature } = req.body || {};
        if (!orderId || !paymentId || !signature) {
            return res.status(400).json({ message: 'Razorpay order, payment, and signature values are required.' });
        }

        const { keySecret } = getRazorpayConfig();
        const [donations] = await pool.execute(
            'SELECT id, payment_status FROM donations WHERE razorpay_order_id = ? LIMIT 1',
            [orderId]
        );
        if (!donations.length) return res.status(404).json({ message: 'Donation order was not found.' });
        if (donations[0].payment_status !== 'pending') {
            return res.status(409).json({ message: 'This donation payment has already been processed.' });
        }

        const expected = crypto.createHmac('sha256', keySecret).update(`${orderId}|${paymentId}`).digest();
        const signatureIsHex = /^[a-f0-9]{64}$/i.test(signature);
        const received = signatureIsHex ? Buffer.from(signature, 'hex') : Buffer.alloc(0);
        const isValid = received.length === expected.length && crypto.timingSafeEqual(expected, received);

        if (!isValid) {
            await pool.execute(
                "UPDATE donations SET payment_status = 'failed' WHERE id = ? AND payment_status = 'pending'",
                [donations[0].id]
            );
            return res.status(400).json({ message: 'Payment signature verification failed.' });
        }

        const [result] = await pool.execute(
            "UPDATE donations SET payment_status = 'paid', razorpay_payment_id = ? WHERE id = ? AND payment_status = 'pending'",
            [paymentId, donations[0].id]
        );
        if (!result.affectedRows) return res.status(409).json({ message: 'This donation payment has already been processed.' });

        return res.json({ success: true, message: 'Thank you, your donation was received.' });
    } catch (error) {
        return sendError(res, error);
    }
}

module.exports = { createOrder, verifyPayment };