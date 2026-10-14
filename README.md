# PetShelterHub

PetShelterHub is a small pet-shelter management starter with a plain HTML/CSS/JavaScript frontend and an Express/MySQL backend. Visitors can browse available pets, request an adoption, donate through Razorpay Checkout, and apply to volunteer. Accounts use bcrypt-hashed passwords and a session cookie.

## Requirements

- Node.js 18 or newer and npm
- MySQL 8 or a compatible MySQL server

## Setup

1. Create the database and tables, and add the sample pets:

	```powershell
	mysql -u root -p < backend/schema.sql
	```

2. Create `backend/.env` from `backend/.env.example`, then set `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME` for your MySQL installation. Set `DB_SSL=true` if your database provider requires TLS, and set `SESSION_SECRET` to a long, random value before deployment.

3. Add your Razorpay test credentials to `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in `backend/.env`. Never commit those credentials. Razorpay test mode simulates payments and does not charge or settle real money; use live credentials only when ready to accept real donations.

4. For an existing database, apply `backend/migrations/add_payment_columns.sql` once to add the Razorpay order, payment, and status columns. Fresh databases get them from `backend/schema.sql`.

5. Install dependencies and start the app:

	```powershell
	cd backend
	npm install
	npm start
	```

4. Open [http://localhost:3000](http://localhost:3000). Express serves the frontend and API from the same origin.

For Railway, configure the database and session values as service variables. Railway supplies `PORT` automatically; the server binds to `0.0.0.0` and serves both the frontend and API from the same origin.

For a separately hosted frontend, set `FRONTEND_ORIGIN` in `backend/.env` to its exact origin and serve the frontend on that origin. The frontend defaults to `http://localhost:3000/api` when opened on another local development port.

## API

- `GET /api/health` checks the database connection.
- `GET /api/pets` lists available pets.
- `POST /api/auth/register` with `{ "name", "email", "password" }` creates an account.
- `POST /api/auth/login` with `{ "email", "password" }` starts a session.
- `GET /api/auth/me` returns the current session user; `POST /api/auth/logout` ends the session.
- `POST /api/adoptions` accepts `{ "petId", "name", "email", "phone", "message" }`.
- `POST /api/payments/create-order` creates a pending INR donation order from `{ "name", "email", "amount", "message" }`.
- `POST /api/payments/verify` verifies the Razorpay signature and marks a matching pending donation paid.
- `POST /api/donations` is retired and returns `410`; donations must use Razorpay checkout.
- `POST /api/volunteers` accepts `{ "name", "email", "phone", "availability", "interests" }`.
