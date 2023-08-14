const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

// User Schema Created - It includes all the required fields.
const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    profileImg: { type: String },
    location: { type: String }, 
    dateOfBirth: { type: String }, 
    followers: [{ type: ObjectId, ref: 'UserModel' }], 
    following: [{ type: ObjectId, ref: 'UserModel' }], 
} , {
    timestamps : true
});

//MongoDB Model Created
mongoose.model('UserModel', userSchema);