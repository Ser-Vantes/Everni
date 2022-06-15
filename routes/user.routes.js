const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");
module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.get("/api/user/all", [authJwt.verifyToken], controller.findAll);
    app.get("/api/user/studentD/:id", [authJwt.verifyToken], controller.findStudentDisciplines);
    app.get("/api/user/teacherD/:id", [authJwt.verifyToken], controller.findTeacherDisciplines);
    app.get("/api/user/", [authJwt.verifyToken], controller.findByName);
    app.get("/api/user/teachers", [authJwt.verifyToken], controller.findTeachers);
    app.get("/api/user/students", [authJwt.verifyToken], controller.findStudents);
    app.patch('/api/user/disciplinesS/:id', [authJwt.verifyToken,authJwt.isAdmin], controller.addStudentDiscipline)
    app.patch('/api/user/disciplinesD/:id', [authJwt.verifyToken,authJwt.isAdmin], controller.deleteStudentDiscipline)
    app.patch('/api/user/disciplinesTAdd/:id', [authJwt.verifyToken,authJwt.isAdmin], controller.addTeacherDiscipline)
    app.patch('/api/user/disciplinesTDel/:id', [authJwt.verifyToken,authJwt.isAdmin], controller.deleteTeacherDiscipline)
    app.post("/api/user/", [authJwt.verifyToken,authJwt.isAdmin], controller.create);
    app.get("/api/user/:id", [authJwt.verifyToken], controller.findById);
    app.patch("/api/user/:id", [authJwt.verifyToken,authJwt.isAdmin], controller.update);
    app.get(
        "/api/user/group/:groupId",
        [authJwt.verifyToken, authJwt.isTeacher],
        controller.getByGroupId
    );
};

