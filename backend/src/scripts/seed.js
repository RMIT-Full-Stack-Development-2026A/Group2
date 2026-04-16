/**
 * Gold dataset seed for TicTacToang (MongoDB).
 * Run from backend root: npm run seed
 * Requires MONGO_URI in .env
 */
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../modules/auth/model/user.model");
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
const DEFAULT_SEED_PASSWORD = "SeedPassword12@";
const TESTER_PASSWORD = "Cheeseburger12@";
const ADMIN_SEED_PASSWORD = "AdminPortal12@";

/** Deterministic 24-hex ObjectIds (readable prefixes in comments). */
const o = (hex24) => new mongoose.Types.ObjectId(hex24);

const I = {
  userAdmin: o("010101010101010101010101"),
  userAlpha: o("010101010101010101010102"),
  userBeta: o("010101010101010101010103"),
  userTester: o("010101010101010101010104"),
  userAdminOps: o("010101010101010101010105"),
  plan: o("020202020202020202020201"),
  planQuarterly: o("020202020202020202020202"),
  userSub: o("030303030303030303030301"),
  userSubTesterActive: o("030303030303030303030302"),
  userSubTesterExpired: o("030303030303030303030303"),
  wAlpha: o("040404040404040404040401"),
  wBeta: o("040404040404040404040402"),
  wTester: o("040404040404040404040403"),
  wAdminOps: o("040404040404040404040404"),
  tx1: o("050505050505050505050501"),
  tx2: o("050505050505050505050502"),
  tx3: o("050505050505050505050503"),
  tx4: o("050505050505050505050504"),
  gs1: o("080808080808080808080801"),
  gs2: o("080808080808080808080802"),
  gs3: o("080808080808080808080803"),
  gs4: o("080808080808080808080804"),
  gs5: o("080808080808080808080805"),
  gs6: o("080808080808080808080806"),
  gp1: o("090909090909090909090901"),
  gp2: o("090909090909090909090902"),
  gp3: o("090909090909090909090903"),
  gp4: o("090909090909090909090904"),
  gp5: o("090909090909090909090905"),
  gp6: o("090909090909090909090906"),
  gp7: o("090909090909090909090907"),
  gp8: o("090909090909090909090908"),
  gp9: o("090909090909090909090909"),
  gp10: o("090909090909090909090910"),
  gp11: o("090909090909090909090911"),
  gp12: o("090909090909090909090912"),
  matchLobby1: o("0b0b0b0b0b0b0b0b0b0b0b01"),
  matchLobby2: o("0b0b0b0b0b0b0b0b0b0b0b02"),
};

function moveId(i) {
  const hex = i.toString(16).padStart(2, "0");
  return o(`0a0a0a0a0a0a0a0a0a0a0a${hex}`);
}

/** 3×3 cell (row, col) → single rowIndex for current Move schema */
function cell(row, col) {
  return row * 3 + col;
}

async function clearAll() {
  const order = [
    Move,
    GameParticipant,
    MatchLobby,
    GameSession,
    Transaction,
    Wallet,
    UserSubscription,
    SubscriptionPlan,
    User,
  ];
  for (const Model of order) {
    await Model.deleteMany({});
  }
  for (const name of ["boardstyles", "markers", "onlinegamerooms", "messages"]) {
    try {
      await mongoose.connection.collection(name).deleteMany({});
    } catch {
      /* collection may not exist */
    }
  }
}

async function seed() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("Missing MONGO_URI in environment.");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log("Connected. Clearing collections…");
  await clearAll();

async function clearAllCollections() {
  await mongoose.connection.db.dropDatabase();
  console.log("Dropped existing database content.");
}

async function buildPasswordHashes() {
  const [defaultHash, testerHash, adminHash] = await Promise.all([
    bcrypt.hash(DEFAULT_SEED_PASSWORD, 10),
    bcrypt.hash(TESTER_PASSWORD, 10),
    bcrypt.hash(ADMIN_SEED_PASSWORD, 10),
  ]);
  return { defaultHash, testerHash, adminHash };
}

async function insertSeedData(hashes) {
  await User.insertMany([
    {
      _id: I.userAdmin,
      role: "admin",
      country: "US",
      accountStatus: "active",
      username: "AdminRoot",
      passwordHash: hashes.defaultHash,
      createdAt: new Date("2026-01-05T10:00:00.000Z"),
      updatedAt: new Date("2026-04-01T08:00:00.000Z"),
    },
    {
      _id: I.userAlpha,
      role: "player",
      country: "CA",
      accountStatus: "active",
      username: "PlayerAlpha",
      passwordHash: hashes.defaultHash,
      createdAt: new Date("2026-02-10T14:30:00.000Z"),
      updatedAt: new Date("2026-04-03T16:20:00.000Z"),
    },
    {
      _id: I.userBeta,
      role: "player",
      country: "GB",
      accountStatus: "active",
      username: "PlayerBeta",
      passwordHash: hashes.defaultHash,
      createdAt: new Date("2026-02-18T09:15:00.000Z"),
      updatedAt: new Date("2026-04-02T11:45:00.000Z"),
    },
    {
      _id: I.userTester,
      role: "player",
      accountStatus: "active",
      username: "tester1",
      passwordHash: hashes.testerHash,
      createdAt: new Date("2026-02-25T08:10:00.000Z"),
      updatedAt: new Date("2026-04-15T13:40:00.000Z"),
    },
    {
      _id: I.userAdminOps,
      role: "admin",
      accountStatus: "active",
      username: "AdminOps",
      passwordHash: hashes.adminHash,
      createdAt: new Date("2026-02-01T09:00:00.000Z"),
      updatedAt: new Date("2026-04-15T09:00:00.000Z"),
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
      avatarURL: null,
      createdAt: new Date("2026-02-18T09:15:00.000Z"),
      updatedAt: new Date("2026-04-02T11:45:00.000Z"),
    },
    {
      userID: I.userTester,
      displayName: "Tester One",
      avatarURL: "https://cdn.tictactoang.dev/avatars/tester1.png",
      country: "Australia",
      email: "tester1@tictactoang.dev",
      createdAt: new Date("2026-02-25T08:10:00.000Z"),
      updatedAt: new Date("2026-04-15T13:40:00.000Z"),
    },
    {
      userID: I.userAdminOps,
      displayName: "Admin Ops",
      avatarURL: "https://cdn.tictactoang.dev/avatars/admin-ops.png",
      country: "Singapore",
      email: "admin.ops@tictactoang.dev",
      createdAt: new Date("2026-02-01T09:00:00.000Z"),
      updatedAt: new Date("2026-04-15T09:00:00.000Z"),
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
    {
      _id: I.planQuarterly,
      planName: "Quarterly Premium",
      price: 27,
      durationMonths: 3,
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
    {
      _id: I.userSubTesterActive,
      userID: I.userTester,
      planID: I.planQuarterly,
      status: "active",
      startDate: new Date("2026-04-01T00:00:00.000Z"),
      endDate: new Date("2026-07-01T00:00:00.000Z"),
    },
    {
      _id: I.userSubTesterExpired,
      userID: I.userTester,
      planID: I.plan,
      status: "expired",
      startDate: new Date("2026-02-01T00:00:00.000Z"),
      endDate: new Date("2026-03-01T00:00:00.000Z"),
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
    {
      _id: I.wTester,
      userId: I.userTester,
      balance: 96.75,
      updatedAt: new Date("2026-04-15T13:45:00.000Z"),
    },
    {
      _id: I.wAdminOps,
      userId: I.userAdminOps,
      balance: 250,
      updatedAt: new Date("2026-04-15T09:00:00.000Z"),
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
    {
      _id: I.tx2,
      userID: I.userTester,
      walletID: I.wTester,
      userSubscriptionID: I.userSubTesterExpired,
      currency: "USD",
      amount: 10,
      provider: "stripe",
      paymentDate: new Date("2026-02-01T00:03:03.000Z"),
      status: "success",
    },
    {
      _id: I.tx3,
      userID: I.userTester,
      walletID: I.wTester,
      userSubscriptionID: I.userSubTesterActive,
      currency: "USD",
      amount: 27,
      provider: "stripe",
      paymentDate: new Date("2026-04-01T00:02:00.000Z"),
      status: "success",
    },
    {
      _id: I.tx4,
      userID: I.userTester,
      walletID: I.wTester,
      userSubscriptionID: null,
      currency: "USD",
      amount: 5,
      provider: "wallet_adjustment",
      paymentDate: new Date("2026-04-10T16:20:00.000Z"),
      status: "refunded",
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
      boardSize: 10,
      winnerParticipantID: I.gp5,
      winningLine: [[0, 1], [1, 0], [2, 1], [3, 2], [4, 3]],
      currentTurn: null,
    },
    {
      _id: I.gs4,
      gameMode: "single_player",
      status: "finished",
      aiDifficulty: "hard",
      startTime: new Date("2026-04-09T11:00:00.000Z"),
      endTime: new Date("2026-04-09T11:08:30.000Z"),
      result: "player1_win",
      boardSize: 10,
      winnerParticipantID: I.gp7,
      winningLine: [[2, 2], [2, 3], [2, 4], [2, 5], [2, 6]],
      currentTurn: null,
    },
    {
      _id: I.gs5,
      gameMode: "two_player",
      status: "finished",
      startTime: new Date("2026-04-11T19:30:00.000Z"),
      endTime: new Date("2026-04-11T19:44:00.000Z"),
      result: "draw",
      boardSize: 15,
      winnerParticipantID: null,
      winningLine: [],
      currentTurn: null,
    },
    {
      _id: I.gs6,
      gameMode: "online_match",
      status: "ongoing",
      startTime: new Date("2026-04-15T14:15:00.000Z"),
      endTime: null,
      result: "pending",
      boardSize: 10,
      winnerParticipantID: null,
      winningLine: [],
      currentTurn: I.gp12,
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
    },
    {
      _id: I.gp2,
      sessionID: I.gs1,
      userID: null,
      participantType: "ai",
      isWinner: false,
      displayName: "CPU Easy",
    },
    {
      _id: I.gp3,
      sessionID: I.gs2,
      userID: I.userAlpha,
      participantType: "player",
      isWinner: false,
      displayName: "PlayerAlpha",
    },
    {
      _id: I.gp4,
      sessionID: I.gs2,
      userID: null,
      participantType: "ai",
      isWinner: true,
      displayName: "CPU Medium",
    },
    {
      _id: I.gp5,
      sessionID: I.gs3,
      userID: I.userAlpha,
      participantType: "player",
      isWinner: true,
      displayName: "PlayerAlpha",
    },
    {
      _id: I.gp6,
      sessionID: I.gs3,
      userID: I.userBeta,
      participantType: "player",
      isWinner: false,
      displayName: "PlayerBeta",
    },
    {
      _id: I.gp7,
      sessionID: I.gs4,
      userID: I.userTester,
      participantType: "player",
      isWinner: true,
      displayName: "tester1",
      marker: "P1",
      turnOrder: 1,
    },
    {
      _id: I.gp8,
      sessionID: I.gs4,
      userID: null,
      participantType: "ai",
      isWinner: false,
      displayName: "CPU Hard",
      marker: "P2",
      turnOrder: 2,
    },
    {
      _id: I.gp9,
      sessionID: I.gs5,
      userID: I.userTester,
      participantType: "player",
      isWinner: false,
      displayName: "tester1",
      marker: "P1",
      turnOrder: 1,
    },
    {
      _id: I.gp10,
      sessionID: I.gs5,
      userID: I.userAlpha,
      participantType: "player",
      isWinner: false,
      displayName: "PlayerAlpha",
      marker: "P2",
      turnOrder: 2,
    },
    {
      _id: I.gp11,
      sessionID: I.gs6,
      userID: I.userTester,
      participantType: "player",
      isWinner: false,
      displayName: "tester1",
      marker: "P1",
      turnOrder: 1,
    },
    {
      _id: I.gp12,
      sessionID: I.gs6,
      userID: I.userBeta,
      participantType: "player",
      isWinner: false,
      displayName: "PlayerBeta",
      marker: "P2",
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
    [I.gs4, I.gp7, 1, 2, 2, "2026-04-09T11:00:12.000Z"],
    [I.gs4, I.gp8, 2, 1, 1, "2026-04-09T11:00:31.000Z"],
    [I.gs4, I.gp7, 3, 2, 3, "2026-04-09T11:00:55.000Z"],
    [I.gs4, I.gp8, 4, 3, 3, "2026-04-09T11:01:18.000Z"],
    [I.gs4, I.gp7, 5, 2, 4, "2026-04-09T11:01:43.000Z"],
    [I.gs4, I.gp8, 6, 0, 0, "2026-04-09T11:02:01.000Z"],
    [I.gs4, I.gp7, 7, 2, 5, "2026-04-09T11:02:30.000Z"],
    [I.gs4, I.gp8, 8, 4, 2, "2026-04-09T11:02:50.000Z"],
    [I.gs4, I.gp7, 9, 2, 6, "2026-04-09T11:03:09.000Z"],
    [I.gs5, I.gp9, 1, 7, 7, "2026-04-11T19:30:06.000Z"],
    [I.gs5, I.gp10, 2, 7, 8, "2026-04-11T19:30:18.000Z"],
    [I.gs5, I.gp9, 3, 8, 7, "2026-04-11T19:30:34.000Z"],
    [I.gs5, I.gp10, 4, 6, 8, "2026-04-11T19:30:45.000Z"],
    [I.gs5, I.gp9, 5, 7, 6, "2026-04-11T19:31:02.000Z"],
    [I.gs5, I.gp10, 6, 8, 8, "2026-04-11T19:31:20.000Z"],
    [I.gs5, I.gp9, 7, 6, 7, "2026-04-11T19:31:36.000Z"],
    [I.gs5, I.gp10, 8, 8, 6, "2026-04-11T19:31:58.000Z"],
    [I.gs5, I.gp9, 9, 9, 7, "2026-04-11T19:32:15.000Z"],
    [I.gs5, I.gp10, 10, 6, 6, "2026-04-11T19:32:40.000Z"],
    [I.gs6, I.gp11, 1, 4, 4, "2026-04-15T14:15:10.000Z"],
    [I.gs6, I.gp12, 2, 4, 5, "2026-04-15T14:15:22.000Z"],
    [I.gs6, I.gp11, 3, 5, 4, "2026-04-15T14:15:37.000Z"],
    [I.gs6, I.gp12, 4, 5, 5, "2026-04-15T14:15:55.000Z"],
  ];

  const moves = moveRows.map(([sessionID, participantID, moveNumber, r, c, iso], idx) => ({
    _id: moveId(idx + 1),
    sessionID,
    participantID,
    moveNumber,
    rowIndex: cell(r, c),
    playedAt: new Date(iso),
  }));

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
    {
      _id: I.matchLobby2,
      sessionId: I.gs6,
      createdBy: I.userTester,
      lobbyCode: "ROOM-9901",
      status: "active",
      startedAt: new Date("2026-04-15T14:15:00.000Z"),
      endedAt: null,
      createdAt: new Date("2026-04-15T14:12:00.000Z"),
    },
  ]);

  console.log("Seed completed successfully.");
  await mongoose.disconnect();
}

async function runSeed() {
  await connectSeedDb();
  await clearAllCollections();
  const hashes = await buildPasswordHashes();
  await insertSeedData(hashes);
  console.log(`Seed complete for database: ${TARGET_DB}`);
  console.log("Seed credentials:");
  console.log(`- tester1 / ${TESTER_PASSWORD}`);
  console.log(`- AdminOps / ${ADMIN_SEED_PASSWORD}`);
  console.log(`- AdminRoot, PlayerAlpha, PlayerBeta / ${DEFAULT_SEED_PASSWORD}`);
}

runSeed()
  .catch((error) => {
    console.error("Seed failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
