const Lecture = require('../models/Lecture.model')
const errorHandler = require('../utils/errorHandler')
const Chapter = require("../models/Chapter.model");

module.exports.create = async function (req, res) {
    const lectures = await Lecture.findOne({title: req.body.title})
    if (!req.body.title) {
        res.status(400).send({message: "Content can not be empty!"});
        return;
    }
    if (lectures) {
        res.status(409).json({
            message: 'Такой lecture уже занят. Попробуйте другой.'
        })
    } else {
        try {
            const lecture = await new Lecture({
                title: req.body.title,
                lectureText: req.body.lectureText,
                video: req.body.video,
                usefulLinks: req.body.usefulLinks,
                discipline: req.body.discipline,
                chapter: req.body.chapter,
            }).save().then(lecture =>{
                Chapter.findOneAndUpdate({_id: lecture.chapter}, {
                    "$addToSet": {"lectures": lecture._id}
                }, {new: true, safe: true, upsert: true}).then((result) => {
                    return res.status(201).json({
                        data: lecture
                    });
                }).catch((error) => {
                    return res.status(500).json({
                        data: error
                    });
                });
            })
            res.status(201).json(lecture)
        } catch (e) {
            errorHandler(res, e)
        }
    }
}

module.exports.getByChapterId = async function (req, res) {
    try {
        const lecture = await Lecture.find({
            chapter: req.params.chapterId,
        })
        res.status(200).json(lecture)
    } catch (e) {
        errorHandler(res, e)
    }
}

exports.findById = async (req, res) => {
    const id = req.params.id;
    await Lecture.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({message: "Not found Lecture with id " + id});
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
        const lecture = await Lecture.findOneAndUpdate(
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
    await Lecture.remove({_id})
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete lecture with id=${_id}. Maybe chapter was not found!`
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