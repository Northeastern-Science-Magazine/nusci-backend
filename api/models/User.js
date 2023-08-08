import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const model = mongoose.model;

// User Schema
const UserSchema = new Schema({
    username: {type: String, unique: true, required: true},
    role: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    year: Number,
    major: String,
    bio: String,
    image: String
}, {
    collection: 'unregistered'
});

// User model
const User = model("User", UserSchema)

export default User;