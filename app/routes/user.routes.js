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
    '/ruahcollab/user',
    [authJwt.verifyToken],
    controller.userInfo
  );

  app.put(
    "/ruahcollab/user",
    [authJwt.verifyToken, verifyUser.checkDuplicateEmail],
    controller.updateUser
  );

  app.post(
    "/ruahcollab/user/forgot",
    [],
    controller.sendResetPassword
  );

  app.post(
    "/ruahcollab/user/code",
    [],
    controller.codeValidation
  );
};