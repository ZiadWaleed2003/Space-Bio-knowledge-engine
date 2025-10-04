/* eslint-disable @typescript-eslint/require-await */
import { Router } from "express";
import path from "path";
import fs from "fs";

const router = Router();

router.get("/api/visuals/:paperName/:anchor", async (req, res) => {
    try {
        const { paperName, anchor } = req.params;
        const { type } = req.query; // expects ?type=figures or ?type=tables

        if (!type || !["figures", "tables"].includes(type as string)) {
            return res.status(400).json({
                error: "Invalid or missing 'type' query param. Must be 'figures' or 'tables'.",
            });
        }

        const filePath = path.join(
            __dirname,
            "..", // adjust depending on where papers/ lives
            "papers",
            paperName,
            type as string,
            anchor
        );

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: "File not found" });
        }

        res.sendFile(filePath);
    } catch (err) {
        console.error("Error serving visual:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/api/graph", async (req, res) => {});

router.get("/api/datasets", async (req, res) => {
    try {
        res.json({
            success: true,
            data: [
                { id: 1, name: "GeneLab", description: "Omics database" },
                {
                    id: 2,
                    name: "OSDR",
                    description: "Open Science Data Repository",
                },
            ],
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: (error as Error).message,
        });
    }
});

export default router;
