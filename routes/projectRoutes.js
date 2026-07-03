const express = require('express');
const router = express.Router();
const { getProjects, createProject, updateProject, deleteProject } = require('../controllers/projectController');
const { auth, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getProjects);
router.post('/', auth, admin, upload.single('image'), createProject);
router.put('/:id', auth, admin, updateProject);
router.delete('/:id', auth, admin, deleteProject);

module.exports = router;