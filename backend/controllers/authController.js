const bcrypt = require('bcryptjs');
const asyncHandler = require('../utils/asyncHandler');
const generateToken = require('../utils/generateToken');
const Admin = require('../models/Admin');

// @desc   Login admin, returns a JWT
// @route  POST /api/auth/login
// @access Public
const login = asyncHandler(async (req, res) => {
    const { password } = req.body;

    if (!password) {
        res.status(400);
        throw new Error('Password is required');
    }

    const admin = await Admin.findOne({ username: 'admin' });
    if (!admin) {
        res.status(500);
        throw new Error('Admin account not configured. Run the seed script.');
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
        res.status(401);
        throw new Error('Incorrect password');
    }

    const token = generateToken({ id: admin._id });
    res.json({ success: true, token });
});

// @desc   Change admin password
// @route  PUT /api/auth/password
// @access Private
const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        res.status(400);
        throw new Error('Current and new password are required');
    }
    if (newPassword.length < 4) {
        res.status(400);
        throw new Error('New password must be at least 4 characters');
    }

    const admin = await Admin.findById(req.admin._id);
    const isMatch = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!isMatch) {
        res.status(401);
        throw new Error('Current password is incorrect');
    }

    const salt = await bcrypt.genSalt(10);
    admin.passwordHash = await bcrypt.hash(newPassword, salt);
    await admin.save();

    res.json({ success: true, message: 'Password updated successfully' });
});

module.exports = { login, changePassword };
