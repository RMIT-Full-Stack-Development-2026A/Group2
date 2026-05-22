# TicTacToang

## GitHub Repository

https://github.com/RMIT-Full-Stack-Development-2026A/Group2

## Deployed Website URLs

The deployed web application can be accessed through the frontend URL below.

- Frontend: https://tictactoanggroup2-frontend.onrender.com/
- Backend API: https://tictactoanggroup2-backend.onrender.com/

## Login Credentials for Testing

Seeded accounts are available after running the backend seed script.

| Role   | Username / Identifier  | Password   |
|--------|------------------------|------------|
| Admin  | admin                  | Admin@1234 |
| Player | player_alpha           | Admin@1234 |
| Player | player_beta            | Admin@1234 |

## Team Contribution Table

| Member Name          | Task Completed                                             | Contribution Score |
|----------------------|------------------------------------------------------------|--------------------|
| Nguyen Viet Ngan Anh | database + profile + match history + match replay          | 5                  |
| Nguyen Tri Khai      | local game + ai mode + spectator + cloud deployment        | 5                  |
| Do Minh Thinh        | local game + login + premium                               | 5                  |
| Phan Xuan Hung       | signup + login + admin                                     | 5                  |
| Hoang Dam Huy        | online game                                                | 5                  |

## Steps to Start and Run the Website

### 1. Clone the Repository

```bash
git clone https://github.com/RMIT-Full-Stack-Development-2026A/Group2.git
cd Group2
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Configure Backend Environment Variables

Create a `.env` file inside the submission folder.

Copy the backend environment variable content from the submission folder and paste it into the `backend/.env` file.

### 4. Seed the Database

From the `backend` folder:

```bash
npm run seed
```

This creates the testing accounts listed above.

### 5. Start the Backend Server

From the `backend` folder:

```bash
node index.js
```

The backend runs at:

```text
http://localhost:3000
```

### 6. Install Frontend Dependencies

Open a new terminal from the project root:

```bash
cd ../frontend
npm install
```

### 7. Configure Frontend Environment Variables

Create a `.env` file inside the `frontend` folder.

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_PROXY_API_TARGET=http://localhost:3000
```


### 8. Start the Frontend Website

From the `frontend` folder:

```bash
npm run dev
```

The frontend runs at:

```text
http://localhost:5173
```
