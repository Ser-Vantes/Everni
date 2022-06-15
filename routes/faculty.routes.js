const {authJwt} = require("../middleware");
const controller = require("../controllers/faculty.controller");
module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/api/faculty/", [authJwt.verifyToken, authJwt.isAdmin], controller.create);
    app.get("/api/faculty/", [authJwt.verifyToken, authJwt.isAdmin], controller.findAll);
    app.get("/api/faculty/:id", [authJwt.verifyToken], controller.findById);
    app.patch("/api/faculty/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.update);
    app.delete("/api/faculty/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.remove);
};

