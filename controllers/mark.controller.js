const errorHandler = require('../utils/errorHandler')
const Task = require("../models/Task.model");
const Mark = require("../models/Mark.model")

module.exports.create = async function (req, res) {
    try {
        const mark = await new Mark({
            amount: req.body.amount,
            disciplines: req.body.disciplines,
            tasksAnswers: req.body.tasksAnswers,
            user: req.body.user
        }).save()
        res.status(201).json(mark)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.update = async function (req, res) {

    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const updated = {
        amount: req.body.amount,
    }

    try {
        const mark = await Mark.findOneAndUpdate(
            {_id: req.params.id},
            {$set: updated},
            {new: true}
        )
        res.status(200).json(mark)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getByDisciplineId = async function (req, res) {
    try {
        const mark = await Mark.find({
            disciplines: req.params.disciplineId,
        })
        res.status(200).json(mark)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getByTaskAnswerId = async function (req, res) {
    try {
        const taskAnswer = await Mark.find({
            tasksAnswers: req.params.tasksAnswersId,
        })
        res.status(200).json(taskAnswer)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getByUserId = async function (req, res) {
    try {
        const taskAnswer = await Mark.find({
            user: req.params.userId,
        })
        res.status(200).json(taskAnswer)
    } catch (e) {
        errorHandler(res, e)
    }
}

exports.findById = async (req, res) => {
    const id = req.params.id;
    await Mark.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({message: "Not found Mark with id " + id});
            else res.send(data);
        })
        .catch(e => {
            errorHandler(res, e)
        });
};

module.exports.remove = async function (req, res) {
    const _id = req.params.id;
    await Mark.remove({_id})
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete mark with id=${_id}. Maybe  was not found!`
                });
            } else {
                res.send({
                    message: "Mark was deleted successfully!"
                });
            }
        })
        .catch(e => {
            errorHandler(res, e)
        });
}