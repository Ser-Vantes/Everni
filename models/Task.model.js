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
    files:[
        {
            type: String,
            default: ''
        }
    ],
    answers:[
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
