import { getLLMResponse, visAidInjector } from "@src/services/chatService";
import { generateSpeech } from "@src/services/voiceService";
import { Server, Socket } from "socket.io";
import { rm } from "fs/promises";
import path from "path";
import QuickLRU from "quick-lru";
import { randomUUID } from "crypto";

interface ChatMessage {
    message: string;
    sessionId: string;
    sessionPaper: string;
}

const MAX_CHAT_USERS = 5; // limit concurrent chatbot users
const activeChatUsers = new Map<
    string,
    {
        cachedMsgs: QuickLRU<any, string>;
        persona?: string;
    }
>();

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
            activeChatUsers.set(socket.id, {
                cachedMsgs: new QuickLRU({ maxSize: 5 }),
            });
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
        const q = activeChatUsers.get(socket.id)?.cachedMsgs;
        q!.set(randomUUID(), message);
        activeChatUsers.set(socket.id, {
            ...activeChatUsers.get(socket.id)!,
            persona:
                message.match(
                    /\b(scientist|manager|mission architect)\b/i
                )?.[0] ?? undefined,
        });
        console.log(`Message from ${socket.id}: "${message}"`);
        console.log(process.cwd());

        // Send thinking status
        socket.emit("thinking", {
            status: "processing",
            message: "Searching NASA databases...",
        });

        // TODO: Replace with real LLM call
        // const response = (await getLLMResponse(sessionId, message, activeChatUsers.get(socket.id))).text;
        const response = { message: "s" };

        const ttsPath = await generateSpeech(
            sessionId,
            Date.now().toString(),
            response.message
        );

        socket.emit("response", {
            message: sessionPaper
                ? visAidInjector(sessionPaper, response.message)
                : response.message,
            timestamp: new Date().toISOString(),
            ttsPath: ttsPath,
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
        try {
            await rm(path.join(process.cwd(), `temp/${socket.id}`), {
                recursive: true,
                force: true,
            });
        } catch (error) {
            console.error(
                `Error cleaning up temp directory for ${socket.id}:`,
                error
            );
        }
        console.log(`Freed chatbot slot from ${socket.id}`);
    }
}
