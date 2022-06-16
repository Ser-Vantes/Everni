const {authJwt} = require("../middleware");
const controller = require("../controllers/discipline.controller");
module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/api/disciplines/", [authJwt.verifyToken, authJwt.isAdmin], controller.create);
    app.get("/api/disciplines/", [authJwt.verifyToken, authJwt.isAdmin], controller.getAll);
    app.get("/api/disciplines/title/", [authJwt.verifyToken], controller.findByQuery);
    app.patch('/api/disciplines/students/:id', [authJwt.verifyToken,authJwt.isAdmin], controller.addStudent)
    app.patch('/api/disciplines/studentsS/:id', [authJwt.verifyToken,authJwt.isAdmin], controller.addStudents)
    app.get("/api/disciplines/:id", [authJwt.verifyToken], controller.findById);
    app.patch("/api/disciplines/:id", [authJwt.verifyToken, authJwt.isTeacher], controller.update);
    app.delete("/api/disciplines/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.remove);
};


