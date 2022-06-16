const Chapter = require('../models/Chapter.model')
const Lecture = require('../models/Lecture.model')
const Task = require('../models/Task.model')
const errorHandler = require('../utils/errorHandler')

module.exports.create = async function (req, res) {
    const chapters = await Chapter.findOne({title: req.body.title})
    if (!req.body.title) {
        res.status(400).send({message: "Content can not be empty!"});
        return;
    }
    if (chapters) {
        res.status(409).json({
            message: 'Такой chapter уже занят. Попробуйте другой.'
        })
    } else {
        try {
            const chapter = await new Chapter({
                title: req.body.title,
                about: req.body.about,
                discipline: req.body.discipline,
            }).save()
            res.status(201).json(chapter)
        } catch (e) {
            errorHandler(res, e)
        }
    }
}

module.exports.getByDisciplineId = async function (req, res) {
    try {
        const chapter = await Chapter.find({
            discipline: req.params.disciplineId,
        })
            .populate('lectures', "_id")
            .populate('tasks', "_id")
        res.status(200).json(chapter)
    } catch (e) {
        errorHandler(res, e)
    }
}

exports.findByChapterId = async (req, res) => {
    const id = req.params.id;
    await Chapter.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({message: "Not found Chapter with id " + id});
            else res.send(data);
        })
        .catch(e => {
            errorHandler(res, e)
        });
};

module.exports.addChapterLecture = async function (req, res) {
    const id = req.params.id;
    try {
        await Chapter.findOneAndUpdate({_id: id}, {
            "$addToSet": {"lectures": req.body._id}
        }, {new: true, safe: true, upsert: true}).then((result) => {
            return res.status(201).json({
                data: result
            });
        }).catch((error) => {
            return res.status(500).json({
                data: error
            });
        });
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.addChapterTask = async function (req, res) {
    const id = req.params.id;
    try {
        await Chapter.findOneAndUpdate({_id: id}, {
            "$addToSet": {"tasks": req.body._id}
        }, {new: true, safe: true, upsert: true}).then((result) => {
            return res.status(201).json({
                data: result
            });
        }).catch((error) => {
            return res.status(500).json({
                data: error
            });
        });
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
        title: req.body.title
    }

    try {
        const chapter = await Chapter.findOneAndUpdate(
            {_id: req.params.id},
            {$set: updated},
            {new: true}
        )
        res.status(200).json(chapter)
    } catch (e) {
        errorHandler(res, e)
    }
}


module.exports.remove = async function (req, res) {
   const _id = req.params.id
    await Chapter.remove({_id})
    await Lecture.remove({chapter: req.params.id})
    await Task.remove({chapter: req.params.id})
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Chapter with id=${_id}. Maybe chapter was not found!`
                });
            } else {
                res.send({
                    message: "Chapter was deleted successfully!"
                });
            }
        })
        .catch(e => {
            errorHandler(res, e)
        });
}