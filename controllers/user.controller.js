// noinspection DuplicatedCode

const db = require("../models");
const config = require("../config/auth.config");
const { user: User, role: Role} = db;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const errorHandler = require('../utils/errorHandler')

const Group = require("../models/Group.model");
const Discipline = require('../models/Discipline.model')
const Faculty = require("../models/Faculty.model");


module.exports.create = async function (req, res) {
    const candidate = await User.findOne({email: req.body.email})
    if (candidate) {
        res.status(409).json({
            message: 'Такой email уже занят. Попробуйте другой.'
        })
    }else {
        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            middleName: req.body.middleName,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8),
            group: req.body.group || 'no',
            department: req.body.department || 'no',
            faculty: req.body.faculty || 'no',
            userActive: req.body.userActive,
            budget: req.body.budget,
            educationForm: req.body.educationForm
        });
        user.save((err, user) => {
            if (err) {
                res.status(500).send({message: err});
                return;
            }
            if (req.body.roles) {
                Role.find(
                    {
                        name: {$in: req.body.roles}
                    },
                    (err, roles) => {
                        if (err) {
                            res.status(500).send({message: err});
                            return;
                        }
                        user.roles = roles.map(role => role._id);
                        user.save(err => {
                            if (err) {
                                res.status(500).send({message: err});
                                return;
                            }
                            res.send({message: "User was registered successfully!"});
                        });
                    }
                );
            } else {
                Role.findOne({name: "student"}, (err, role) => {
                    if (err) {
                        res.status(500).send({message: err});
                        return;
                    }
                    user.roles = [role._id];
                    user.save(err => {
                        if (err) {
                            res.status(500).send({message: err});
                            return;
                        }
                        res.send({message: "User was registered successfully!"});
                    });
                });
            }
        });
    }
};

module.exports.findAll = async (req, res) => {
    try {
        const users = await User.find({}).
        populate('roles',"-_id -__v").
            exec(function (err, users) {
                res.status(200).json(users);
            });
    } catch (e) {
        errorHandler(res, e)
    }
};

module.exports.findStudentDisciplines = async (req, res) => {
    try {
        const id = req.params.id;
        await User.findById(id,'studentDisciplines').
        populate('studentDisciplines').
            exec(function (err, users) {
                res.status(200).json(users);
            });
    } catch (e) {
        errorHandler(res, e)
    }
};

module.exports.findTeacherDisciplines = async (req, res) => {
    try {
        const id = req.params.id;
        await User.findById(id,'teachersDisciplines').
        populate('teachersDisciplines').
            exec(function (err, users) {
                res.status(200).json(users);
            });
    } catch (e) {
        errorHandler(res, e)
    }
};



module.exports.findTeachers = async (req, res) => {
    try {
        const users = await User.find({}).
        populate('roles',"-_id -__v").
            exec(function (err, users) {

            if (err) {
                res.status(500).send({message: err});
                return;
            }
            if (!users) {
                return res.status(404).send({message: "Users Not found."});
            }
            const teachers = []
            for (let i = 0; i < users.length; i++) {
                for (let j = 0; j<users[i].roles.length; j++){
                    if (users[i].roles[j].name == 'teacher') {
                        teachers.push(users[i]);
                    }
                }
            }
                res.status(200).json(teachers);
            });
    } catch (e) {
        errorHandler(res, e)
    }
};


module.exports.findStudents = async (req, res) => {
    try {
        const users = await User.find({}).
        populate('roles',"-_id -__v").
            exec(function (err, users) {
            if (err) {
                res.status(500).send({message: err});
                return;
            }
            if (!users) {
                return res.status(404).send({message: "Users Not found."});
            }
            const students = []
            for (let i = 0; i < users.length; i++) {
                for (let j = 0; j<users[i].roles.length; j++){
                    if (users[i].roles[j].name == 'student') {
                        students.push(users[i]);
                    }
                }
            }
                res.status(200).json(students);
            });
    } catch (e) {
        errorHandler(res, e)
    }
};


module.exports.findByName = (req, res) => {
    const lastName = req.query.firstName;
    const condition = lastName ? {lastName: {$regex: new RegExp(lastName), $options: "i"}} : {};
    User.find(condition)
        .then(data => {
            res.send(data);
        })
        .catch(e => {
            errorHandler(res, e)
        });
};

exports.findById = async (req, res) => {
    const id = req.params.id;
    await User.findById(id).
    populate('teachersDisciplines',"disciplineName _id -__v").
    populate('studentDisciplines',"disciplineName _id -__v").
    populate('group',"groupName _id -__v").
    populate('department',"departmentName _id -__v").
    populate('faculty',"facultyName _id -__v").
    populate("roles", "-__v")
        .then(data => {
            if (!data)
                res.status(404).send({message: "Not found User with id " + id});
            else res.send(data);
        })
        .catch(e => {
            errorHandler(res, e)
        });
};

module.exports.addStudentDiscipline = async function (req, res) {
    const id = req.body.id;
    try {
        await User.findOneAndUpdate({_id: id}, {
            "$addToSet": {"studentDisciplines": req.params.id}
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


module.exports.deleteStudentDiscipline = async function (req, res) {
    const id = req.body.id;
    try {
        await User.findOneAndUpdate({_id: id}, {
            "$pull": {"studentDisciplines": req.params.id}
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

module.exports.addTeacherDiscipline = async function (req, res) {
    const id = req.body.id;
    try {
        await User.findOneAndUpdate({_id: id}, {
            "$addToSet": {"teachersDisciplines": req.params.id}
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

module.exports.deleteTeacherDiscipline = async function (req, res) {
    const id = req.body.id;
    try {
        await User.findOneAndUpdate({_id: id}, {
            "$pull": {"teachersDisciplines": req.params.id}
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

module.exports.getByGroupId = async function (req, res) {
    try {
        const user = await User.find({
            group: req.params.groupId,
        })
        res.status(200).json(user)
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
        const user = await User.findOneAndUpdate(
            {_id: req.params.id},
            {$set: req.body},
            {new: true}
        )
        res.status(200).json(user)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.addToGroup = async function (req, res) {
    const updated = {
        group: req.body.group
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

exports.delete = (req, res) => {

};

exports.deleteAll = (req, res) => {

};

exports.findAllPublished = (req, res) => {

};