import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    firstName : {type: String},
    lastName : {type: String}
})

const User = mongoose.model('users', userSchema)

export { User }