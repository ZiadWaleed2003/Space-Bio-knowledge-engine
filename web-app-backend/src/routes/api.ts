/* eslint-disable @typescript-eslint/require-await */
import { Router } from "express";

const router = Router();

router.get("/datasets", async (req, res) => {
    try {
        // TODO: Implement dataset listing from NASA APIs
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
