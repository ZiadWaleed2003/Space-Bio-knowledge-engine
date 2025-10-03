import axios from "axios";
import fs from "fs";
// import { OpenAI } from "openai";
import { Groq } from "groq-sdk";
import * as dotenv from "dotenv";
import { env } from "process";
import path from "path";

dotenv.config();

const key = env.GROQ_API_KEY;
const client = new Groq({
    apiKey: key,
});

export async function generateSpeech(
    sessionId: string,
    timestamp: string,
    text: string
) {
    try {
        const dir = path.join(process.cwd(), `temp/${sessionId}/`);
        const speechFile = path.join(dir + `${timestamp}.mp3`);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        const mp3 = await client.audio.speech.create({
            model: "playai-tts",
            voice: "Aaliyah-PlayAI",
            response_format: "mp3",
            input: text,
        });
        const buffer = Buffer.from(await mp3.arrayBuffer());
        await fs.promises.writeFile(speechFile, buffer).then(() => {
            return `${sessionId}/${timestamp}.mp3`;
        });
        console.log("Speech saved as speech.mp3");
    } catch (error) {
        console.error(
            "Error generating speech:",
            error.response?.data,
            error.message
        );
    }
}
