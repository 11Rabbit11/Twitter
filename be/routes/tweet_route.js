const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const TweetModel = mongoose.model('TweetModel');
const protectedRoute = require('../middleware/protectedResource');
const path = require('path');

// Configuring multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images/') // Setting the destination directory for uploaded files
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        const fileName = `tweet-${uniqueSuffix}${fileExtension}`;
        cb(null, fileName) // Setting the filename for the uploaded file
    }
});

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
});


//Create Tweet
router.post('/', upload.single('file'), protectedRoute, async (req, res) => {
    try {
        const { content } = req.body;
        if (!content) {
            return res.status(400).json({ error: 'Please fill all the required fields' });
        }
        const tweetObj = new TweetModel({
            content: content,
            tweetedBy: req.user._id,
            image: req.file?.path
        })
        //Save to DB
        await tweetObj.save();
        try {
            const tweet = await TweetModel.findById(tweetObj._id).populate('tweetedBy', '_id fullName')
            res.status(201).json({ post: 'Tweet created successfully', tweet });
        }
        catch (err) {
            console.log(err.message);
        };
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ error: 'Internal server error' });
    }

});

//Get A Single Tweet
router.get('/:id', async (req, res) => {
    try {
        const tweet = await TweetModel.findById(req.params.id)
            .populate('tweetedBy', '-password')
            .populate({
                path: 'replies',
                populate: {
                    path: 'tweetedBy',
                    select: '-password'
                }
            })
            .populate('likes', '-password')
            .populate('retweetBy', '-password');
        //Check if tweet is found or not
        if (!tweet) {
            return res.status(404).json({ error: 'Tweet not found' });
        }
        res.status(200).json( tweet );
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//Get All Tweets
router.get('/', async (req, res) => {
    try {
        const tweets = await TweetModel.find()
            .sort({ createdAt: -1 }) // Sort by createdAt field in descending order
            .populate('tweetedBy', '-password')
            .populate('likes', '-password')
            .populate('retweetBy', '-password')
            .populate({
                path: 'replies',
                populate: {
                    path: 'tweetedBy',
                    select: '-password'
                }
            });
        if (!tweets) {
            return res.status(404).json({ error: 'No tweets found' });
        }
        res.status(200).json({ tweets: tweets });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});


//Delete Tweet
router.delete('/:id', protectedRoute, async (req, res) => {
    try {
        const tweet = await TweetModel.findOne({ _id: req.params.id }).populate('tweetedBy', '_id fullname').exec();
        if (!tweet) {
            return res.status(404).json({ error: 'Tweet Not Found' });
        }
        //Check if User is the Author of the Tweet
        if (tweet.tweetedBy._id.toString() === req.user._id.toString()) {
            await tweet.deleteOne().then((data) => {
                res.status(200).json({ result: 'Tweet Deleted Successfully', data });
            }).catch(err => {
                console.log(err.message);
            });
        } else {
            res.status(403).json({ error: 'Unauthorized: You are not the author of this tweet' });
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//Retweet
router.post('/:id/retweet', protectedRoute, async (req, res) => {
    try {
        const tweetId = req.params.id;
        const userId = req.user._id;
        const tweet = await TweetModel.findById(tweetId);
        
        // Check if the user has already retweeted the post
        if (tweet.retweetBy.includes(userId)) {
            return res.status(400).json({ error: 'You have already retweeted this tweet' });
        }
        await TweetModel.findByIdAndUpdate(tweetId, {
            $push: { retweetBy: req.user._id }
        }, {
            new: true //Returns the Updated Record
        }).populate('tweetedBy', '_id fullName')
            .populate('retweetBy', '_id fullName').exec()
            .then(data => {
                res.status(200).json({ result: 'Tweet Retweeted Successfully', data });
            }).catch(err => {
                return res.status(400).json({ error: err.message });
            });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//Likes
router.post('/:id/like', protectedRoute, async (req, res) => {
    try {
        const tweetId = req.params.id;
        const userId = req.user._id;
        const tweet = await TweetModel.findById(tweetId);
        // Check if the user has already liked the post
        if (tweet.likes.includes(userId)) {
            return res.status(400).json({ error: 'You have already liked this post' });
        }
        await TweetModel.findByIdAndUpdate(tweetId, {
            $push: { likes: req.user._id }
        }, {
            new: true //Returns the Updated Record
        }).populate('tweetedBy', '_id fullName').exec()
            .then(data => {
                res.status(200).json({ result: 'Tweet Liked Successfully', data });
            }).catch(err => {
                return res.status(400).json({ error: err.message });
            });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});
//Unlike
router.post('/:id/dislike', protectedRoute, async (req, res) => {
    try {
        const tweetId = req.params.id;
        const userId = req.user._id;
        const tweet = await TweetModel.findById(tweetId);
        // Check if the user has already liked the post
        if (!tweet.likes.includes(userId)) {
            return res.status(400).json({ error: 'You have not liked this post yet' });
        }
        // Update the likes array only if the user has previously liked the post
        await TweetModel.findByIdAndUpdate(tweetId, {
            $pull: { likes: req.user._id }
        }, {
            new: true //Returns the Updated Record
        }).populate('tweetedBy', '_id fullName').exec()
            .then(data => {
                res.status(200).json({ result: 'Tweet UnLiked Successfully', data });
            })
            .catch(err => {
                return res.status(400).json({ error: err.message });
            });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});

//Reply
router.post('/:id/reply', protectedRoute, async (req, res) => {
    try {
        const { content } = req.body;
        if (!content) {
            return res.status(400).json({ error: 'Please fill all the required fields' });
        }
        const reply = new TweetModel({
            content: content,
            tweetedBy: req.user._id,
        });

        //Save Reply as new tweet in DB
        try { await reply.save(); }
        catch (err) { console.log(err.message); };

        //Updated Tweet
        await TweetModel.findByIdAndUpdate(req.params.id, {
            $push: { replies: reply }
        }, {
            new: true //Returns the Updated Record
        }).populate({ path: 'replies', select: '_id content tweetedBy', populate: { path: 'tweetedBy', select: '_id fullName' } }) //Populate Reply Owner
            .populate('tweetedBy', '_id fullName').exec()  //Populate Tweet Owner
            .then(data => {
                res.status(200).json({ result: 'Replied Successfully', data });
            })
            .catch(err => {
                return res.status(400).json({ error: err.message });
            });
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ error: err.message });
    }
});


module.exports = router;