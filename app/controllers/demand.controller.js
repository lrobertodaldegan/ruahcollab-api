const db = require("../models");
const Demand = db.demand;
const Subscription = db.subscription;
const Institution = db.user;

const errorHandler = (err, res) => {
  if (err) {
    console.log(err);
    res.status(500).send({ message:  'Ops!' });
    return;
  }
}

const formatReturn = (demand, subscriptions=0, status=null) => {
  let d = {
    id:demand._id,
    title:demand.title,
    resume:demand.resume,
    recurrence:demand.recurrence,
    maxSubscriptions: demand.maxSubscriptions,
    institutionId: demand.institution._id,
    status: status
  }

  d.subscriptions = subscriptions && subscriptions > 0 ? subscriptions : 0;

  return d;
}

exports.newDemand = (req, res) => {
  const demand = new Demand({
    title: req.body.title,
    resume: req.body.resume,
    recurrence: req.body.recurrence,
    maxSubscriptions: req.body.maxSubscriptions ? req.body.maxSubscriptions : 3
  });

  demand.save().then(demand => {
    Institution.findById(req.userId).exec().then(inst => {
      demand.institution = inst._id;

      demand.save().then(demand => {
        res.status(201).send({message:`Demand ${demand.title} created successfully!`});
      }).catch(err => errorHandler(err, res));
    }).catch(err => errorHandler(err, res));
  }).catch(err => errorHandler(err, res));
}

exports.updateDemand = (req, res) => {
  const d = new Demand({
    title: req.body.title,
    resume: req.body.resume,
    recurrence: req.body.recurrence,
    maxSubscriptions: req.body.maxSubscriptions ? req.body.maxSubscriptions : 3
  });

  Demand.findById(req.params['demandId']).exec()
  .then(demand => {
    if(d.title)
      demand.title = d.title;
    
    if(d.resume)
      demand.resume = d.resume;
    
    if(d.recurrence)
      demand.recurrence = d.recurrence;

    demand.save().then(demand => {
      res.status(200).send();
    }).catch(err => errorHandler(err, res));
  }).catch(err => errorHandler(err, res));
}

exports.deleteDemand = (req, res) => {
  Demand.findById(req.params['demandId']).exec()
  .then(demand => {
    if(demand){
      if(`${demand.institution}` === `${req.userId}`){
        Demand.deleteOne({_id: demand._id})
        .then(() => {
          res.status(200).send({message:`Demand (${req.params['demandId']}) deleted!`});  
        }).catch(err => errorHandler(err, res));
      } else {
        res.status(404).send({message:'Demand not found for this institution!'});
      }
    } else {
      res.status(200).send();
    }
  })
  .catch(err => errorHandler(err, res));
}

exports.demands = (req, res) => {
//query parameters
  let searchTitle = req.query.title;

  let filter = {}

  if(searchTitle)
    filter = { "title": {$regex: `.*${searchTitle}.*`}};//like

  Demand.find(filter).populate("institution").exec()
  .then(async (demands) => {
    if(!demands){
      res.status(204).send();
    } else {
      let ds = [];

      let is = [];

      for(let i=0;i<demands.length;i++){
        let demand = demands[i];

        if(is.indexOf(demand.institution) < 0)
          is.push(demand.institution);

        let subs = await Subscription.find({demand:demand._id}).exec();
        
        if(subs.length < demand.maxSubscriptions){
          let userSub = subs.find(s => `${s.voluntair}` === `${req.userId}`);

          ds.push(
            formatReturn(demand, 
                          subs.length, 
                          userSub ? userSub.status : null));
        }
      }
      
      res.status(200).send({demands:ds, institutions:is});
    }
  })
  .catch(err => errorHandler(err, res));
}

exports.institutionDemand = (req, res) => {

  Demand.find({_id:req.params['demandId'], institution:req.userId}).populate("institution").exec()
  .then(demands => {
    if(!demands || demands.length < 1){
      res.status(204).send();
    } else {
      let demand = demands[0];

      Subscription.find({demand:demand._id}).populate('voluntair').exec()
      .then(subs => {
        if(subs && subs.length > 0){
          demand = formatReturn(demand, subs.length);

          demand.subscriptions = subs;
        }

        res.status(200).send(demand);
      });
    }
  })
  .catch(err => errorHandler(err, res));
}

exports.institutionDemands = (req, res) => {
  Demand.find({institution:req.userId}).populate("institution").exec()
  .then(async demands => {
    if(!demands){
      res.status(204).send();
    } else {
      let result = [];

      for(let i=0; i < demands.length; i++){
        let demand = demands[i];

        let subs = await Subscription.find({demand:demand._id}).exec();

        let d = formatReturn(demand, subs.length);
        d.id = demand._id;

        result.push(d);
      }

      res.status(200).send(result);
    }
  })
  .catch(err => errorHandler(err, res));
}