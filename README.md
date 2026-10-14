# PetShelterHub

PetShelterHub is a small pet-shelter management starter with a plain HTML/CSS/JavaScript frontend and an Express/MySQL backend. Visitors can browse available pets, request an adoption, record a donation pledge, and apply to volunteer. Accounts use bcrypt-hashed passwords and a session cookie.

## Requirements

- Node.js 18 or newer and npm
- MySQL 8 or a compatible MySQL server

## Setup

1. Create the database and tables, and add the sample pets:

	```powershell
	mysql -u root -p < backend/schema.sql
	```

2. Create `backend/.env` from `backend/.env.example`, then set `DB_HOST`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME` for your MySQL installation. Set `SESSION_SECRET` to a long, random value before deployment.

3. Install dependencies and start the app:

	```powershell
	cd backend
	npm install
	npm start
	```

4. Open [http://localhost:3000](http://localhost:3000). Express serves the frontend and API from the same origin.

For a separately hosted frontend, set `FRONTEND_ORIGIN` in `backend/.env` to its exact origin and serve the frontend on that origin. The frontend defaults to `http://localhost:3000/api` when opened on another local development port.

## API

- `GET /api/health` checks the database connection.
- `GET /api/pets` lists available pets.
- `POST /api/auth/register` with `{ "name", "email", "password" }` creates an account.
- `POST /api/auth/login` with `{ "email", "password" }` starts a session.
- `GET /api/auth/me` returns the current session user; `POST /api/auth/logout` ends the session.
- `POST /api/adoptions` accepts `{ "petId", "name", "email", "phone", "message" }`.
- `POST /api/donations` accepts `{ "name", "email", "amount", "message" }`.
- `POST /api/volunteers` accepts `{ "name", "email", "phone", "availability", "interests" }`.

Donation submissions record pledges only. No payment details are collected and payment processing is not configured.
