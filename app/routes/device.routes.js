const { authJwt, verifyUser } = require("../middlewares");
const controller = require("../controllers/device.controller");

module.exports = function(app) {
  app.get(
    '/ruahcollab/user/devices',
    [authJwt.verifyToken],
    controller.userDevices
  );

  app.post(
    '/ruahcollab/user/device',
    [authJwt.verifyToken],
    controller.deviceValidation
  );
};