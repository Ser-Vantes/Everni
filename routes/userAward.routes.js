const {authJwt} = require("../middleware");
const controller = require("../controllers/userAwards.controller");
module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/api/award/", [authJwt.verifyToken, authJwt.isAdmin], controller.create);
    app.get("/api/award/:id", [authJwt.verifyToken], controller.findById);
    app.get("/api/award/", [authJwt.verifyToken], controller.findAll);
    app.get("/api/award/student/:studentId", [authJwt.verifyToken], controller.getByStudentId);
    app.patch("/api/award/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.update);
    app.delete("/api/award/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.remove);
};

