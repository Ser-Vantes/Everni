const mongoose = require('mongoose')
const Schema = mongoose.Schema

const groupSchema = new Schema({
    groupName: {
        type: String,
        unique: true,
        required: true
    },
    department: {
        ref: 'departments',
        type: Schema.Types.ObjectId
    },
    faculty: {
        ref: 'faculties',
        type: Schema.Types.ObjectId
    },
    mentor: {
        ref: 'users',
        type: Schema.Types.ObjectId
    },

})

module.exports = mongoose.model('groups', groupSchema)
