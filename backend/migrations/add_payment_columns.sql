ALTER TABLE donations
  ADD COLUMN razorpay_order_id VARCHAR(100) NULL,
  ADD COLUMN razorpay_payment_id VARCHAR(100) NULL,
  ADD COLUMN payment_status VARCHAR(20) NOT NULL DEFAULT 'pending';