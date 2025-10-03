import * as Moon from "mongoose";

const visualAidSchema = new Moon.Schema({
    type: String,
    anchor: String,
    path: String,
});
const viusalAidModel = Moon.model("visualAid", visualAidSchema);

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
