const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

// User Schema Created - It includes all the required fields.
const tweetSchema = new mongoose.Schema({
    content: { type: String, required: true },
    tweetedBy: { type: ObjectId, ref: 'UserModel' },
    likes: [{ type: ObjectId, ref: 'UserModel' }],
    retweetBy: [{ type: ObjectId, ref: 'UserModel' }],
    replies: [{ type: ObjectId, ref: 'TweetModel' }],
    image: { type: String },
} , {
    timestamps : true
});


//MongoDB Model Created
mongoose.model('TweetModel', tweetSchema);