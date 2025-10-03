const { io } = require("socket.io-client");
const readline = require("readline");

// Configuration
const SERVER_URL = "http://localhost:3000";

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// ANSI color codes for terminal
const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    green: "\x1b[32m",
    blue: "\x1b[34m",
    yellow: "\x1b[33m",
    red: "\x1b[31m",
    cyan: "\x1b[36m",
    magenta: "\x1b[35m",
};

console.log(
    `${colors.bright}${colors.cyan}╔════════════════════════════════════════╗${colors.reset}`
);
console.log(
    `${colors.bright}${colors.cyan}║   NASA Space Biology Chat Test Client ║${colors.reset}`
);
console.log(
    `${colors.bright}${colors.cyan}╚════════════════════════════════════════╝${colors.reset}\n`
);

// Connect to server
const socket = io(SERVER_URL, {
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
});

// Connection events
socket.on("connect", () => {
    console.log(
        `${colors.green}✅ Connected to server (ID: ${socket.id})${colors.reset}\n`
    );
    promptUser();
});

socket.on("disconnect", (reason) => {
    console.log(`${colors.red}❌ Disconnected: ${reason}${colors.reset}\n`);
});

socket.on("connect_error", (error) => {
    console.error(
        `${colors.red}❌ Connection error: ${error.message}${colors.reset}`
    );
    console.log(
        `${colors.yellow}Make sure the server is running on ${SERVER_URL}${colors.reset}\n`
    );
});

// Chat events
socket.on("chat:welcome", (data) => {
    console.log(`${colors.magenta}🤖 Bot: ${data.message}${colors.reset}\n`);
});

socket.on("chat:thinking", (data) => {
    console.log(`${colors.yellow}⏳ ${data.message}${colors.reset}`);
});

socket.on("chat:response", (data) => {
    console.log(`\n${colors.magenta}🤖 Bot:${colors.reset} ${data.message}\n`);

    if (data.sources && data.sources.length > 0) {
        console.log(`${colors.cyan}📚 Sources:${colors.reset}`);
        data.sources.forEach((source, index) => {
            console.log(
                `   ${index + 1}. ${source.title}\n      ${colors.blue}${
                    source.url
                }${colors.reset}`
            );
        });
        console.log("");
    }

    promptUser();
});

socket.on("chat:error", (data) => {
    console.log(`${colors.red}❌ Error: ${data.error}${colors.reset}\n`);
    promptUser();
});

socket.on("chat:cleared", (data) => {
    console.log(`${colors.green}✓ ${data.message}${colors.reset}\n`);
    promptUser();
});

// User input handling
function promptUser() {
    rl.question(
        `${colors.bright}${colors.green}You: ${colors.reset}`,
        (input) => {
            const message = input.trim();

            if (!message) {
                promptUser();
                return;
            }

            // Handle special commands
            if (message.toLowerCase() === "/exit") {
                console.log(`${colors.yellow}👋 Goodbye!${colors.reset}`);
                socket.disconnect();
                rl.close();
                process.exit(0);
            }

            if (message.toLowerCase() === "/clear") {
                socket.emit("chat:clear");
                return;
            }

            if (message.toLowerCase() === "/help") {
                showHelp();
                promptUser();
                return;
            }

            // Send message to server
            socket.emit("chat:message", {
                message: message,
                sessionId: socket.id,
            });
        }
    );
}

function showHelp() {
    console.log(`\n${colors.cyan}Available commands:${colors.reset}`);
    console.log(
        `  ${colors.bright}/help${colors.reset}  - Show this help message`
    );
    console.log(`  ${colors.bright}/clear${colors.reset} - Clear chat history`);
    console.log(`  ${colors.bright}/exit${colors.reset}  - Exit the client\n`);
}

// Handle Ctrl+C
process.on("SIGINT", () => {
    console.log(`\n${colors.yellow}👋 Goodbye!${colors.reset}`);
    socket.disconnect();
    rl.close();
    process.exit(0);
});
