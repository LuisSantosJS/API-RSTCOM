import mongoose, { SchemaOptions } from 'mongoose'


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    } as SchemaOptions,
    password: {
        type: String,
        required: true,
    }
})

const Users = mongoose.model('users', userSchema)

export { Users }