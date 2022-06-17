const mongoose = require('mongoose')
const Schema = mongoose.Schema

const taskSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    taskText: {
        type: String,
        required: true
    },
    deadline: {
        type: Date,
        default: Date.now
    },
    taskFiles:[
        {
            type: String,
            default: ''
        }
    ],
    disciplines: {
        ref: 'disciplines',
        type: Schema.Types.ObjectId
    },
    chapters: {
        ref: 'chapters',
        type: Schema.Types.ObjectId
    },
})

module.exports = mongoose.model('tasks', taskSchema)
