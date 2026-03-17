"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../utils/prisma"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Get video details with next/prev pointers
router.get('/:id', auth_1.authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const video = await prisma_1.default.video.findUnique({
            where: { id: req.params.id },
            include: {
                section: {
                    include: {
                        subject: {
                            include: {
                                sections: {
                                    orderBy: { orderIndex: 'asc' },
                                    include: {
                                        videos: { orderBy: { orderIndex: 'asc' } }
                                    }
                                }
                            }
                        }
                    }
                },
                videoProgress: {
                    where: { userId }
                }
            }
        });
        if (!video)
            return res.status(404).json({ message: 'Video not found' });
        // Flatten all videos in subject to find neighbors
        let allVideos = [];
        video.section.subject.sections.forEach((s) => {
            allVideos = [...allVideos, ...s.videos];
        });
        const currentIdx = allVideos.findIndex(v => v.id === video.id);
        const prevVideoId = currentIdx > 0 ? allVideos[currentIdx - 1].id : null;
        const nextVideoId = currentIdx < allVideos.length - 1 ? allVideos[currentIdx + 1].id : null;
        res.json({
            ...video,
            prevVideoId,
            nextVideoId,
            progress: video.videoProgress[0] || null
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch video', error: error.message });
    }
});
exports.default = router;
