const Awards = require('../models/Award.model')
const errorHandler = require('../utils/errorHandler')

module.exports.create = async function (req, res) {
    const awards = await Awards.findOne({title: req.body.title})
    if (!req.body.title) {
        res.status(400).send({message: "Content can not be empty!"});
        return;
    }
    if (awards) {
        res.status(409).json({
            message: 'Такой award уже занят. Попробуйте другой.'
        })
    } else {
        try {
            const award = await new Awards({
                title: req.body.title,
                imageSrc: req.body.imageSrc,
                description: req.body.description
            }).save()
            res.status(201).json(award)
        } catch (e) {
            errorHandler(res, e)
        }
    }
}
