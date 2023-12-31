const express = require('express'); //Import necessary libraries
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const UserModel = mongoose.model('UserModel'); // Importing the UserModel from the 'UserModel' file
const TweetModel = mongoose.model('TweetModel'); // Importing the UserModel from the 'UserModel' file
const protectedRoute = require('../middleware/protectedResource'); //Import Middleware
const path = require('path');

//GET Single User--------------------------------------------
router.get('/:id', async (req, res) => {
    await UserModel.findById(req.params.id)
        .populate('following', '-password') // Populating
        .populate('followers', '-password')
        .then(user => {
            // Destructure the 'password' field from the user object and assign the rest of the fields to 'userData'
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            const { password, ...userData } = user.toObject();
            res.status(200).json({ user: userData });
        }).catch(err => {
            console.log(err.message);
        })
});

//GET User Tweets-----------------------------------------
router.get('/:id/tweets', async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Fetch tweets and populate relevant fields with user details, excluding password field
        const tweets = await TweetModel.find({ tweetedBy: userId })
            .populate('tweetedBy', '-password')
            .populate('likes', '-password')
            .populate('retweetBy', '-password')
            .populate('replies', '-password')
            .sort({ createdAt: -1 });

        res.status(200).json(tweets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Edit User Detail--------------------------------------------
router.put('/:id', protectedRoute, async (req, res) => {
    try {
        // Check if the logged-in user is the same as the user whose profile is being requested
        if (req.user.id !== req.params.id) {
            // If not, return a 403 error response
            return res.status(403).json({ error: 'Forbidden: You are not allowed to view other user\'s profile' });
        }
        // Find the user by ID using UserModel.findById
        const user = await UserModel.findById(req.params.id);

        // If the user is not found, return a 404 error response
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Destructure the fields to be updated from the request body
        const { name, location, dob } = req.body;

        // Update the user object with the provided fields if they exist in the request body
        if (name !== null && name !== undefined && name !== "") { user.fullName = name; }
        if (location !== null && location !== undefined && location !== "") { user.location = location; }
        if (dob !== null && dob !== undefined && dob !== "") { user.dateOfBirth = dob; }

        // Save the updated user object to the database
        await user.save();

        // Set the 'password' field to undefined to prevent it from being sent in the response
        user.password = undefined;
        
        // Return the updated user object in the response
        res.status(200).json({ result: 'User Updated Successfully', user });
    } catch (err) {
        // If an error occurs during the update process, return a 500 error response with the error message
        res.status(500).json({ error: err.message });
    }
});

//Edit Profile Pic--------------------------------------------

// Configuring multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images/') // Setting the destination directory for uploaded files
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        const fileName = `profilepic-${uniqueSuffix}${fileExtension}`;
        cb(null, fileName) // Setting the filename for the uploaded file
    }
})

// Configuring multer middleware with storage, file size limit, and file type filter
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 1 // Setting the maximum file size allowed (1MB)
    },
    fileFilter: function (req, file, cb) {
        if (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(null, false);
            return res.status(400).json({ error: 'Please upload a valid image file. File types allowed are .jpg, .jpeg, .png' });
        }
    }
})

// POST request for uploading a profile picture
router.post('/:id/uploadProfilePic', upload.single('image'), async (req, res) => {
    try {
        const userId = req.params.id;
        const updatedFields = {};
        
        // Check if a file was uploaded
        if (req.file) {
            updatedFields.profileImg = req.file.path;
        }

        // Update the user's profile picture and retrieve the updated user
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { $set: updatedFields },
            { new: true }
        );
        res.status(200).json({ result: 'Profile Pic Updated Successfully' }) //Return the updated user    
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//-------------------------------------------------------------------

//Follow--------------------------------------------
router.put('/:id/follow', protectedRoute, async (req, res) => {
    try {
        // Function to check if the current user is the same as the user-to-follow
        if (req.user._id == req.params.id) {
            return res.status(400).json({ error: "You cannot follow yourself" });
        }
        // You are already following this user
        if (req.user.following.includes(req.params.id)) {
            return res.status(400).json({ error: "You are already following this user" });
        }

        // Find the logged-in user and update their following array
        const loggedInUser = await UserModel.findByIdAndUpdate(
            req.user._id,
            { $push: { following: req.params.id } },
            { new: true }
        ).exec();

        // Find the user-to-follow and update their followers array
        const userToUnfollow = await UserModel.findByIdAndUpdate(
            req.params.id,
            { $push: { followers: req.user._id } },
            { new: true }
        ).exec();

        res.status(200).json({ result: 'Followed Succesfully!', loggedInUser, userToUnfollow });
    } catch (err) {
        res.status(400).json({ result: 'Failed to Follow. Some Error Occured. ', error: err.message });
    }
});

//Unfollow--------------------------------------------
router.put('/:id/unfollow', protectedRoute, async (req, res) => {
    try {
        // You are already not following this user
        if (!req.user.following.includes(req.params.id)) {
            return res.status(400).json({ error: "You are not following this user" });
        }
        // Find the logged-in user and update their following array
        const loggedInUser = await UserModel.findByIdAndUpdate(
            req.user._id,
            { $pull: { following: req.params.id } },
            { new: true }
        ).exec();

        // Find the user-to-follow and update their followers array
        const userToFollow = await UserModel.findByIdAndUpdate(
            req.params.id,
            { $pull: { followers: req.user._id } },
            { new: true }
        ).exec();

        res.status(200).json({ result: 'Unfollowed Successfully!', loggedInUser, userToFollow });
    } catch (err) {
        res.status(400).json({ result: 'Failed to Unfollow. Some Error Occured. ', error: err.message });
    }
});


module.exports = router;    