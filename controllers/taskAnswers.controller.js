const TaskAnswers = require('../models/TaskAnswers')
const errorHandler = require('../utils/errorHandler')
const Group = require("../models/Group.model");
const Task = require("../models/Task.model");

module.exports.create = async function (req, res) {

        try {
            const taskAnswer = await new TaskAnswers({
                answerFiles: req.body.answerFiles,
                disciplines: req.body.disciplines,
                task: req.body.task,
                user: req.body.user,
            }).save()
            res.status(201).json(taskAnswer)
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
        answerFiles: req.body.answerFiles,
    }

    try {
        const taskAnswer = await TaskAnswers.findOneAndUpdate(
            {_id: req.params.id},
            {$set: updated},
            {new: true}
        )
        res.status(200).json(taskAnswer)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getByDisciplineId = async function (req, res) {
    try {
        const taskAnswer = await TaskAnswers.find({
            discipline: req.params.disciplineId,
        })
        res.status(200).json(taskAnswer)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getByUserId = async function (req, res) {
    try {
        const taskAnswer = await TaskAnswers.find({
            user: req.params.userId,
        })
        res.status(200).json(taskAnswer)
    } catch (e) {
        errorHandler(res, e)
    }
}

// module.exports.getByUserAndDisciplineId = async function (req, res) {
//     try {
//         const taskAnswer = await TaskAnswers.find({
//             user: req.body.userId,
//             discipline: req.params.disciplineId,
//         })
//         res.status(200).json(taskAnswer)
//     } catch (e) {
//         errorHandler(res, e)
//     }
// }

module.exports.getByTaskId = async function (req, res) {
    try {
        const taskAnswer = await TaskAnswers.find({
            task: req.params.taskId,
        })
        res.status(200).json(taskAnswer)
    } catch (e) {
        errorHandler(res, e)
    }
}

exports.findById = async (req, res) => {
    const id = req.params.id;
    await TaskAnswers.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({message: "Not found TaskAnswer with id " + id});
            else res.send(data);
        })
        .catch(e => {
            errorHandler(res, e)
        });
};

module.exports.remove = async function (req, res) {
    const _id = req.params.id;
    await TaskAnswers.remove({_id})
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete taskAnswers with id=${_id}. Maybe  was not found!`
                });
            } else {
                res.send({
                    message: "TaskAnswer was deleted successfully!"
                });
            }
        })
        .catch(e => {
            errorHandler(res, e)
        });
}