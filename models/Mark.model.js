const mongoose = require('mongoose')
const Schema = mongoose.Schema

const markSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true,
    },
    middleName: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        slug: ["firstName", "lastName", "middleName"],
        slug_padding_size: 2,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        default: '123456',
        required: true
    },
    avatar: {
        type: String,
        default: ''
    },
    birthday: {
        type: Date,
        default: Date.now
    },
    roles: [
        {
            ref: "roles",
            type: Schema.Types.ObjectId,
        }
    ],
    group: {
        ref: 'groups',
        type: Schema.Types.ObjectId,
    },
    teachersDisciplines: [
        {
            ref: 'disciplines',
            type: Schema.Types.ObjectId
        }
    ],
    studentDisciplines:
        [
            {
                type: Schema.Types.ObjectId,
                ref: 'disciplines'
            }
        ],
    department: {
        ref: 'users',
        type: Schema.Types.ObjectId,
    },
    faculty: {
        ref: 'users',
        type: Schema.Types.ObjectId,
    },
    userActive: {
        type: Boolean,
        required: true
    },
    budget: {
        type: Boolean,
    },
    educationForm:{
        type: String,
        enum: ["bachelor", "master"]
    }


})

module.exports = mongoose.model('users', markSchema)
