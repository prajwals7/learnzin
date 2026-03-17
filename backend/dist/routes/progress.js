"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../utils/prisma"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Get progress for a subject
router.get('/subject/:subjectId', auth_1.authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const { subjectId } = req.params;
        const totalVideos = await prisma_1.default.video.count({
            where: { section: { subjectId } }
        });
        const completedVideos = await prisma_1.default.videoProgress.count({
            where: {
                userId,
                isCompleted: true,
                video: { section: { subjectId } }
            }
        });
        const percentage = totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;
        res.json({ totalVideos, completedVideos, percentage });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch progress', error: error.message });
    }
});
// Update video progress (upsert)
router.post('/video/:videoId', auth_1.authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const { videoId } = req.params;
        const { lastPositionSeconds, isCompleted } = req.body;
        const progress = await prisma_1.default.videoProgress.upsert({
            where: {
                userId_videoId: { userId, videoId }
            },
            update: {
                lastPositionSeconds,
                isCompleted,
                completedAt: isCompleted ? new Date() : undefined
            },
            create: {
                userId,
                videoId,
                lastPositionSeconds,
                isCompleted,
                completedAt: isCompleted ? new Date() : null
            }
        });
        res.json(progress);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to update progress', error: error.message });
    }
});
exports.default = router;
