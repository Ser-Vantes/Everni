const mongoose = require('mongoose')
const Schema = mongoose.Schema

const markSchema = new Schema({
    amount: {
        type: String,
        required: true
    },
    disciplines: {
        ref: 'disciplines',
        type: Schema.Types.ObjectId
    },
    tasksAnswers: {
        ref: 'tasksAnswers',
        type: Schema.Types.ObjectId
    },
    user: {
        ref: 'users',
        type: Schema.Types.ObjectId
    },
})

module.exports = mongoose.model('markAnswers', markSchema)
