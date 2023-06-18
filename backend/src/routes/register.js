const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const client = require('../../config/db');
const multer = require('multer');

// Set up Multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post('/', upload.fields([{ name: 'profile_image', maxCount: 1 }, { name: 'documents' }]), async (req, res) => {
    console.log(process.env.DATABASE_NAME, process.env.MONGO_CONNECTION_URI);
    try {
        // Access text data in req.body
        const userData = req.body;

        // Extract user data
        const { password, ...otherDetails } = userData;

        // Encrypt password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Add profile photo path
        const profileImagePath = req.files['profile_image'] ? req.files['profile_image'][0].path : null;

        // Add documents paths
        const documentsPaths = req.files['documents'] ? req.files['documents'].map(file => file.path) : [];

        await client.connect();
        const db = await client.db(process.env.DATABASE_NAME);
        const collection = await db.collection('user');
        const result = await collection.insertOne({
            ...otherDetails,
            password: hashedPassword,
            profile_image: profileImagePath,
            documents: documentsPaths
        });

        console.log(`Registered user with _id: ${result.insertedId}`);

        res.status(200).json({ message: `Registered user with _id: ${result.insertedId}` });
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

router.get('/', (req, res) => {
    res.send('get');
});

module.exports = router;
