
import { Schema, model } from '../db/connection.js';

// User Schema
const TodoSchema = new Schema({
    username: {type: String, required: true},
    reminder: {type: String, required: true},
    completed: {type: Boolean, required: true, default: false}
})

// User model
const Todo = model("Todo", TodoSchema)

export default Todo;