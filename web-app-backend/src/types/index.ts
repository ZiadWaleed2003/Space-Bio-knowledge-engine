// src/types/index.ts
export interface Message {
    id: string;
    content: string;
    role: "scientist" | "manager" | "architect";
    timestamp: Date;
    sources?: Source[];
}

export interface Source {
    title: string;
    url: string;
    snippet?: string;
}

export interface VisualAid {
    type: "fig" | "table";
    anchor: string;
    path: string;
}

export interface ChatSession {
    id: string;
    messages: Message[];
    createdAt: Date;
}
