import { getLLMResponse, visAidInjector } from "@src/services/chatService";
import { generateSpeech } from "@src/services/voiceService";
import { Server, Socket } from "socket.io";
import { rm } from "fs/promises";
import path from "path";

interface ChatMessage {
    message: string;
    sessionId: string;
    sessionPaper: string;
}

const MAX_CHAT_USERS = 5; // limit concurrent chatbot users
const activeChatUsers = new Set<string>();

/**
 * Setup all socket event handlers
 */
export const setupSocketHandlers = (io: Server): void => {
    const clientNamespace = io.of("/client");

    clientNamespace.on("connection", (socket: Socket) => {
        console.log(`Client connected: ${socket.id}`);
        if (activeChatUsers.size >= MAX_CHAT_USERS) {
            console.log(`Chatbot unavailable for ${socket.id} (limit reached)`);
            socket.emit("chatbot_unavailable", {
                message: "Chatbot is currently busy. Please try again later.",
                timestamp: new Date().toISOString(),
            });
        } else {
            activeChatUsers.add(socket.id);
            console.log(`Chatbot slot assigned to ${socket.id}`);

            socket.emit("welcome", {
                message: "Welcome to NASA Space Biology Knowledge Engine!",
                sessionId: socket.id,
                timestamp: new Date().toISOString(),
            });

            socket.on("message", async (data: ChatMessage) => {
                await handleChatMessage(socket, data);
            });

            socket.on("clear", () => {
                handleClearChat(socket);
            });

            socket.on("disconnect", (reason: string) => {
                handleDisconnect(socket, reason);
            });

            socket.on("error", (error: Error) => {
                console.error(`Socket error for ${socket.id}:`, error);
            });
        }
    });
};

async function handleChatMessage(
    socket: Socket,
    data: ChatMessage
): Promise<void> {
    try {
        const { message, sessionId, sessionPaper } = data;

        if (!activeChatUsers.has(socket.id)) {
            socket.emit("chatbot_unavailable", {
                message: "You are not currently in an active chatbot slot.",
            });
            return;
        }

        // Validate message
        if (!message || message.trim().length === 0) {
            socket.emit("error", {
                error: "Message cannot be empty",
            });
            return;
        }
        console.log(`Message from ${socket.id}: "${message}"`);
        console.log(process.cwd());

        // Send thinking status
        socket.emit("thinking", {
            status: "processing",
            message: "Searching NASA databases...",
        });

        // TODO: Replace with real LLM call
        // const response = (await getLLMResponse(sessionId, message)).text;
        const response = { message: "s" };

        socket.emit("response", {
            message: sessionPaper
                ? visAidInjector(sessionPaper, response.message)
                : response,
            timestamp: new Date().toISOString(),
            ttsPath: generateSpeech(
                sessionId,
                Date.now().toString(),
                response.message
            ),
        });

        console.log(`Response sent to ${socket.id}`);
    } catch (error) {
        console.error("Error handling chat message:", error);
        socket.emit("error", {
            error: "Sorry, something went wrong. Please try again.",
        });
    }
}

function handleClearChat(socket: Socket): void {
    console.log(`Chat cleared for ${socket.id}`);
    socket.emit("cleared", {
        message: "Chat history cleared",
        timestamp: new Date().toISOString(),
    });
}

async function handleDisconnect(socket: Socket, reason: string): Promise<void> {
    console.log(`Client disconnected: ${socket.id}, Reason: ${reason}`);
    if (activeChatUsers.has(socket.id)) {
        activeChatUsers.delete(socket.id);
        await rm(path.join(process.cwd(), `temp/${socket.id}`), {
            recursive: true,
        });
        console.log(`Freed chatbot slot from ${socket.id}`);
    }
}
