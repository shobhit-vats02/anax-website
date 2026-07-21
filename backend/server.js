require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const memberRoutes = require('./routes/memberRoutes');
const achievementRoutes = require('./routes/achievementRoutes');
const projectRoutes = require('./routes/projectRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const dataRoutes = require('./routes/dataRoutes');

const app = express();
console.log("MONGODB_URI:", process.env.MONGODB_URI);
console.log("Type:", typeof process.env.MONGODB_URI);

connectDB();

app.use(helmet());
app.use(
    cors({
        origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim()) : '*'
    })
);
app.use(express.json({ limit: '2mb' }));

app.get('/', (req, res) => res.json({ success: true, message: 'ANAX CODE API is running' }));
app.get('/api/health', (req, res) => res.json({ success: true, status: 'ok', timestamp: new Date().toISOString() }));

app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/data', dataRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
