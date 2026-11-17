import { describe, it, beforeEach, after, before } from "node:test";
import http from "node:http";
import { Server } from "socket.io";
import { io as Client } from "socket.io-client";
import { errorLogger } from "../../src/utils/loggers.js";
import { initDatabase } from "../../src/database/migrateAndSeed.js";
import assert from "node:assert";
import { userWithTokenFactory } from "../factories/user.factory.js";
import chatNamespace from "../../src/sockets/events/chat.js";
import db from "../../src/database/index.js";

let httpServer;
let io;
let port;

before(async () => {
  httpServer = http.createServer();
  io = new Server(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });
  chatNamespace(io);
  await new Promise((resolve) => httpServer.listen(0, "127.0.0.1", resolve));
  port = httpServer.address().port;
});

beforeEach(async () => {
  try {
    await initDatabase(false);
  } catch (error) {
    errorLogger(error);
  }
});

after(async () => {
  io.close();
  httpServer.close();
  try {
    await db.sequelize.close();
  } catch (error) {
    errorLogger(error);
  }
});

const connect = (token, name) =>
  new Promise((resolve, reject) => {
    const socket = Client(`ws://127.0.0.1:${port}/chat`, {
      auth: { token },
      transports: ["websocket"],
      reconnection: false,
    });
    socket.once("connect", () => resolve(socket));
    socket.once("connect_error", (err) => reject(new Error(`${name}: ${err.message}`)));
  });

const waitFor = (emitter, event, timeoutMs = 5000) =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error(`timed out waiting for ${event}`)),
      timeoutMs
    );
    emitter.once(event, (...args) => {
      clearTimeout(timer);
      resolve(args);
    });
  });

const emitWithAck = (socket, event, ...args) =>
  new Promise((resolve) => {
    socket.emit(event, ...args, (response) => resolve(response));
  });

const disconnectAll = (sockets) =>
  Promise.allSettled(
    sockets.filter(Boolean).map((s) => {
      if (!s.connected) {
        s.disconnect();
        return Promise.resolve();
      }
      return new Promise((resolve) => {
        s.once("disconnect", () => resolve());
        s.disconnect();
      });
    })
  );

const fetchConversation = async (id) => db.Chat.findByPk(id, { raw: true });

describe("sockets/chat - send-message path", () => {
  it("should deliver a message to an online participant and persist it as delivered", async () => {
    const alice = await userWithTokenFactory();
    const bob = await userWithTokenFactory();
    const aliceSocket = await connect(alice.accessToken, "alice");
    const bobSocket = await connect(bob.accessToken, "bob");
    try {
      // establish the conversation first
      const bobNewFriendP = waitFor(bobSocket, "new-friend");
      const addResult = await emitWithAck(
        aliceSocket,
        "add-new-friend",
        bob.user.id
      );
      assert.equal(addResult.success, true);
      const [newChat] = await bobNewFriendP;
      assert.ok(newChat, "friend should receive the new chat");

      // bob acks delivery when the message arrives
      const bobMessageP = new Promise((resolve) => {
        bobSocket.once("new-message", (message, deliveryAck) => {
          resolve(message);
          if (typeof deliveryAck === "function") deliveryAck("received");
        });
      });
      const aliceStatusP = waitFor(aliceSocket, "update-message-status");
      const sendAckP = emitWithAck(
        aliceSocket,
        "send-message",
        {
          body: "hello bob, shipment arrived",
          type: "text",
        },
        bob.user.id
      );

      const [ack, statusArgs, received] = await Promise.all([
        sendAckP,
        aliceStatusP,
        bobMessageP,
      ]);
      assert.equal(ack.success, true);
      assert.equal(ack.message, "recived");
      const [conId, msgId, status] = statusArgs;
      assert.equal(status, "delivered");
      assert.equal(received.body, "hello bob, shipment arrived");
      assert.equal(received.senderId, alice.user.id);
      assert.equal(received.stored, false, "wire copy is not the stored copy");
      assert.equal(received.id, msgId);

      const conversation = await fetchConversation(conId);
      assert.ok(conversation, "conversation must exist");
      const stored = conversation.conversation.find((m) => m.id === msgId);
      assert.ok(stored, "message must be persisted in the conversation");
      assert.equal(stored.body, "hello bob, shipment arrived");
      assert.equal(stored.delivered, true);
      assert.equal(stored.seen, false);
    } finally {
      await disconnectAll([aliceSocket, bobSocket]);
    }
  });

  it("should store a message for an offline participant without delivery", async () => {
    const alice = await userWithTokenFactory();
    const bob = await userWithTokenFactory();
    const aliceSocket = await connect(alice.accessToken, "alice");
    const bobSocket = await connect(bob.accessToken, "bob");
    try {
      const addResult = await emitWithAck(
        aliceSocket,
        "add-new-friend",
        bob.user.id
      );
      assert.equal(addResult.success, true);

      await new Promise((resolve) => {
        bobSocket.once("disconnect", resolve);
        bobSocket.disconnect();
      });

      const ack = await emitWithAck(
        aliceSocket,
        "send-message",
        {
          body: "offline message",
          type: "text",
        },
        bob.user.id
      );
      assert.equal(ack.success, true);
      assert.equal(ack.message, "sent");

      const chats = await db.Chat.findAll({ raw: true });
      const conversation = chats[0];
      const stored = (conversation.conversation || []).find(
        (m) => m.body === "offline message"
      );
      assert.ok(stored, "message must be persisted for the offline user");
      assert.equal(stored.delivered, false);
      assert.equal(stored.seen, false);
      assert.equal(stored.senderId, alice.user.id);
    } finally {
      await disconnectAll([aliceSocket, bobSocket]);
    }
  });

  it("should reject an invalid message", async () => {
    const alice = await userWithTokenFactory();
    const bob = await userWithTokenFactory();
    const aliceSocket = await connect(alice.accessToken, "alice");
    const bobSocket = await connect(bob.accessToken, "bob");
    try {
      await emitWithAck(aliceSocket, "add-new-friend", bob.user.id);

      // no participant: emit without ack (an ack would land in the
      // participant slot on the server) and verify nothing is stored
      aliceSocket.emit("send-message", {
        body: "no recipient",
        type: "text",
      });
      await new Promise((resolve) => setTimeout(resolve, 500));

      const emptyBody = await emitWithAck(
        aliceSocket,
        "send-message",
        { body: "   ", type: "text" },
        bob.user.id
      );
      assert.equal(emptyBody.success, false);

      const chats = await db.Chat.findAll({ raw: true });
      const messages = (chats[0].conversation || []).filter(
        (m) => m.body === "no recipient" || m.body.trim() === ""
      );
      assert.equal(messages.length, 0, "invalid messages must not be stored");
    } finally {
      await disconnectAll([aliceSocket, bobSocket]);
    }
  });

  it("should reject a message to a participant with no conversation", async () => {
    const alice = await userWithTokenFactory();
    const stranger = await userWithTokenFactory();
    const aliceSocket = await connect(alice.accessToken, "alice");
    try {
      const ack = await emitWithAck(
        aliceSocket,
        "send-message",
        { body: "who are you", type: "text" },
        stranger.user.id
      );
      assert.equal(ack.success, false);
    } finally {
      await disconnectAll([aliceSocket]);
    }
  });

  it("should rate limit a burst of messages", async () => {
    const alice = await userWithTokenFactory();
    const bob = await userWithTokenFactory();
    const aliceSocket = await connect(alice.accessToken, "alice");
    const bobSocket = await connect(bob.accessToken, "bob");
    try {
      await emitWithAck(aliceSocket, "add-new-friend", bob.user.id);
      bobSocket.on("new-message", (message, deliveryAck) => {
        if (typeof deliveryAck === "function") deliveryAck("received");
      });

      const acks = [];
      for (let i = 0; i < 12; i++) {
        acks.push(
          await emitWithAck(
            aliceSocket,
            "send-message",
            {
              body: `burst message ${i}`,
              type: "text",
            },
            bob.user.id
          )
        );
        if (!acks[i].success) break;
      }
      const limited = acks.find((a) => a.status === "limit reached");
      assert.ok(limited, "a send must eventually be rate limited");
      assert.equal(limited.success, false);

      const chats = await db.Chat.findAll({ raw: true });
      const storedCount = (chats[0].conversation || []).filter((m) =>
        m.body.startsWith("burst message")
      ).length;
      assert.ok(
        storedCount <= 10,
        `rate limiter must cap stored messages, got ${storedCount}`
      );
    } finally {
      await disconnectAll([aliceSocket, bobSocket]);
    }
  });
});
