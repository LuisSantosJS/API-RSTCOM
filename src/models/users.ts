import mongoose from 'mongoose'


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true,
        
    }
})

const Users = mongoose.model('users', userSchema)

export { Users }