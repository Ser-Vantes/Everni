const config = require("../config/auth.config");
const db = require("../models");
const { user: User, role: Role, refreshToken: RefreshToken } = db;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const errorHandler = require('../utils/errorHandler')


exports.signup = async (req, res) => {

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
            userActive: req.body.userActive
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



exports.signin = (req, res) => {
    User.findOne({
        email: req.body.email
    })
        .populate("roles", "-__v")
        .exec(async (err, user) => {
            if (err) {
                res.status(500).send({message: err});
                return;
            }
            if (!user) {
                return res.status(404).send({message: "User Not found."});
            }
            const passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );
            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!"
                });
            }
            const token = jwt.sign({id: user.id}, config.secret, {
                expiresIn: config.jwtExpiration,
            });
            let refreshToken = await RefreshToken.createToken(user);
            const authorities = [];
            let checkAdmin = false
            for (let i = 0; i < user.roles.length; i++) {
                authorities.push(user.roles[i].name);
                if (user.roles[i].name == 'admin') {
                    checkAdmin = true
                }
            }
            res.status(200).send({
            user:{
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                middleName: user.middleName,
                slug: user.slug,
                email: user.email,
                groupId: user.groupId,
                isAdmin: checkAdmin,
                roles: authorities.join(),
                userActive: user.userActive
            },
                accessToken: token,
                refreshToken: refreshToken,
            });
        });
};

exports.refreshToken = async (req, res) => {
    const { refreshToken: requestToken } = req.body;
    if (requestToken == null) {
        return res.status(403).json({ message: "Refresh Token is required!" });
    }
    try {
        let refreshToken = await RefreshToken.findOne({ token: requestToken });
        if (!refreshToken) {
            res.status(403).json({ message: "Refresh token is not in database!" });
            return;
        }
        if (RefreshToken.verifyExpiration(refreshToken)) {
            await RefreshToken.findByIdAndRemove(refreshToken._id, {useFindAndModify: false}).exec();

            res.status(403).json({
                message: "Refresh token was expired. Please make a new signin request",
            });
            return;
        }
        let newAccessToken = jwt.sign({ id: refreshToken.user._id }, config.secret, {
            expiresIn: config.jwtExpiration,
        });
         await User.findById(refreshToken.user._id)
             .populate("roles", "-__v")
             .exec(async (err, user) => {
                 if (err) {
                     res.status(500).send({message: err});
                     return;
                 }
                 if (!user) {
                     return res.status(404).send({message: "User Not found."});
                 }
                 const authorities = [];
                 let checkAdmin = false
                 for (let i = 0; i < user.roles.length; i++) {
                     authorities.push(user.roles[i].name);
                     if (user.roles[i].name == 'admin') {
                         checkAdmin = true
                     }
                 }
                 res.status(200).send({
                     user:{
                         id: user._id,
                         firstName: user.firstName,
                         lastName: user.lastName,
                         middleName: user.middleName,
                         slug: user.slug,
                         email: user.email,
                         groupId: user.groupId,
                         isAdmin: checkAdmin,
                         roles: authorities.join(),
                         userActive: user.userActive
                     },
                     accessToken: newAccessToken,
                     refreshToken: refreshToken.token,
                 });
             });
    } catch (err) {
        return res.status(500).send({ message: err });
    }
};
