const asyncHandler = require('../utils/asyncHandler');
const Member = require('../models/Member');

// @desc   List members
// @route  GET /api/members
// @access Public
const getMembers = asyncHandler(async (req, res) => {
    const members = await Member.find().sort({ order: 1, createdAt: 1 });
    res.json({ success: true, data: members });
});

// @desc   Create member
// @route  POST /api/members
// @access Private
const createMember = asyncHandler(async (req, res) => {
    const { name, role, photo, intro, socials } = req.body;
    const member = await Member.create({ name, role, photo, intro, socials });
    res.status(201).json({ success: true, data: member });
});

// @desc   Update member
// @route  PUT /api/members/:id
// @access Private
const updateMember = asyncHandler(async (req, res) => {
    const member = await Member.findById(req.params.id);
    if (!member) {
        res.status(404);
        throw new Error('Member not found');
    }
    const { name, role, photo, intro, socials } = req.body;
    member.name = name ?? member.name;
    member.role = role ?? member.role;
    member.photo = photo ?? member.photo;
    member.intro = intro ?? member.intro;
    member.socials = socials ?? member.socials;
    await member.save();
    res.json({ success: true, data: member });
});

// @desc   Delete member
// @route  DELETE /api/members/:id
// @access Private
const deleteMember = asyncHandler(async (req, res) => {
    const member = await Member.findById(req.params.id);
    if (!member) {
        res.status(404);
        throw new Error('Member not found');
    }
    await member.deleteOne();
    res.json({ success: true, message: 'Member deleted' });
});

module.exports = { getMembers, createMember, updateMember, deleteMember };
