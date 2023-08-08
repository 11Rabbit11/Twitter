const jwt = require("jsonwebtoken"); // Importing the 'jsonwebtoken' library
const { JWT_SECRET } = require('../config'); // Importing the 'JWT_SECRET' from the config file

const mongoose = require("mongoose");
const UserModel = mongoose.model("UserModel");

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    //Bearer asdasddgdf
    
    // Checking if 'authorization' header is missing
    if (!authorization) { 
    return res.status(401).json({ error: "User Not Logged In!" });
    }
    const token = authorization.replace("Bearer ", "");
    //Verifying the token using 'jwt.verify' method
    jwt.verify(token, JWT_SECRET, (err, payload) => {
        //Handling error
        if (err) {
            return res.status(401).json({ error: "User Not Logged In!" });
        }
        //Extracting id from payload    
        const { _id } = payload;
        //Finding User with the given '_id' 
        UserModel.findById(_id).then(user => {
            //Handling error
            if (!user) {
                return res.status(404).json({ error: "User Not Found!" });
            }
            req.user = user; // Assigning the found user to the 'req.user' property
            next(); //Goes to the next middleware or goes to the REST API
        });
    })
}

