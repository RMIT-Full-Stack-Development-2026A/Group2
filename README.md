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

| Member Name         | Task Completed                                              | Contribution Score |
|---------------------|-------------------------------------------------------------|--------------------|
| Nguyen Viet Ngan Anh| database + profile + match history + match replay           | 5                  |
| Nguyen Tri Khai     | local game + ai mode + spectator + cloud deployment         | 5                  |
| Do Minh Thinh       | local game + login + premium                                | 5                  |
| Phan Xuan Hung      | signup + login + admin                                      | 5                  |
| Hoang Dam Huy       | online game                                                 | 5                  |

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

Create a `.env` file inside the `backend` folder.

```env
PORT=3000
MONGO_URI=mongodb+srv://tictactoang_user:fullstack12%40@tictactoang.x8rhijp.mongodb.net/tictactoang1
DB_NAME=tictactoang1
SEED_DB_NAME=tictactoang1

ACCESS_TOKEN_SECRET=6a745750f3b7b9b3240057e1e008cf0b4484999cda127340da55835710f45f0b911d72d9a6a9c8e85139a85c39242cf2a577910a8378352f4abfab72d83d0417
REFRESH_TOKEN_SECRET=be77158dfea1a08b29d74e9a98c3a84f982ae1b517228b85ced92036fad2c1b12b87299cccc1b7af21b724f121e567ddcf054da18e5b510e87f95cf7b5f54404

CLOUDINARY_CLOUD_NAME=ddfzuu6hz
CLOUDINARY_API_KEY=255412539248575
CLOUDINARY_API_SECRET=bZu8Bt1fXcebcAvM8dXrQ7QHYko

CLIENT_URL=http://localhost:5173

STRIPE_SECRET_KEY=sk_test_51TQQPZQskDU4B6SW5gi5S8sOxJrRJzsD5Ktv4SnCx6mMX5lsTtBkasNqEtmgWcVOsIZ25bK5bcWBFJihHQWO0FO70006rVBKAh

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=chanlamroi.thinh@gmail.com
EMAIL_PASS=ubmgecxailszpslw
EMAIL_FROM=TicTacToang Support <chanlamroi@gmail.com>
```

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
