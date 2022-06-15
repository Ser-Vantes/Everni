const {authJwt} = require("../middleware");
const controller = require("../controllers/department.controller");
module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/api/department/", [authJwt.verifyToken, authJwt.isAdmin], controller.create);
    app.get("/api/department/", [authJwt.verifyToken, authJwt.isAdmin], controller.findAll);
    app.get("/api/department/:id", [authJwt.verifyToken], controller.findById);
    app.get("/api/department/faculty/:facultyId", [authJwt.verifyToken], controller.getByFacultyId);
    app.patch("/api/department/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.update);
    app.delete("/api/department/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.remove);
};

