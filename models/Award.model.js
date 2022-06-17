const mongoose = require('mongoose')
const Schema = mongoose.Schema

const awardSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    imageSrc: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('awards', awardSchema)
