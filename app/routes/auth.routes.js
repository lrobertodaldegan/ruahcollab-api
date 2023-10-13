const { verifyUser, authJwt } = require("../middlewares");
const controller = require("../controllers/auth.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      'Access-Control-Allow-Credentials',
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/ruahcollab/auth/v/signup",
    [
      verifyUser.checkDuplicateEmail,
    ],
    controller.voluntairSignUp
  );

  app.post(
    "/ruahcollab/auth/i/signup",
    [
      verifyUser.checkDuplicateEmail,
    ],
    controller.institutionSignUp
  );

  app.post(
    "/ruahcollab/auth/refresh",
    [
      authJwt.verifyToken,
    ],
    controller.refresh
  );

  app.post("/ruahcollab/auth/signin", controller.signin);
  app.post("/ruahcollab/auth/signout", controller.signout);
};