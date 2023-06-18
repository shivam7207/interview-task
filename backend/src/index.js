const express = require('express');
const app = express();
const dotenv = require('dotenv');
const con = require('../config/db');
const registerHandler = require('./routes/register');
const singinHandler = require('./routes/signin');
const uploadServer = require('./routes/uploads')
const fs = require('fs');
const multer = require('multer');
const cors = require('cors')
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');

// load the .env variables in process.env
dotenv.config();

app.use(express.json());

app.use(cors({ origin: 'http://localhost:3000' }));

app.get('/user/me', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ msg: 'Unauthorized access' });
            return;
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        console.log(userId)
        // Fetch user details from database using userId
        const db = con.db('test');
        const collection = db.collection('user');
        const user = await collection.findOne({ _id: new ObjectId(userId) });
        console.log(user)
        if (!user) {
            res.status(404).json({ msg: 'User not found' });
            return;
        }
        res.json(user);
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: 'Internal server error' });
    }
});


app.use('/register', registerHandler);
app.use('/signin', singinHandler);
app.use('/uploads/', uploadServer)

app.use((req, res) => {
    res.status(404).json({ msg: "route doesn't exists" });
});

app.listen(3001, 'localhost', () => {
    console.log('Server running at http://localhost:3001/');
});
