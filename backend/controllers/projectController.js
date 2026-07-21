const asyncHandler = require('../utils/asyncHandler');
const MajorProject = require('../models/MajorProject');
const MiniProject = require('../models/MiniProject');

/* ----- Major projects ----- */

// @desc   List major projects
// @route  GET /api/projects/major
// @access Public
const getMajorProjects = asyncHandler(async (req, res) => {
    const projects = await MajorProject.find().sort({ order: 1, createdAt: 1 });
    res.json({ success: true, data: projects });
});

// @desc   Create major project
// @route  POST /api/projects/major
// @access Private
const createMajorProject = asyncHandler(async (req, res) => {
    const { title, status, completion, description, tags, link } = req.body;
    const project = await MajorProject.create({ title, status, completion, description, tags, link });
    res.status(201).json({ success: true, data: project });
});

// @desc   Update major project
// @route  PUT /api/projects/major/:id
// @access Private
const updateMajorProject = asyncHandler(async (req, res) => {
    const project = await MajorProject.findById(req.params.id);
    if (!project) {
        res.status(404);
        throw new Error('Project not found');
    }
    const { title, status, completion, description, tags, link } = req.body;
    project.title = title ?? project.title;
    project.status = status ?? project.status;
    project.completion = completion ?? project.completion;
    project.description = description ?? project.description;
    project.tags = tags ?? project.tags;
    project.link = link ?? project.link;
    await project.save();
    res.json({ success: true, data: project });
});

// @desc   Delete major project
// @route  DELETE /api/projects/major/:id
// @access Private
const deleteMajorProject = asyncHandler(async (req, res) => {
    const project = await MajorProject.findById(req.params.id);
    if (!project) {
        res.status(404);
        throw new Error('Project not found');
    }
    await project.deleteOne();
    res.json({ success: true, message: 'Project deleted' });
});

/* ----- Mini projects ----- */

// @desc   List mini projects
// @route  GET /api/projects/mini
// @access Public
const getMiniProjects = asyncHandler(async (req, res) => {
    const projects = await MiniProject.find().sort({ order: 1, createdAt: 1 });
    res.json({ success: true, data: projects });
});

// @desc   Create mini project
// @route  POST /api/projects/mini
// @access Private
const createMiniProject = asyncHandler(async (req, res) => {
    const { title, desc, completion, link } = req.body;
    const project = await MiniProject.create({ title, desc, completion, link });
    res.status(201).json({ success: true, data: project });
});

// @desc   Update mini project
// @route  PUT /api/projects/mini/:id
// @access Private
const updateMiniProject = asyncHandler(async (req, res) => {
    const project = await MiniProject.findById(req.params.id);
    if (!project) {
        res.status(404);
        throw new Error('Mini project not found');
    }
    const { title, desc, completion, link } = req.body;
    project.title = title ?? project.title;
    project.desc = desc ?? project.desc;
    project.completion = completion ?? project.completion;
    project.link = link ?? project.link;
    await project.save();
    res.json({ success: true, data: project });
});

// @desc   Delete mini project
// @route  DELETE /api/projects/mini/:id
// @access Private
const deleteMiniProject = asyncHandler(async (req, res) => {
    const project = await MiniProject.findById(req.params.id);
    if (!project) {
        res.status(404);
        throw new Error('Mini project not found');
    }
    await project.deleteOne();
    res.json({ success: true, message: 'Mini project deleted' });
});

module.exports = {
    getMajorProjects, createMajorProject, updateMajorProject, deleteMajorProject,
    getMiniProjects, createMiniProject, updateMiniProject, deleteMiniProject
};
