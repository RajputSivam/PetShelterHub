# PetShelterHub

A web-based pet shelter management system that helps shelters handle user accounts, pet adoptions, donations, and volunteer sign-ups in one place.

**Live demo:** [https://petshelterhub-production.up.railway.app/login.html](https://petshelterhub-production.up.railway.app/login.html)

---

## Features

- **User authentication:** Secure login and registration for adopters, donors, and volunteers
- **Pet adoption:** Browse available pets and submit adoption requests
- **Donations:** Record and track donations to the shelter
- **Volunteer management:** Sign up and manage volunteer participation
- **Responsive interface:** Works on desktop and mobile browsers

## Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | HTML, CSS, JavaScript                   |
| Backend   | Node.js, Express.js                     |
| Database  | MySQL                                   |
| Deployment| Railway                                 |
| Local dev | XAMPP (MySQL), VS Code Live Server      |

## Project Structure

```
PetShelterHub/
├── backend/
│   ├── config/          # Database connection settings
│   ├── routes/          # API routes (auth, pets, adoptions, donations, volunteers)
│   ├── controllers/     # Request handling logic
│   ├── models/          # Database queries
│   ├── server.js        # Express app entry point
│   └── package.json
├── frontend/
│   ├── css/             # Stylesheets
│   ├── js/              # Client-side scripts
│   ├── images/          # Static assets
│   ├── login.html
│   └── index.html
└── README.md
```

> Adjust this tree to match your actual folders.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [XAMPP](https://www.apachefriends.org/) (for MySQL)
- [VS Code](https://code.visualstudio.com/) with the Live Server extension
- Git

### 1. Clone the repository

```bash
git clone https://github.com/[your-username]/PetShelterHub.git
cd PetShelterHub
```

### 2. Set up the database

1. Start **MySQL** from the XAMPP Control Panel.
2. Open phpMyAdmin at `http://localhost/phpmyadmin`.
3. Create a database named `petshelterhub`.
4. Import the schema: `[path/to/schema.sql]`

### 3. Configure environment variables

Create a `.env` file inside `backend/`:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=petshelterhub
JWT_SECRET=your_secret_key
```

### 4. Install backend dependencies and run the server

```bash
cd backend
npm install
npm start
```

The API will run at `http://localhost:5000`.

### 5. Run the frontend

Open the `frontend/` folder in VS Code, right-click `login.html`, and select **Open with Live Server**.

## API Endpoints

| Method | Endpoint              | Description                    |
|--------|-----------------------|--------------------------------|
| POST   | `/api/auth/register`  | Register a new user            |
| POST   | `/api/auth/login`     | Log in and receive a token     |
| GET    | `/api/pets`           | List available pets            |
| POST   | `/api/adoptions`      | Submit an adoption request     |
| POST   | `/api/donations`      | Record a donation              |
| POST   | `/api/volunteers`     | Register as a volunteer        |

> Update this table with your actual routes.

## Deployment

The app is deployed on [Railway](https://railway.app/). To deploy your own instance:

1. Push the repository to GitHub.
2. Create a new Railway project and connect the repository.
3. Add a MySQL service and copy its connection variables into the project's environment settings.
4. Set `JWT_SECRET` and any other variables from the `.env` section above.
5. Deploy. Railway will build and start the Node.js service automatically.

## Screenshots

_Add screenshots of the login page, pet listing, and admin dashboard here._

## Roadmap

- [ ] Admin dashboard for managing pets and adoption requests
- [ ] Email notifications for adoption status updates
- [ ] Donation reports and export
- [ ] Role-based access control for staff and volunteers

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m "Add your feature"`).
4. Push to the branch and open a Pull Request.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

Shivam Rajput
Email:rajputshivamrajput280@gmail.com
GitHub: RajputSivam
