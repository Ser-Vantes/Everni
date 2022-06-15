
const db = require("../models");
const Department = require('../models/Department.model')
const errorHandler = require('../utils/errorHandler')



module.exports.create = async function (req, res) {
    const department = await Department.findOne({departmentName: req.body.departmentName})
    if (!req.body.departmentName) {
        res.status(400).send({message: "Content can not be empty!"});
        return;
    }
    if (department) {
        res.status(409).json({
            message: 'Такой department уже занят. Попробуйте другой.'
        })
    } else {
        try {
            const department = await new Department({
                departmentName: req.body.departmentName,
                faculty: req.body.faculty,
                chapter: req.body.chapter
            }).save()
            res.status(201).json(department)
        } catch (e) {
            errorHandler(res, e)
        }
    }
}


module.exports.findAll = (req, res) => {
    const departmentName = req.query.departmentName;
    const condition = departmentName ? {departmentName: {$regex: new RegExp(departmentName), $options: "i"}} : {};
    Department.find(condition)
        .then(data => {
            res.send(data);
        })
        .catch(e => {
            errorHandler(res, e)
        });
};



exports.findById = async (req, res) => {
    const id = req.params.id;
    await Department.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({message: "Not found Department with id " + id});
            else res.send(data);
        })
        .catch(e => {
            errorHandler(res, e)
        });
};

module.exports.getByFacultyId = async function(req, res) {
    try {
        const department = await Department.find({
            faculty: req.params.facultyId,
        })
        res.status(200).json(department)
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

    try {
        const department = await Department.findOneAndUpdate(
            {_id: req.params.id},
            {$set: req.body},
            {new: true}
        )
        res.status(200).json(department)
    } catch (e) {
        errorHandler(res, e)
    }
}


module.exports.remove = async function (req, res) {
    const id = req.params.id;
    await Department.remove({id})
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Department with id=${id}. Maybe Faculty was not found!`
                });
            } else {
                res.send({
                    message: "Department was deleted successfully!"
                });
            }
        })
        .catch(e => {
            errorHandler(res, e)
        });
}

//
// exports.deleteAll = async (req, res) => {
//     await  Group.deleteMany({})
//         .then(data => {
//             res.send({
//                 message: `${data.deletedCount} groups were deleted successfully!`
//             });
//         })
//         .catch(e => {
//             errorHandler(res, e)
//         });
// };
