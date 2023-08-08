const express = require('express'); //Import necessary libraries
const router = express.Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
const UserModel = mongoose.model('UserModel'); // Importing the UserModel from the 'UserModel' file
const { JWT_SECRET } = require('../config'); //Import the JWT_SECRET from the config file

//SignUp(Register)--------------------------------------------
router.post('/register', (req, res) => {
    const { fullName, email, username, password } = req.body;

    //Checking if any fields are missing
    if (!fullName || !email || !username || !password) {
        return res.status(400).json({ error: 'Please fill all the required fields' });
    }
    // Check if email is unique
    UserModel.findOne({ email: email }).then(userInDB => {
        if (userInDB) {
            return res.status(500).json({ error: 'User with this email already exists' });
        }
        // Check if username is unique
        UserModel.findOne({ username: username }).then(userInDB => {
            if (userInDB) {
                return res.status(500).json({ error: 'Username already exists' });
            }
        }).catch(err => {
            console.log(err);
        })

        //Hash the password
        bcryptjs.hash(password, 16).then(hashedPassword => {
            //Create a new user object with given details
            const user = new UserModel({ fullName, email, username, password: hashedPassword });
            //Save user in DB
            user.save().then(() => {
                res.status(201).json({ message: 'User Signed up Successfully' });
            }).catch(err => {
                console.log(err); // Log any errors that occur during saving
            })
        }).catch(err => {
            console.log(err); // Log any errors that occur during password hashing
        })
    }).catch(err => {
        console.log(err);// Log any errors that occur during user search
    });
});

//Login--------------------------------------------
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    //Checking if any fields are missing
    if (!username || !password) {
        return res.status(400).json({ error: 'Please fill all the required fields' });
    }
    // Find a user in the database with the provided username
    UserModel.findOne({ username: username }).then(userInDB => {
        if (!userInDB) {
            return res.status(401).json({ error: 'User with this username does not exist. Check the username,' });
        }
        
        // Compare the provided password with the stored password using bcryptjs
        bcryptjs.compare(password, userInDB.password).then(isMatched => {
            if (isMatched) {

                // Generate a JWT token with the user's ID
                const jwtToken = jwt.sign({ _id: userInDB._id }, JWT_SECRET);
                // Create a user info object with selected fields from the user's data
                const userInfo = { "_id": userInDB._id, "fullName": userInDB.fullName, "username": userInDB.username, "email": userInDB.email };
                
                res.status(200).json({ result: { token: jwtToken, user: userInfo } });
            } else {
                return res.status(401).json({ error: 'Invalid Credentials' });
            }
        }).catch(err => {
            console.log(err);
        })
    }).catch(err => {
        console.log(err);
    });
});

module.exports = router;    