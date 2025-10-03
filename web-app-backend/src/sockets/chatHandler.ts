import { getLLMResponse, visAidInjector } from "@src/services/chatService";
import { Server, Socket } from "socket.io";
interface ChatMessage {
    message: string;
    sessionId: string;
    sessionPaper: string;
}
/**
 * Setup all socket event handlers
 */
export const setupSocketHandlers = (io: Server): void => {
    const clientNamespace = io.of("/client");

    clientNamespace.on("connection", (socket: Socket) => {
        console.log(`Client connected: ${socket.id}`);

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
    });
};

async function handleChatMessage(
    socket: Socket,
    data: ChatMessage
): Promise<void> {
    try {
        const { message, sessionId, sessionPaper } = data;

        // Validate message
        if (!message || message.trim().length === 0) {
            socket.emit("chat:error", {
                error: "Message cannot be empty",
            });
            return;
        }

        console.log(`Message from ${socket.id}: "${message}"`);

        // Send thinking status
        socket.emit("thinking", {
            status: "processing",
            message: "Searching NASA databases...",
        });

        const response = (await getLLMResponse(sessionId, message)).text;
        socket.emit("response", {
            message: sessionPaper
                ? visAidInjector(sessionPaper, response)
                : response,
            timestamp: new Date().toISOString(),
        });
        console.log(`Response sent to ${socket.id}`);
    } catch (error) {
        console.error("Error handling chat message:", error);
        socket.emit("chat:error", {
            error: "Sorry, something went wrong. Please try again.",
        });
    }
}

function handleClearChat(socket: Socket): void {
    console.log(`Chat cleared for ${socket.id}`);

    // TODO: Clear any session data

    socket.emit("cleared", {
        message: "Chat history cleared",
        timestamp: new Date().toISOString(),
    });
}

function handleDisconnect(socket: Socket, reason: string): void {
    console.log(`Client disconnected: ${socket.id}, Reason: ${reason}`);

    // TODO: Clean up any session data here
}
