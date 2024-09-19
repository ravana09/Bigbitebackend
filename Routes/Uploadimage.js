const express = require('express');
const router = express.Router();
const { create, getAll, updateById, deleteById, getById } = require('../Controllers/Upload');

// Create a new business profile with image and video
router.post('/Uploadpost', create);
router.get('/Uploadgetall', getAll);
router.post('/Uploadupdate/:id', updateById);
router.post('/Uploaddelete/:id', deleteById);
router.post("/uploadgetbyid/:id",getById);
module.exports = router;
