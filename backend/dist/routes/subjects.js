"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../utils/prisma"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// List all published subjects
router.get('/', async (req, res) => {
    try {
        const subjects = await prisma_1.default.subject.findMany({
            where: { isPublished: true },
            include: {
                _count: {
                    select: { sections: true }
                }
            }
        });
        const subjectsWithMeta = await Promise.all(subjects.map(async (subj) => {
            const videoCount = await prisma_1.default.video.count({
                where: { section: { subjectId: subj.id } }
            });
            return { ...subj, videoCount };
        }));
        res.json(subjectsWithMeta);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch subjects', error: error.message });
    }
});
// Get subject details
router.get('/:id', async (req, res) => {
    try {
        const subject = await prisma_1.default.subject.findUnique({
            where: { id: req.params.id },
            include: {
                sections: {
                    orderBy: { orderIndex: 'asc' },
                    include: {
                        videos: {
                            orderBy: { orderIndex: 'asc' }
                        }
                    }
                }
            }
        });
        if (!subject)
            return res.status(404).json({ message: 'Subject not found' });
        res.json(subject);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch subject', error: error.message });
    }
});
// Get subject tree with progress and locking (Authenticated)
router.get('/:id/tree', auth_1.authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const subject = await prisma_1.default.subject.findUnique({
            where: { id: req.params.id },
            include: {
                sections: {
                    orderBy: { orderIndex: 'asc' },
                    include: {
                        videos: {
                            orderBy: { orderIndex: 'asc' },
                            include: {
                                videoProgress: {
                                    where: { userId }
                                }
                            }
                        }
                    }
                }
            }
        });
        if (!subject)
            return res.status(404).json({ message: 'Subject not found' });
        let allVideos = [];
        subject.sections.forEach((s) => {
            allVideos = [...allVideos, ...s.videos];
        });
        const tree = subject.sections.map((section) => ({
            ...section,
            videos: section.videos.map((video) => {
                const videoIdx = allVideos.findIndex(v => v.id === video.id);
                const isFirst = videoIdx === 0;
                const prevVideo = videoIdx > 0 ? allVideos[videoIdx - 1] : null;
                const isUnlocked = isFirst || (prevVideo && prevVideo.videoProgress[0]?.isCompleted);
                return {
                    ...video,
                    isUnlocked,
                    progress: video.videoProgress[0] || null
                };
            })
        }));
        res.json({ ...subject, sections: tree });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch tree', error: error.message });
    }
});
exports.default = router;
