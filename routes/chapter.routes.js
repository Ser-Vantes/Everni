const { authJwt } = require("../middleware");
const controller = require("../controllers/chapters.controllers");
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/chapter/",
    [authJwt.verifyToken, authJwt.isTeacher],
    controller.create
  );
  app.get(
    "/api/chapter/:id",
    [authJwt.verifyToken],
    controller.findByChapterId
  );
  app.get(
    "/api/chapter/discipline/:disciplineId",
    [authJwt.verifyToken],
    controller.getByDisciplineId
  );
  app.patch(
    "/api/chapter/addLecture/:id",
    [authJwt.verifyToken],
    controller.addChapterLecture
  );
  app.patch(
    "/api/chapter/deleteLecture/:id",
    [authJwt.verifyToken],
    controller.deleteChapterLecture
  );
  app.patch(
    "/api/chapter/addTask/:id",
    [authJwt.verifyToken],
    controller.addChapterTask
  );
  app.patch(
    "/api/chapter/deleteTask/:id",
    [authJwt.verifyToken],
    controller.deleteChapterTask
  );
  app.patch(
    "/api/chapter/:id",
    [authJwt.verifyToken, authJwt.isTeacher],
    controller.update
  );
  app.delete(
    "/api/chapter/:id",
    [authJwt.verifyToken, authJwt.isTeacher],
    controller.remove
  );
};
