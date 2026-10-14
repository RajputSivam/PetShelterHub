function createDonation(req, res) {
    return res.status(410).json({
        message: 'Donations now require Razorpay checkout. Start at POST /api/payments/create-order.'
    });
}

module.exports = { createDonation };