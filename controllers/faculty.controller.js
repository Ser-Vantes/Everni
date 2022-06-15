const db = require("../models");
const Faculty = require('../models/Faculty.model')
const errorHandler = require('../utils/errorHandler')

module.exports.create = async function (req, res) {
    const faculty = await Faculty.findOne({facultyName: req.body.facultyName})
    if (!req.body.facultyName) {
        res.status(400).send({message: "Content can not be empty!"});
        return;
    }
    if (faculty) {
        res.status(409).json({
            message: 'Такой faculty уже занят. Попробуйте другой.'
        })
    } else {
        try {
            const faculty = await new Faculty({
                facultyName: req.body.facultyName,
            }).save()
            res.status(201).json(faculty)
        } catch (e) {
            errorHandler(res, e)
        }
    }
}


module.exports.findAll = (req, res) => {
    const facultyName = req.query.facultyName;
    const condition = facultyName ? {facultyName: {$regex: new RegExp(facultyName), $options: "i"}} : {};
    Faculty.find(condition)
        .then(data => {
            res.send(data);
        })
        .catch(e => {
            errorHandler(res, e)
        });
};



exports.findById = async (req, res) => {
    const id = req.params.id;
    await Faculty.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({message: "Not found Faculty with id " + id});
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
        facultyName: req.body.facultyName
    }

    try {
        const faculty = await Faculty.findOneAndUpdate(
            {_id: req.params.id},
            {$set: updated},
            {new: true}
        )
        res.status(200).json(faculty)
    } catch (e) {
        errorHandler(res, e)
    }
}


module.exports.remove = async function (req, res) {
    const id = req.params.id;
    await Faculty.remove({id})
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Faculty with id=${id}. Maybe Faculty was not found!`
                });
            } else {
                res.send({
                    message: "Faculty was deleted successfully!"
                });
            }
        })
        .catch(e => {
            errorHandler(res, e)
        });
}


