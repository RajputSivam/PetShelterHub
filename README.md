# PetShelterHub 🐾

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)](https://petshelterhub-production.up.railway.app/login.html)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

**A modern, web-based pet shelter management system that brings adoptions, donations, and volunteer coordination together in one secure platform.**

[Live Demo](https://petshelterhub-production.up.railway.app/login.html) · [Report a Bug](../../issues) · [Request a Feature](../../issues)

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Overview

PetShelterHub helps animal shelters streamline their day-to-day operations. Adopters can browse available pets and submit requests, donors can contribute to the shelter, and volunteers can sign up to support the team, all through a responsive interface backed by a secure REST API.

## Key Features

| Feature | Description |
|---|---|
| 🔐 **Secure Authentication** | Registration and login for adopters, donors, and volunteers, with token-based sessions |
| 🐶 **Pet Adoption** | Browse available pets and submit adoption requests in a few clicks |
| 💝 **Donation Tracking** | Record and monitor contributions made to the shelter |
| 🤝 **Volunteer Management** | Sign up and manage volunteer participation |
| 📱 **Responsive Design** | Optimized for desktop, tablet, and mobile browsers |

## Screenshots

> 📸 Screenshots coming soon. Add images of the login page, pet listings, and dashboard here.

<!--
![Login Page](docs/screenshots/login.png)
![Pet Listings](docs/screenshots/pets.png)
-->

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | HTML5, CSS3, JavaScript |
| **Backend** | Node.js, Express.js |
| **Database** | MySQL |
| **Authentication** | JSON Web Tokens (JWT) |
| **Deployment** | Railway |
| **Local Development** | XAMPP (MySQL), VS Code Live Server |

## Project Structure

```
PetShelterHub/
├── backend/
│   ├── config/          # Database connection settings
│   ├── routes/          # API routes (auth, pets, adoptions, donations, volunteers)
│   ├── controllers/     # Request handling logic
│   ├── models/          # Database queries
│   ├── server.js        # Express application entry point
│   └── package.json
├── frontend/
│   ├── css/             # Stylesheets
│   ├── js/              # Client-side scripts
│   ├── images/          # Static assets
│   ├── login.html
│   └── index.html
└── README.md
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- [XAMPP](https://www.apachefriends.org/) (for MySQL)
- [VS Code](https://code.visualstudio.com/) with the Live Server extension
- [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/RajputSivam/PetShelterHub.git
cd PetShelterHub
```

### 2. Set Up the Database

1. Start **MySQL** from the XAMPP Control Panel.
2. Open phpMyAdmin at `http://localhost/phpmyadmin`.
3. Create a database named `petshelterhub`.
4. Import the schema file: `backend/database/schema.sql`

### 3. Configure Environment Variables

Create a `.env` file inside the `backend/` directory (see [Environment Variables](#environment-variables)).

### 4. Install Dependencies and Start the Server

```bash
cd backend
npm install
npm start
```

The API will be available at `http://localhost:5000`.

### 5. Launch the Frontend

Open the `frontend/` folder in VS Code, right-click `login.html`, and select **Open with Live Server**.

## Environment Variables

Create a `backend/.env` file with the following values:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=petshelterhub
JWT_SECRET=your_secure_secret_key
```

> ⚠️ Never commit your `.env` file. Use a strong, unique value for `JWT_SECRET` in production.

## API Reference

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Log in and receive a token | No |
| `GET` | `/api/pets` | List available pets | No |
| `POST` | `/api/adoptions` | Submit an adoption request | Yes |
| `POST` | `/api/donations` | Record a donation | Yes |
| `POST` | `/api/volunteers` | Register as a volunteer | Yes |

## Deployment

PetShelterHub is deployed on [Railway](https://railway.app/). To deploy your own instance:

1. Push the repository to GitHub.
2. Create a new Railway project and connect your repository.
3. Add a **MySQL** service and copy its connection variables into the project's environment settings.
4. Set `JWT_SECRET` and any other variables listed in [Environment Variables](#environment-variables).
5. Deploy. Railway will automatically build and start the Node.js service.

## Roadmap

- [x] User authentication and registration
- [x] Pet listings and adoption requests
- [x] Donation tracking
- [x] Volunteer sign-up
- [ ] Admin dashboard for managing pets and adoption requests
- [ ] Email notifications for adoption status updates
- [ ] Donation reports and CSV/PDF export
- [ ] Role-based access control for staff and volunteers

## Contributing

Contributions are welcome! To get involved:

1. **Fork** the repository.
2. **Create** a feature branch: `git checkout -b feature/your-feature-name`
3. **Commit** your changes: `git commit -m "Add: short description of your change"`
4. **Push** to your branch: `git push origin feature/your-feature-name`
5. **Open** a Pull Request.

Please keep changes focused and describe what you changed and why in your pull request.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

**Shivam Rajput**
📧 rajputshivamrajput280@gmail.com
🐙 [GitHub: RajputSivam](https://github.com/RajputSivam)

---

⭐ If you find this project useful, please consider giving it a star on GitHub. It helps others discover it!
