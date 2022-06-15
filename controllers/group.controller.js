const db = require("../models");
const Group = require('../models/Group.model')
const {user: User} = db;
const errorHandler = require('../utils/errorHandler')

module.exports.create = async function (req, res) {
    const groups = await Group.findOne({groupName: req.body.groupName})
    if (!req.body.groupName) {
        res.status(400).send({message: "Content can not be empty!"});
        return;
    }
    if (groups) {
        res.status(409).json({
            message: 'Такой group уже занят. Попробуйте другой.'
        })
    } else {
        try {
            const group = await new Group({
                groupName: req.body.groupName,
                department: req.body.department,
                faculty: req.body.faculty,
                mentor: req.body.mentor
            }).save()
            res.status(201).json(group)
        } catch (e) {
            errorHandler(res, e)
        }
    }
}


module.exports.findAll = (req, res) => {
    const groupName = req.query.groupName;
    const condition = groupName ? {groupName: {$regex: new RegExp(groupName), $options: "i"}} : {};
    Group.find(condition)
        .then(data => {
            res.send(data);
        })
        .catch(e => {
            errorHandler(res, e)
        });
};


exports.findByGroupId = async (req, res) => {
    const id = req.params.id;
    await Group.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({message: "Not found Group with id " + id});
            else res.send(data);
        })
        .catch(e => {
            errorHandler(res, e)
        });
};


module.exports.getByFacultyId = async function (req, res) {
    try {
        const group = await Group.find({
            faculty: req.params.facultyId,
        })
        res.status(200).json(group)
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
        groupName: req.body.groupName
    }

    try {
        const group = await Group.findOneAndUpdate(
            {_id: req.params.id},
            {$set: updated},
            {new: true}
        )
        res.status(200).json(group)
    } catch (e) {
        errorHandler(res, e)
    }
}


module.exports.remove = async function (req, res) {
    const _id = req.params.id;
    await Group.remove({_id})
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Group with id=${_id}. Maybe group was not found!`
                });
            } else {
                res.send({
                    message: "Group was deleted successfully!"
                });
            }
        })
        .catch(e => {
            errorHandler(res, e)
        });
}
//
// module.exports.remove = async function(req, res) {
//     try {
//         await Group.remove({_id: req.params.id})
//         res.status(200).json({
//             message: 'Группа была удалена.'
//         })
//     } catch (e) {
//         errorHandler(res, e)
//     }
// }

