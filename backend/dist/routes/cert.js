"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../utils/prisma"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Get certificate for a subject
router.get('/:subjectId', auth_1.authenticate, async (req, res) => {
    try {
        const { subjectId } = req.params;
        const userId = req.user.id;
        // Check if certificate already exists
        const existingCert = await prisma_1.default.certificate.findUnique({
            where: {
                userId_subjectId: { userId, subjectId }
            },
            include: {
                subject: true,
                user: true
            }
        });
        if (existingCert) {
            return res.json(existingCert);
        }
        // Check if course is 100% complete
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
        if (completedVideos < totalVideos || totalVideos === 0) {
            return res.status(400).json({ message: 'Course not yet completed' });
        }
        // Generate new certificate
        const certNo = `ZONE-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`;
        const newCert = await prisma_1.default.certificate.create({
            data: {
                userId,
                subjectId,
                certificateNo: certNo
            },
            include: {
                subject: true,
                user: true
            }
        });
        res.json(newCert);
    }
    catch (err) {
        console.error('Failed to generate certificate', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.default = router;
