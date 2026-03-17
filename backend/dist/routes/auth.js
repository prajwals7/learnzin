"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../utils/prisma"));
const router = (0, express_1.Router)();
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY_DAYS = 30;
// Register
router.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const existingUser = await prisma_1.default.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        const user = await prisma_1.default.user.create({
            data: {
                email,
                passwordHash,
                name,
                avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
            }
        });
        res.status(201).json({ message: 'User registered successfully', userId: user.id });
    }
    catch (error) {
        res.status(500).json({ message: 'Registration failed', error: error.message });
    }
});
// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma_1.default.user.findUnique({ where: { email } });
        if (!user || !(await bcryptjs_1.default.compare(password, user.passwordHash))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const accessToken = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
        const refreshTokenString = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: `${REFRESH_TOKEN_EXPIRY_DAYS}d` });
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);
        await prisma_1.default.refreshToken.create({
            data: {
                userId: user.id,
                tokenHash: refreshTokenString, // In prod, hash this
                expiresAt
            }
        });
        res.cookie('refreshToken', refreshTokenString, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000
        });
        res.json({
            accessToken,
            user: { id: user.id, email: user.email, name: user.name, avatarUrl: user.avatarUrl }
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
});
// Logout
router.post('/logout', async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
        await prisma_1.default.refreshToken.updateMany({
            where: { tokenHash: refreshToken },
            data: { revokedAt: new Date() }
        });
    }
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out' });
});
exports.default = router;
