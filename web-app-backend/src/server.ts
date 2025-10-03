import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import apiRoutes from "./routes/api";
import { setupSocketHandlers } from "./sockets/chatHandler";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        //TODO: replace with front end irl
        origin: process.env.CLIENT_URL ?? "http://localhost:5173",
        methods: ["GET", "POST"],
    },
    connectionStateRecovery: {
        maxDisconnectionDuration: 60 * 1000,
        skipMiddlewares: true,
    },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", apiRoutes);

app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Socket.io setup
setupSocketHandlers(io);

const PORT = process.env.PORT ?? 3000;

httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log("📡 WebSocket server ready");
});
