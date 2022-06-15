const mongoose = require('mongoose')
const Schema = mongoose.Schema


const disciplineSchema = new Schema({
    disciplineName: {
        type: String,
        required: true
    },
    department: {
        ref: 'departments',
        type: Schema.Types.ObjectId
    },
    avatar: {
        type: String,
        default: ''
    },
    teachers: [
        {
            ref: 'users',
            type: Schema.Types.ObjectId
        }
    ],
    students: [
        {
            ref: 'users',
            type: Schema.Types.ObjectId
        }
    ],
    About: {
        type: String,
        required: true
    },
    StartDate: {
        type: Date,
        default: Date.now
    },
    EndDate: {
        type: Date,
        default: Date.now
    },
    EducationHours: {
        type: Number,
        required: true
    },
    credits: {
        type: Number,
        required: true
    },
    ControlType: {
        type: String,
        required: true,
        enum: ["exam", "offset"]
    },

})

module.exports = mongoose.model('disciplines', disciplineSchema)
