const Discipline = require('../models/Discipline.model')
const errorHandler = require('../utils/errorHandler')
const Group = require("../models/Group.model");
const Faculty = require("../models/Faculty.model");
const Chapter = require("../models/Chapter.model");
const User = require("../models/User.model");

// noinspection DuplicatedCode
module.exports.create = async function (req, res) {
    const disciplines = await Discipline.findOne({disciplineName: req.body.disciplineName})
    if (!req.body.disciplineName) {
        res.status(400).send({message: "Content can not be empty!"});
        return;
    }
    if (disciplines) {
        res.status(409).json({
            message: 'Такая дисциплина  уже есть. Попробуйте другую.'
        })
    } else {
        try {
            const discipline = await new Discipline({
                disciplineName: req.body.disciplineName,
                department: req.body.department,
                avatar: req.file ? req.file.path : '',
                About: req.body.About,
                StartDate: req.body.StartDate,
                EndDate: req.body.EndDate,
                EducationHours: req.body.EducationHours,
                ControlType: req.body.ControlType,
                credits: req.body.credits,
            }).save()
            res.status(201).json(discipline)
        } catch (e) {
            errorHandler(res, e)
        }
    }
}

module.exports.getAll = async function (req, res) {
    try {
        const disciplines = await Discipline.find({})
        res.status(200).json(disciplines)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.findByQuery = (req, res) => {
    const disciplineName = req.query.disciplineName;
    const condition = disciplineName ? {disciplineName: {$regex: new RegExp(disciplineName), $options: "i"}} : {};
    Group.find(condition)
        .then(data => {
            res.send(data);
        })
        .catch(e => {
            errorHandler(res, e)
        });
};


exports.findById = async (req, res) => {
    const id = req.params.id;
    await Discipline.findById(id).populate('department', "departmentName _id -__v")
        .populate('students', "firstName lastName middleName _id -__v")
        .populate('teachers', "firstName lastName middleName _id -__v")
        .populate('mainTeacher', "firstName lastName middleName _id -__v")
        .populate('chapters', '_id')
        .then(data => {
            if (!data)
                res.status(404).send({message: "Not found Discipline with id " + id});
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
        const discipline = await Discipline.findOneAndUpdate(
            {_id: req.params.id},
            {$set: req.body},
            {new: true}
        )
        res.status(200).json(discipline)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.remove = async function (req, res) {
    try {
        await Discipline.remove({_id: req.params.id})
        await Chapter.remove({discipline: req.params.id})
        res.status(200).json({
            message: 'Discipline removed.'
        })
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.addStudents = async function (req, res) {
    const studentArray = req.body.array
    try {
        await Discipline.findOneAndUpdate(
            {_id: req.params.id},
            {
                "$addToSet": {
                    "students": {$each: studentArray}
                }
            }, {new: true, safe: true, upsert: true}
        ).then((result) => {
            return res.status(201).json({
                status: "Success",
                message: "Student add",
                data: result
            });
        }).catch((error) => {
            return res.status(500).json({
                status: "Failed",
                message: "Database Error",
                data: error
            });
        });
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.deleteStudent = async function (req, res) {
    const id = req.body.id;
    try {
        await Discipline.findOneAndUpdate({_id: req.params.id}, {
            "$pull": {"students": id}
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

module.exports.addStudent = async function (req, res) {
    const id = req.body.id
    try {
        await Discipline.findOneAndUpdate({_id: req.params.id}, {
            "$addToSet": {"students": id}
        }, {new: true, safe: true, upsert: true}).then((result) => {
            return res.status(201).json({
                status: "Success",
                message: "Student add",
                data: result
            });
        }).catch((error) => {
            return res.status(500).json({
                status: "Failed",
                message: "Database Error",
                data: error
            });
        });
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.addDisciplineChapter = async function (req, res) {
    const id = req.params.id;
    try {
        await Discipline.findOneAndUpdate({_id: id}, {
            "$addToSet": {"chapters": req.body._id}
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

module.exports.deleteDisciplineChapter = async function (req, res) {
    const id = req.params.id;
    try {
        await Discipline.findOneAndUpdate({_id: id}, {
            "$pull": {"chapters": req.body._id}
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


exports.deleteAll = (req, res) => {

};

exports.findAllPublished = (req, res) => {

};