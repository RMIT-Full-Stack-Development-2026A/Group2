/**
 * Gold dataset seed for TicTacToang (MongoDB).
 * Run from backend root: npm run seed
 * Requires MONGO_URI in .env
 */
import dotenv from "dotenv";
import mongoose from "mongoose";

import User from "../modules/auth/model/user.model.js";
import Wallet from "../modules/wallet/model/wallet.model.js";
import Transaction from "../modules/wallet/model/transaction.model.js";
import SubscriptionPlan from "../modules/premium/model/subscriptionPlan.model.js";
import UserSubscription from "../modules/premium/model/userSubscription.model.js";
import BoardStyle from "../modules/media/model/boardStyle.model.js";
import Marker from "../modules/media/model/marker.model.js";
import GameSession from "../modules/game/model/gameSession.model.js";
import GameParticipant from "../modules/game/model/gameParticipant.model.js";
import Move from "../modules/game/model/move.model.js";
import OnlineGameRoom from "../modules/multiplayer/model/onlineGameRoom.model.js";
import Message from "../modules/multiplayer/model/message.model.js";

dotenv.config();

const PASSWORD_HASH =
  "$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31Cm";

/** Deterministic 24-hex ObjectIds (readable prefixes in comments). */
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
  bs1: o("060606060606060606060601"),
  bs2: o("060606060606060606060602"),
  mk1: o("070707070707070707070701"),
  mk2: o("070707070707070707070702"),
  mk3: o("070707070707070707070703"),
  mk4: o("070707070707070707070704"),
  mk5: o("070707070707070707070705"),
  mk6: o("070707070707070707070706"),
  gs1: o("080808080808080808080801"),
  gs2: o("080808080808080808080802"),
  gs3: o("080808080808080808080803"),
  gp1: o("090909090909090909090901"),
  gp2: o("090909090909090909090902"),
  gp3: o("090909090909090909090903"),
  gp4: o("090909090909090909090904"),
  gp5: o("090909090909090909090905"),
  gp6: o("090909090909090909090906"),
  room1: o("0b0b0b0b0b0b0b0b0b0b0b01"),
  msg1: o("0c0c0c0c0c0c0c0c0c0c0c01"),
  msg2: o("0c0c0c0c0c0c0c0c0c0c0c02"),
  msg3: o("0c0c0c0c0c0c0c0c0c0c0c03"),
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
    Message,
    Move,
    GameParticipant,
    OnlineGameRoom,
    GameSession,
    Transaction,
    Wallet,
    UserSubscription,
    Marker,
    BoardStyle,
    SubscriptionPlan,
    User,
  ];
  for (const Model of order) {
    await Model.deleteMany({});
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

  await User.insertMany([
    {
      _id: I.userAdmin,
      role: "admin",
      country: "US",
      accountStatus: "active",
      username: "AdminRoot",
      passwordHash: PASSWORD_HASH,
      email: "admin@tictactoang.dev",
      avatarURL: "https://cdn.tictactoang.dev/avatars/admin.png",
      createdAt: new Date("2026-01-05T10:00:00.000Z"),
      updatedAt: new Date("2026-04-01T08:00:00.000Z"),
    },
    {
      _id: I.userAlpha,
      role: "player",
      country: "CA",
      accountStatus: "active",
      username: "PlayerAlpha",
      passwordHash: PASSWORD_HASH,
      email: "alpha.player@email.com",
      avatarURL: "https://cdn.tictactoang.dev/avatars/alpha.png",
      createdAt: new Date("2026-02-10T14:30:00.000Z"),
      updatedAt: new Date("2026-04-03T16:20:00.000Z"),
    },
    {
      _id: I.userBeta,
      role: "player",
      country: "GB",
      accountStatus: "active",
      username: "PlayerBeta",
      passwordHash: PASSWORD_HASH,
      email: "beta.player@email.com",
      avatarURL: null,
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
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
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
      createdAt: new Date("2026-03-01T00:05:00.000Z"),
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

  await BoardStyle.insertMany([
    {
      _id: I.bs1,
      uploadedUser: I.userAlpha,
      boardSize: 10,
      style: "Midnight Grid",
      isActive: true,
      styleType: "preset",
      backgroundColor: "#0f172a",
      backgroundURL: "https://cdn.tictactoang.dev/boards/midnight-grid.png",
    },
    {
      _id: I.bs2,
      uploadedUser: I.userBeta,
      boardSize: 15,
      style: "Pastel Arena",
      isActive: true,
      styleType: "custom",
      backgroundColor: "#fce7f3",
      backgroundURL: "https://cdn.tictactoang.dev/boards/pastel-arena.png",
    },
  ]);

  await Marker.insertMany([
    {
      _id: I.mk1,
      uploadedUser: I.userAlpha,
      markerType: "classic_x_red",
      isActive: true,
    },
    {
      _id: I.mk2,
      uploadedUser: I.userAlpha,
      markerType: "classic_o_blue",
      isActive: true,
    },
    {
      _id: I.mk3,
      uploadedUser: I.userAlpha,
      markerType: "neon_x_cyan",
      isActive: true,
    },
    {
      _id: I.mk4,
      uploadedUser: I.userBeta,
      markerType: "neon_o_magenta",
      isActive: true,
    },
    {
      _id: I.mk5,
      uploadedUser: I.userAlpha,
      markerType: "ai_glyph_easy",
      isActive: true,
    },
    {
      _id: I.mk6,
      uploadedUser: I.userAlpha,
      markerType: "ai_glyph_medium",
      isActive: true,
    },
  ]);

  await GameSession.insertMany([
    {
      _id: I.gs1,
      boardStyleID: I.bs1,
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
      boardStyleID: I.bs1,
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
      boardStyleID: I.bs2,
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
      markerID: I.mk1,
      participantType: "player",
      isWinner: true,
      displayName: "PlayerAlpha",
    },
    {
      _id: I.gp2,
      sessionID: I.gs1,
      userID: null,
      markerID: I.mk5,
      participantType: "ai",
      isWinner: false,
      displayName: "CPU Easy",
    },
    {
      _id: I.gp3,
      sessionID: I.gs2,
      userID: I.userAlpha,
      markerID: I.mk1,
      participantType: "player",
      isWinner: false,
      displayName: "PlayerAlpha",
    },
    {
      _id: I.gp4,
      sessionID: I.gs2,
      userID: null,
      markerID: I.mk6,
      participantType: "ai",
      isWinner: true,
      displayName: "CPU Medium",
    },
    {
      _id: I.gp5,
      sessionID: I.gs3,
      userID: I.userAlpha,
      markerID: I.mk1,
      participantType: "player",
      isWinner: true,
      displayName: "PlayerAlpha",
    },
    {
      _id: I.gp6,
      sessionID: I.gs3,
      userID: I.userBeta,
      markerID: I.mk2,
      participantType: "player",
      isWinner: false,
      displayName: "PlayerBeta",
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

  const moves = moveRows.map(([sessionID, participantID, moveNumber, r, c, iso], idx) => ({
    _id: moveId(idx + 1),
    sessionID,
    participantID,
    moveNumber,
    rowIndex: cell(r, c),
    playedAt: new Date(iso),
  }));

  await Move.insertMany(moves);

  await OnlineGameRoom.insertMany([
    {
      _id: I.room1,
      sessionId: I.gs3,
      createdBy: I.userAlpha,
      roomNumber: "ROOM-8842",
      status: "finished",
      startedAt: new Date("2026-03-22T17:00:00.000Z"),
      endedAt: new Date("2026-03-22T17:12:00.000Z"),
      createdAt: new Date("2026-03-22T16:55:00.000Z"),
    },
  ]);

  await Message.insertMany([
    {
      _id: I.msg1,
      roomId: I.room1,
      senderId: I.userAlpha,
      content: "Hey, ready for a ranked match?",
      sentAt: new Date("2026-03-22T16:55:30.000Z"),
    },
    {
      _id: I.msg2,
      roomId: I.room1,
      senderId: I.userBeta,
      content: "Yep — same board style as last time?",
      sentAt: new Date("2026-03-22T16:56:05.000Z"),
    },
    {
      _id: I.msg3,
      roomId: I.room1,
      senderId: I.userAlpha,
      content: "Sounds good. Good luck!",
      sentAt: new Date("2026-03-22T16:56:40.000Z"),
    },
  ]);

  console.log("Seed completed successfully.");
  await mongoose.disconnect();
}

seed().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect();
  process.exit(1);
});
