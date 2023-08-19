const { authJwt, verifyUser } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept",
      'Access-Control-Allow-Credentials',
    );
    next();
  });

  app.get(
    '/user',
    [authJwt.verifyToken],
    controller.userInfo
  );

  app.put(
    "/user",
    [authJwt.verifyToken, verifyUser.checkDuplicateEmail],
    controller.updateUser
  );
};