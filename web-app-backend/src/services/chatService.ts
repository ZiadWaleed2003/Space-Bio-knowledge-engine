import { Socket } from "socket.io";
import axios from "axios";

const llmUrl = process.env.LLM_URL;

export const visAidInjector = (paper: string, msgText: string) => {
    const match = /\[\[\*([a-zA-Z]+)-([0-9]+)\]\]/.exec(msgText);
    if (!match) {
        return msgText;
    }

    const [, rawType, id] = match;

    let type = rawType.toLowerCase();
    let folder = "other";
    if (type.includes("fig")) {
        type = "fig";
        folder = "figures";
    } else if (type.includes("table")) {
        type = "table";
        folder = "tables";
    }

    const path = `${paper}/${folder}/${type}-${id}.png`;
    return path;
};

export async function getLLMResponse(
    sessionId: string,
    message: string
): Promise<{ text: string }> {
    const response = axios.post(llmUrl!, {
        message: message,
        session_id: sessionId,
    });
    return (await response).data.response;
}
