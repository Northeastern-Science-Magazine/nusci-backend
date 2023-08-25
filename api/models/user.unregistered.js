import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const model = mongoose.model;

/**
 * UserSchema
 * 
 * Mongoose Schema defined for Unregistered Users.
 * Unregistered
 */
const UnregisteredUser = new Schema({
    username: {type: String, unique: true, required: true},
    role: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    information: {
        year: Number,
        major: String,
        bio: String,
        image: String
    }
}, {
    //Defines the collection objects of this schema get saved to.
    collection: 'unregistered'
});

// User model
const User = model("User", UnregisteredUser)

export default User;