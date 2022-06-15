const mongoose = require('mongoose')
const Schema = mongoose.Schema
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const awardSchema = new Schema({
    student: {
        ref: 'users',
        type: Schema.Types.ObjectId,
    },
    awards: {
        ref: 'awards',
        type: Schema.Types.ObjectId,
    },
    disciplines: {
        ref: 'disciplines',
        type: Schema.Types.ObjectId,
    },
})

module.exports = mongoose.model('users', awardSchema)
