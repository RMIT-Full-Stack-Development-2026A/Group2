/**
 * Seed script for non-test database with split User/Profile schema.
 *
 * Usage:
 * - npm run seed
 * - or: SEED_DB_NAME=tictactoang npm run seed
 */
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const User = require("../modules/auth/model/user.model");
const Profile = require("../modules/profile/model/profile.model");
const Wallet = require("../modules/wallet/model/wallet.model");
const Transaction = require("../modules/wallet/model/transaction.model");
const SubscriptionPlan = require("../modules/premium/model/subscriptionPlan.model");
const UserSubscription = require("../modules/premium/model/userSubscription.model");
const GameSession = require("../modules/game/model/gameSession.model");
const GameParticipant = require("../modules/game/model/gameParticipant.model");
const Move = require("../modules/game/model/move.model");
const MatchLobby = require("../modules/multiplayer/model/matchLobby.model");

dotenv.config();

const TARGET_DB = process.env.SEED_DB_NAME || "tictactoang";
const PASSWORD_HASH =
  "$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31Cm";

const o = (hex24) => new mongoose.Types.ObjectId(hex24);
const I = {
  userAdmin: o("010101010101010101010101"),
  userAlpha: o("010101010101010101010102"),
  userBeta: o("010101010101010101010103"),
  plan: o("020202020202020202020201"),
  userSub: o("030303030303030303030301"),
  wAlpha: o("040404040404040404040401"),
  wBeta: o("040404040404040404040402"),
  tx1: o("050505050505050505050501"),
  gs1: o("080808080808080808080801"),
  gs2: o("080808080808080808080802"),
  gs3: o("080808080808080808080803"),
  gp1: o("090909090909090909090901"),
  gp2: o("090909090909090909090902"),
  gp3: o("090909090909090909090903"),
  gp4: o("090909090909090909090904"),
  gp5: o("090909090909090909090905"),
  gp6: o("090909090909090909090906"),
  matchLobby1: o("0b0b0b0b0b0b0b0b0b0b0b01"),
};

function moveId(i) {
  const hex = i.toString(16).padStart(2, "0");
  return o(`0a0a0a0a0a0a0a0a0a0a0a${hex}`);
}

async function connectSeedDb() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("Missing MONGO_URI in environment.");
  }
  if (TARGET_DB.toLowerCase() === "test") {
    throw new Error("Refusing to seed 'test' database. Set SEED_DB_NAME to a non-test database.");
  }

  await mongoose.connect(uri, { dbName: TARGET_DB });
  const connectedDb = mongoose.connection?.db?.databaseName;
  if (!connectedDb || connectedDb.toLowerCase() === "test") {
    throw new Error("Safety stop: connected database is 'test'.");
  }
  console.log(`Connected to database: ${connectedDb}`);
}

async function clearAllCollections() {
  await mongoose.connection.db.dropDatabase();
  console.log("Dropped existing database content.");
}

async function insertSeedData() {
  await User.insertMany([
    {
      _id: I.userAdmin,
      role: "admin",
      accountStatus: "active",
      username: "AdminRoot",
      passwordHash: PASSWORD_HASH,
      createdAt: new Date("2026-01-05T10:00:00.000Z"),
      updatedAt: new Date("2026-04-01T08:00:00.000Z"),
    },
    {
      _id: I.userAlpha,
      role: "player",
      accountStatus: "active",
      username: "PlayerAlpha",
      passwordHash: PASSWORD_HASH,
      createdAt: new Date("2026-02-10T14:30:00.000Z"),
      updatedAt: new Date("2026-04-03T16:20:00.000Z"),
    },
    {
      _id: I.userBeta,
      role: "player",
      accountStatus: "active",
      username: "PlayerBeta",
      passwordHash: PASSWORD_HASH,
      createdAt: new Date("2026-02-18T09:15:00.000Z"),
      updatedAt: new Date("2026-04-02T11:45:00.000Z"),
    },
  ]);

  await Profile.insertMany([
    {
      userID: I.userAdmin,
      displayName: "AdminRoot",
      avatarURL: "https://cdn.tictactoang.dev/avatars/admin.png",
      country: "United States",
      email: "admin@tictactoang.dev",
      createdAt: new Date("2026-01-05T10:00:00.000Z"),
      updatedAt: new Date("2026-04-01T08:00:00.000Z"),
    },
    {
      userID: I.userAlpha,
      displayName: "PlayerAlpha",
      avatarURL: "https://cdn.tictactoang.dev/avatars/alpha.png",
      country: "Canada",
      email: "alpha.player@email.com",
      createdAt: new Date("2026-02-10T14:30:00.000Z"),
      updatedAt: new Date("2026-04-03T16:20:00.000Z"),
    },
    {
      userID: I.userBeta,
      displayName: "PlayerBeta",
      avatarURL: null,
      country: "United Kingdom",
      email: "beta.player@email.com",
      createdAt: new Date("2026-02-18T09:15:00.000Z"),
      updatedAt: new Date("2026-04-02T11:45:00.000Z"),
    },
  ]);

  await SubscriptionPlan.insertMany([
    {
      _id: I.plan,
      planName: "Monthly Premium",
      price: 10,
      durationMonths: 1,
      isActive: true,
    },
  ]);

  await UserSubscription.insertMany([
    {
      _id: I.userSub,
      userID: I.userAlpha,
      planID: I.plan,
      status: "active",
      startDate: new Date("2026-03-01T00:00:00.000Z"),
      endDate: new Date("2026-04-01T00:00:00.000Z"),
    },
  ]);

  await Wallet.insertMany([
    {
      _id: I.wAlpha,
      userId: I.userAlpha,
      balance: 47.5,
      updatedAt: new Date("2026-03-01T00:06:30.000Z"),
    },
    {
      _id: I.wBeta,
      userId: I.userBeta,
      balance: 0.5,
      updatedAt: new Date("2026-03-20T18:00:00.000Z"),
    },
  ]);

  await Transaction.insertMany([
    {
      _id: I.tx1,
      userID: I.userAlpha,
      walletID: I.wAlpha,
      userSubscriptionID: I.userSub,
      currency: "USD",
      amount: 10,
      provider: "stripe",
      paymentDate: new Date("2026-03-01T00:05:12.000Z"),
      status: "success",
    },
  ]);

  await GameSession.insertMany([
    {
      _id: I.gs1,
      gameMode: "single_player",
      status: "finished",
      aiDifficulty: "easy",
      startTime: new Date("2026-03-15T19:00:00.000Z"),
      endTime: new Date("2026-03-15T19:04:00.000Z"),
      result: "player1_win",
      currentTurn: null,
    },
    {
      _id: I.gs2,
      gameMode: "single_player",
      status: "finished",
      aiDifficulty: "medium",
      startTime: new Date("2026-03-16T20:10:00.000Z"),
      endTime: new Date("2026-03-16T20:14:30.000Z"),
      result: "player2_win",
      currentTurn: null,
    },
    {
      _id: I.gs3,
      gameMode: "two_player",
      status: "finished",
      startTime: new Date("2026-03-22T17:00:00.000Z"),
      endTime: new Date("2026-03-22T17:12:00.000Z"),
      result: "player1_win",
      currentTurn: null,
    },
  ]);

  await GameParticipant.insertMany([
    {
      _id: I.gp1,
      sessionID: I.gs1,
      userID: I.userAlpha,
      participantType: "player",
      isWinner: true,
      displayName: "PlayerAlpha",
      marker: "X",
      turnOrder: 1,
    },
    {
      _id: I.gp2,
      sessionID: I.gs1,
      userID: null,
      participantType: "ai",
      isWinner: false,
      displayName: "CPU Easy",
      marker: "O",
      turnOrder: 2,
    },
    {
      _id: I.gp3,
      sessionID: I.gs2,
      userID: I.userAlpha,
      participantType: "player",
      isWinner: false,
      displayName: "PlayerAlpha",
      marker: "X",
      turnOrder: 1,
    },
    {
      _id: I.gp4,
      sessionID: I.gs2,
      userID: null,
      participantType: "ai",
      isWinner: true,
      displayName: "CPU Medium",
      marker: "O",
      turnOrder: 2,
    },
    {
      _id: I.gp5,
      sessionID: I.gs3,
      userID: I.userAlpha,
      participantType: "player",
      isWinner: true,
      displayName: "PlayerAlpha",
      marker: "X",
      turnOrder: 1,
    },
    {
      _id: I.gp6,
      sessionID: I.gs3,
      userID: I.userBeta,
      participantType: "player",
      isWinner: false,
      displayName: "PlayerBeta",
      marker: "O",
      turnOrder: 2,
    },
  ]);

  const moveRows = [
    [I.gs1, I.gp1, 1, 0, 0, "2026-03-15T19:00:10.000Z"],
    [I.gs1, I.gp2, 2, 1, 1, "2026-03-15T19:00:25.000Z"],
    [I.gs1, I.gp1, 3, 0, 1, "2026-03-15T19:00:40.000Z"],
    [I.gs1, I.gp2, 4, 2, 0, "2026-03-15T19:00:55.000Z"],
    [I.gs1, I.gp1, 5, 0, 2, "2026-03-15T19:01:10.000Z"],
    [I.gs1, I.gp2, 6, 2, 2, "2026-03-15T19:01:28.000Z"],
    [I.gs1, I.gp1, 7, 1, 0, "2026-03-15T19:01:45.000Z"],
    [I.gs2, I.gp3, 1, 1, 1, "2026-03-16T20:10:05.000Z"],
    [I.gs2, I.gp4, 2, 0, 0, "2026-03-16T20:10:22.000Z"],
    [I.gs2, I.gp3, 3, 2, 2, "2026-03-16T20:10:40.000Z"],
    [I.gs2, I.gp4, 4, 0, 2, "2026-03-16T20:10:58.000Z"],
    [I.gs2, I.gp3, 5, 2, 0, "2026-03-16T20:11:15.000Z"],
    [I.gs2, I.gp4, 6, 0, 1, "2026-03-16T20:11:33.000Z"],
    [I.gs2, I.gp3, 7, 2, 1, "2026-03-16T20:11:50.000Z"],
    [I.gs2, I.gp4, 8, 1, 2, "2026-03-16T20:12:08.000Z"],
    [I.gs3, I.gp5, 1, 0, 1, "2026-03-22T17:00:08.000Z"],
    [I.gs3, I.gp6, 2, 1, 1, "2026-03-22T17:00:26.000Z"],
    [I.gs3, I.gp5, 3, 2, 1, "2026-03-22T17:00:44.000Z"],
    [I.gs3, I.gp6, 4, 0, 0, "2026-03-22T17:01:02.000Z"],
    [I.gs3, I.gp5, 5, 1, 0, "2026-03-22T17:01:20.000Z"],
    [I.gs3, I.gp6, 6, 2, 0, "2026-03-22T17:01:38.000Z"],
    [I.gs3, I.gp5, 7, 1, 2, "2026-03-22T17:01:56.000Z"],
  ];

  const moves = moveRows.map(
    ([sessionID, participantID, moveNumber, row, col, iso], idx) => ({
      _id: moveId(idx + 1),
      sessionID,
      participantID,
      moveNumber,
      rowIndex: row,
      colIndex: col,
      playedAt: new Date(iso),
    }),
  );
  await Move.insertMany(moves);

  await MatchLobby.insertMany([
    {
      _id: I.matchLobby1,
      sessionId: I.gs3,
      createdBy: I.userAlpha,
      lobbyCode: "ROOM-8842",
      status: "finished",
      startedAt: new Date("2026-03-22T17:00:00.000Z"),
      endedAt: new Date("2026-03-22T17:12:00.000Z"),
      createdAt: new Date("2026-03-22T16:55:00.000Z"),
    },
  ]);
}

async function runSeed() {
  await connectSeedDb();
  await clearAllCollections();
  await insertSeedData();
  console.log(`Seed complete for database: ${TARGET_DB}`);
}

runSeed()
  .catch((error) => {
    console.error("Seed failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
