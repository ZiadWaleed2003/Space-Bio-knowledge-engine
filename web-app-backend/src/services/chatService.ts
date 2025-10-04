import { Socket } from "socket.io";
import axios from "axios";
import Queue from "yocto-queue";
import QuickLRU from "quick-lru";

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
    message: string,
    achtiveChatUser: { cache: QuickLRU<any, string>; persona?: string }
): Promise<{ text: string }> {
    if (achtiveChatUser.persona) {
        const response = axios.post(llmUrl!, {
            message: message,
            session_id: sessionId,
            persona: achtiveChatUser.persona,
        });
        return (await response).data.response;
    } else {
        const response = axios.post(llmUrl!, {
            message: message,
            session_id: sessionId,
            cached_messages: Array.from(achtiveChatUser.cache.values()),
        });
        return (await response).data.response;
    }
}
