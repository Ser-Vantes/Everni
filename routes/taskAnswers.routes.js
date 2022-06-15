const {authJwt} = require("../middleware");
const controller = require("../controllers/taskAnswers.controller");
module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/api/taskAnswers/", [authJwt.verifyToken, authJwt.isAdmin], controller.create);
    app.get("/api/taskAnswers/:id", [authJwt.verifyToken], controller.findById);
    app.get("/api/taskAnswers/chapter/:chapterId", [authJwt.verifyToken], controller.getByTaskId);
    app.get("/api/taskAnswers/discipline/:disciplineId", [authJwt.verifyToken], controller.getByDisciplineId);
    app.patch("/api/taskAnswers/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.update);
    app.delete("/api/taskAnswers/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.remove);
};

