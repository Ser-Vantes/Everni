const Task = require('../models/Task.model')
const Chapter = require('../models/Chapter.model')
const errorHandler = require('../utils/errorHandler')

module.exports.create = async function (req, res) {
    const tasks = await Task.findOne({title: req.body.title})
    if (!req.body.title) {
        res.status(400).send({message: "Content can not be empty!"});
        return;
    }
    if (tasks) {
        res.status(409).json({
            message: 'Такой task уже занят. Попробуйте другой.'
        })
    } else {
        try {
            const task = await new Task({
                title: req.body.title,
                taskText: req.body.taskText,
                taskFiles: req.body.taskFiles,
                deadline: req.body.deadline,
                disciplines: req.body.discipline,
                chapters: req.body.chapter,
            }).save().then(task =>{
                Chapter.findOneAndUpdate({_id: task.chapters}, {
                    "$addToSet": {"tasks": task._id}
                }, {new: true, safe: true, upsert: true}).then((result) => {
                    return res.status(201).json({
                        data: task
                    });
                }).catch((error) => {
                    return res.status(500).json({
                        data: error
                    });
                });
            })
        } catch (e) {
            errorHandler(res, e)
        }
    }
}

module.exports.getByChapterId = async function (req, res) {
    try {
        const task = await Task.find({
            chapter: req.params.chapterId,
        })
        res.status(200).json(task)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getByDisciplineId = async function (req, res) {
    try {
        const task = await Task.find({
            discipline: req.params.disciplineId,
        })
        res.status(200).json(task)
    } catch (e) {
        errorHandler(res, e)
    }
}

exports.findById = async (req, res) => {
    const id = req.params.id;
    await Task.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({message: "Not found Task with id " + id});
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

    const updated = {
        title: req.body.title,
        taskText: req.body.taskText,
        taskFiles: req.body.taskFiles,
    }

    try {
        const task = await Task.findOneAndUpdate(
            {_id: req.params.id},
            {$set: updated},
            {new: true}
        )
        res.status(200).json(task)
    } catch (e) {
        errorHandler(res, e)
    }
}


module.exports.remove = async function (req, res) {
    const _id = req.params.id;
    await Task.remove({_id})
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete task with id=${_id}. Maybe chapter was not found!`
                });
            } else {
                res.send({
                    message: "Task was deleted successfully!"
                });
            }
        })
        .catch(e => {
            errorHandler(res, e)
        });
}