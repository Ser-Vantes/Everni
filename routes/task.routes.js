const { authJwt } = require("../middleware");
const controller = require("../controllers/task.controller");
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/task/",
    [authJwt.verifyToken, authJwt.isTeacher],
    controller.create
  );
  app.get("/api/task/:id", [authJwt.verifyToken], controller.findById);
  app.get(
    "/api/task/chapter/:chapterId",
    [authJwt.verifyToken],
    controller.getByChapterId
  );
  app.get(
    "/api/task/discipline/:disciplineId",
    [authJwt.verifyToken],
    controller.getByDisciplineId
  );
  app.patch(
    "/api/task/:id",
    [authJwt.verifyToken, authJwt.isTeacher],
    controller.update
  );
  app.delete(
    "/api/task/:id",
    [authJwt.verifyToken, authJwt.isTeacher],
    controller.remove
  );
};
