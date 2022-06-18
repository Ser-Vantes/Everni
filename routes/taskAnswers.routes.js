const { authJwt } = require("../middleware");
const controller = require("../controllers/taskAnswers.controller");
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/taskAnswers/", [authJwt.verifyToken], controller.create);
  app.get("/api/taskAnswers/:id", [authJwt.verifyToken], controller.findById);
  app.get(
    "/api/taskAnswers/task/:taskId",
    [authJwt.verifyToken],
    controller.getByTaskId
  );
  app.get(
    "/api/taskAnswers/discipline/:disciplineId",
    [authJwt.verifyToken],
    controller.getByDisciplineId
  );
  // app.get(
  //   "/api/taskAnswers/user/:disciplineId",
  //   [authJwt.verifyToken],
  //   controller.getByUserAndDisciplineId
  // );
  app.get(
    "/api/taskAnswers/user/:userId",
    [authJwt.verifyToken],
    controller.getByUserId
  );
  app.patch("/api/taskAnswers/:id", [authJwt.verifyToken], controller.update);
  app.delete(
    "/api/taskAnswers/:id",
    [authJwt.verifyToken, authJwt.isTeacher],
    controller.remove
  );
};
