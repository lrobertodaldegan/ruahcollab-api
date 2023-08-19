const { verifyUser } = require("../middlewares");
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
    "/auth/v/signup",
    [
      verifyUser.checkDuplicateEmail,
    ],
    controller.voluntairSignUp
  );

  app.post(
    "/auth/i/signup",
    [
      verifyUser.checkDuplicateEmail,
    ],
    controller.institutionSignUp
  );

  app.post("/auth/signin", controller.signin);
  app.post("/auth/signout", controller.signout);
};