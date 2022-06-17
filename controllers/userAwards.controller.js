const UserAwards = require('../models/UserAwards')
const errorHandler = require('../utils/errorHandler')
const Chapter = require("../models/Chapter.model");

module.exports.create = async function (req, res) {
        try {
            const userAward = await new UserAwards({
                student: req.body.student,
                awards: req.body.awards,
                disciplines: req.body.disciplines
            }).save()
            res.status(201).json(userAward)
        } catch (e) {
            errorHandler(res, e)
        }
}

module.exports.findAll = async (req, res) => {
    try {
        const userAwards = await UserAwards.find({})
            .then(data => {
                res.send(data)
            })
        res.status(200)
    } catch (e) {
        errorHandler(res, e)
    }
};

module.exports.getByStudentId = async function (req, res) {
    try {
        const userAwards = await UserAwards.find({
            student: req.params.studentId,
        })
            .populate('awards')
            .populate('disciplines')
        res.status(200).json(userAwards)
    } catch (e) {
        errorHandler(res, e)
    }
}

exports.findById = async (req, res) => {
    const id = req.params.id;
    await UserAwards.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({message: "Not found UserAwards with id " + id});
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
        const userAward = await UserAwards.findOneAndUpdate(
            {_id: req.params.id},
            {$set: req.body},
            {new: true}
        )
        res.status(200).json(userAward)
    } catch (e) {
        errorHandler(res, e)
    }
}


module.exports.remove = async function (req, res) {
    const _id = req.params.id;
    await UserAwards.remove({_id})
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete userAward with id=${_id}. Maybe award was not found!`
                });
            } else {
                res.send({
                    message: " UserAward was deleted successfully!"
                });
            }
        })
        .catch(e => {
            errorHandler(res, e)
        });
}