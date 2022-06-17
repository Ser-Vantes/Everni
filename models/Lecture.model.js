const mongoose = require('mongoose')
const Schema = mongoose.Schema

const lectureSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    lectureText: {
        type: String,
        required: true
    },
    video:
        {
            type: String,
        }
    ,
    usefulLinks: [
        {
            title: {
                type: String
            },
            url: {
                type: String
            },
            _id: {
                type: Number
            }
        }
    ],
    discipline: {
        ref: 'disciplines',
        type: Schema.Types.ObjectId
    },
    chapter: {
        ref: 'chapters',
        type: Schema.Types.ObjectId
    },
})

module.exports = mongoose.model('lectures', lectureSchema)
