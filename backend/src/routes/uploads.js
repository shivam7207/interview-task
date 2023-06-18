const path = require('path');
const express = require('express')

const router = express.Router()
router.get('/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    const imagePath = path.join(__dirname, '../../', 'uploads', imageName);
    res.sendFile(imagePath);
});

module.exports = router