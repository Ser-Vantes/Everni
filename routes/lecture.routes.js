const {authJwt} = require("../middleware");
const controller = require("../controllers/lecture.controllers");
module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/api/lecture/", [authJwt.verifyToken, authJwt.isAdmin], controller.create);
    app.get("/api/lecture/:id", [authJwt.verifyToken], controller.findById);
    app.get("/api/lecture/chapter/:chapterId", [authJwt.verifyToken], controller.getByChapterId);
    app.patch("/api/lecture/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.update);
    app.delete("/api/lecture/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.remove);
};

