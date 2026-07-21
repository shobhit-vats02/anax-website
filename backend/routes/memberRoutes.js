const express = require('express');
const { getMembers, createMember, updateMember, deleteMember } = require('../controllers/memberController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .get(getMembers)
    .post(protect, createMember);

router.route('/:id')
    .put(protect, updateMember)
    .delete(protect, deleteMember);

module.exports = router;
