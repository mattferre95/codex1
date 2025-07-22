const express = require('express');
const router = express.Router();
const { getChecklists } = require('../controllers/checklistController');

router.get('/', getChecklists);

module.exports = router;
