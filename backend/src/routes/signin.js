const express = require('express');
const client = require('../../config/db');
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');

const router = express.Router();
router.post('/', async (req, res) => {
    try {
        const userData = req.body;
        const requiredFields = ['password'];
        const missingFields = requiredFields.filter(field => !userData.hasOwnProperty(field));
        if (!userData.hasOwnProperty('username') && !userData.hasOwnProperty('email')) {
            missingFields.push('username or email');
        }
        if (missingFields.length > 0) {
            res.status(400).json({ msg: `${missingFields.join(', ')} are missing` });
            return;
        }
        let { username, email, password } = await userData;

        await client.connect();
        let db = await client.db('test');
        let collection = await db.collection('user');

        console.log(email);
        const result = await collection.findOne({
            $or: [{ email: email }, { username: username }]
        });

        if (!result) {
            res.json({ msg: 'there is no user registered with this email or username' });
            return;
        }

        const checkPassword = await bcrypt.compare(password, result.password);
        console.log(checkPassword);

        if (checkPassword) {
            const jwtToken = await jsonwebtoken.sign({ id: result._id, email }, process.env.JWT_SECRET);
            res.status(200).setHeader('token', jwtToken).json({ jwt: jwtToken });
        } else {
            res.status(401).json({ msg: 'Unauthorized access check the credentials' });
            return;
        }
    } catch (err) {
        res.json({ msg: 'Internal server error' });
        console.log(err);
    }
});

module.exports = router;
