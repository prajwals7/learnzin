"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const prisma_1 = __importDefault(require("./utils/prisma"));
const auth_1 = __importDefault(require("./routes/auth"));
const subjects_1 = __importDefault(require("./routes/subjects"));
const videos_1 = __importDefault(require("./routes/videos"));
const progress_1 = __importDefault(require("./routes/progress"));
const cert_1 = __importDefault(require("./routes/cert"));
const ai_1 = __importDefault(require("./routes/ai"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use('/api/auth', auth_1.default);
app.use('/api/subjects', subjects_1.default);
app.use('/api/videos', videos_1.default);
app.use('/api/progress', progress_1.default);
app.use('/api/certs', cert_1.default);
app.use('/api/ai', ai_1.default);
// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Basic test route to check DB connection
app.get('/api/db-test', async (req, res) => {
    try {
        const userCount = await prisma_1.default.user.count();
        res.json({ status: 'connected', userCount });
    }
    catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
