const mongoose = require('mongoose')
const Schema = mongoose.Schema


const departmentSchema = new Schema({
    departmentName: {
        type: String,
        required: true
    },
    faculty: {
        ref: 'faculties',
        type: Schema.Types.ObjectId
    },
    chapter: {
        ref: 'users',
        type: Schema.Types.ObjectId
    },

})

module.exports = mongoose.model('departments', departmentSchema)
