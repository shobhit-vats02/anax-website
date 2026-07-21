const express = require('express');
const {
    getMajorProjects, createMajorProject, updateMajorProject, deleteMajorProject,
    getMiniProjects, createMiniProject, updateMiniProject, deleteMiniProject
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/major')
    .get(getMajorProjects)
    .post(protect, createMajorProject);

router.route('/major/:id')
    .put(protect, updateMajorProject)
    .delete(protect, deleteMajorProject);

router.route('/mini')
    .get(getMiniProjects)
    .post(protect, createMiniProject);

router.route('/mini/:id')
    .put(protect, updateMiniProject)
    .delete(protect, deleteMiniProject);

module.exports = router;
