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
Member Name: Nguyen Viet Ngan Anh
Github name: stellarrng
Contribution Score: 5
Task Completed:
- Coordinated task distribution across team members and managed overall project workflow throughout the development lifecycle
- Designed and implemented the database schema and collection structure
- Developed the user profile management feature including display, editing and avatar upload
- Built the match history view allowing players to browse past game sessions
- Implemented the match replay system with playback controls: play, pause, forward, backward

------------------------------------------------------------

Member Name: Nguyen Tri Khai
Github name: janoyjson
Contribution Score: 5
Task Completed:
- Developed the local two-player game mode
- Implemented the AI opponent across all three difficulty levels: easy, medium, hard
- Built the spectator feature including share token generation and live game viewing
- Handled cloud deployment and production environment configuration

------------------------------------------------------------

Member Name: Do Minh Thinh
Github name: mty06
Contribution Score: 5
Task Completed:
- Developed the local two-player game mode
- Implemented the user registration flow including input validation
- Built the premium subscription feature including wallet top-up and subscription activation

------------------------------------------------------------

Member Name: Phan Xuan Hung
Github name: pxhung2511
Contribution Score: 5
Task Completed:
- Implemented the login system including session management and JWT authentication
- Developed the login system including identifier resolution and brute-force protection
- Built the admin dashboard including player management, statistics, and room management

------------------------------------------------------------

Member Name: Hoang Dam Huy
Github name: hoang-huy123
Contribution Score: 5
Task Completed:
- Developed the online multiplayer game mode including real-time synchronisation via WebSocket
- Implemented the online game room arena for lobby creation, discovery, and joining
- Built the in-game chat feature for communication between players during online matches
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
