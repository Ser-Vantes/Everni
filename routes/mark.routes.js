const { authJwt } = require("../middleware");
const controller = require("../controllers/mark.controller");
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/mark/",
    [authJwt.verifyToken, authJwt.isTeacher],
    controller.create
  );
  app.get("/api/mark/:id", [authJwt.verifyToken], controller.findById);
  app.get(
    "/api/mark/user/:userId",
    [authJwt.verifyToken],
    controller.getByUserId
  );
  app.get(
    "/api/mark/discipline/:disciplineId",
    [authJwt.verifyToken],
    controller.getByDisciplineId
  );
  app.patch(
    "/api/mark/:id",
    [authJwt.verifyToken, authJwt.isTeacher],
    controller.update
  );
  app.delete(
    "/api/mark/:id",
    [authJwt.verifyToken, authJwt.isTeacher],
    controller.remove
  );
};
