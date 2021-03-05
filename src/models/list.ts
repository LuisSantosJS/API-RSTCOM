import mongoose, { SchemaOptions } from 'mongoose'


const listSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    } as SchemaOptions,
    description: {
        type: String,
        required: false
    },
    userID: {
        type: String,
        required: true
    },
    isComplete: {
        type: Boolean,
        required: true,
    },
})

const List = mongoose.model('list', listSchema)

export { List }