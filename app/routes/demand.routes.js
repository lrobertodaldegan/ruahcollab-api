const { authJwt, verifyUser } = require("../middlewares");
const controller = require("../controllers/demand.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      'Access-Control-Allow-Credentials',
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/demand", 
    [authJwt.verifyToken],
    controller.demands
  );

  app.get(
    "/demand/institution", 
    [authJwt.verifyToken, verifyUser.justInstitution],
    controller.institutionDemands
  );

  app.post(
    "/demand",
    [authJwt.verifyToken, verifyUser.justInstitution],
    controller.newDemand
  );

  app.put(
    "/demand/:demandId",
    [authJwt.verifyToken, verifyUser.justInstitution],
    controller.updateDemand
  );

  app.delete(
    "/demand/:demandId",
    [authJwt.verifyToken, verifyUser.justInstitution],
    controller.deleteDemand
  );
};