const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const db = {};
db.mongoose = mongoose;

db.user = require("./User.model");
db.role = require("./Role.model");
db.department = ("./Department.model")
db.faculty = ("./Faculty.model")
db.discipline = ("./Discipline.model")
db.groupStudents = ("./Group.model")
db.refreshToken = require("./RefreshToken.model");
db.ROLES = ["student", "teacher", "admin"];
module.exports = db;
