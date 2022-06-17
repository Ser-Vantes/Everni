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

module.exports.findAll = async (req, res) => {
    try {
        const awards = await Awards.find({})
            .then(data => {
                res.send(data)
            })
        res.status(200)
    } catch (e) {
        errorHandler(res, e)
    }
};
exports.findById = async (req, res) => {
    const id = req.params.id;
    await Awards.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({message: "Not found Awards with id " + id});
            else res.send(data);
        })
        .catch(e => {
            errorHandler(res, e)
        });
};

module.exports.update = async function (req, res) {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    try {
        const awards = await Awards.findOneAndUpdate(
            {_id: req.params.id},
            {$set: req.body},
            {new: true}
        )
        res.status(200).json(lecture)
    } catch (e) {
        errorHandler(res, e)
    }
}


module.exports.remove = async function (req, res) {
    const _id = req.params.id;
    await Awards.remove({_id})
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete award with id=${_id}. Maybe award was not found!`
                });
            } else {
                res.send({
                    message: "Lecture was deleted successfully!"
                });
            }
        })
        .catch(e => {
            errorHandler(res, e)
        });
}