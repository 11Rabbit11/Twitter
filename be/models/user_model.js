const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

// User Schema Created - It includes all the required fields.
const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    profileImg: { type: String, default: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cHJvZmlsZSUyMHBpY3R1cmV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=400&q=60' },
    location: { type: String }, 
    dateOfBirth: { type: String }, 
    followers: [{ type: ObjectId, ref: 'UserModel' }], 
    following: [{ type: ObjectId, ref: 'UserModel' }], 
} , {
    timestamps : true
});

//MongoDB Model Created
mongoose.model('UserModel', userSchema);