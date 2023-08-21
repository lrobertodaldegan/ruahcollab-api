const { authJwt, verifyUser } = require("../middlewares");
const controller = require("../controllers/subscription.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept",
      'Access-Control-Allow-Credentials',
    );
    next();
  });
  //consultar inscricoes realizadas pelo voluntario
  app.get(
    "/ruahcollab/subscription", 
    [authJwt.verifyToken, verifyUser.justVoluntair],
    controller.voluntairSubscriptions
  );
  //consutlar inscricoes nas demandas da instituicao
  app.get(
    "/ruahcollab/subscription/institution", 
    [authJwt.verifyToken, verifyUser.justInstitution],
    controller.subscriptionsByInstitutionDemands
  );
  //nova inscricao
  app.post(
    "/ruahcollab/subscription",
    [authJwt.verifyToken, verifyUser.justVoluntair],
    controller.submitSubscription
  );
  //aceitar inscricao
  app.put(
    "/ruahcollab/subscription/:subscriptionId",
    [authJwt.verifyToken, verifyUser.justInstitution],
    controller.acceptSubscription
  );
  //cancelar inscricao
  app.delete(
    "/ruahcollab/subscription/:subscriptionId",
    [authJwt.verifyToken, verifyUser.justVoluntair],
    controller.cancelSubscription
  );
};