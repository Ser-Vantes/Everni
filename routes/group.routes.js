const {authJwt} = require("../middleware");
const controller = require("../controllers/group.controller");
module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/api/group/", [authJwt.verifyToken, authJwt.isAdmin], controller.create);
    app.get("/api/group/", [authJwt.verifyToken], controller.findAll);
    app.get("/api/group/:id", [authJwt.verifyToken], controller.findByGroupId);
    app.get("/api/group/faculty/:facultyId", [authJwt.verifyToken], controller.getByFacultyId);
    app.patch("/api/group/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.update);
    app.delete("/api/group/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.remove);
};

