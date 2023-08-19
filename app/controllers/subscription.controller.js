const db = require("../models");
const Subscription = db.subscription;
const Voluntair = db.user;
const Demand = db.demand;

const status = {
  ACCEPTED:'aceito',
  PENDING:'pendente'
}

const errorHandler = (err, res) => {
  if (err) {
    console.log(err);
    res.status(500).send({ message:  'Ops!' });
    return;
  }
}

exports.submitSubscription = (req, res) => {
  Demand.findById(req.body.demandId).exec()
  .then(demand => {
    if(!demand){
      res.status(404).send({message:'Demand not found!'});
    } else {
      //verificando se demanda aceita novas inscrições
      Subscription.find({demand:demand._id}).exec()
      .then(subs => {
        let subExistent = subs.filter(s => `${s.voluntair}` === `${req.userId}`);

        if(subExistent && subExistent.length > 0){
          res.status(400).send({message:'You are subscribed already!'});
        } else {
          if(subs.length < demand.maxSubscriptions){//aceita sim
            //verificando se voluntário informado é válido
            Voluntair.findById(req.userId).exec()
            .then(voluntair => {
              if(!voluntair){
                res.status(404).send({message:'Voluntair not found!'});
              } else {//é válido sim
                const subscription = new Subscription({
                  date: new Date(),
                  status: status.PENDING,
                  demand: demand._id,
                  voluntair: voluntair._id
                });
    
                subscription.save()
                .then(subscription => {
                  res.status(201).send({message:`Subscription sent successfully!`});
                })
                .catch(err => errorHandler(err, res));
              }
            })
            .catch(err => errorHandler(err, res));
          } else {
            res.status(400).send({message:`Demand doesn't accepts new subscriptions anymore!`});
          }
        }
      })
      .catch(err => errorHandler(err, res));
    }
  })
  .catch(err => errorHandler(err, res));
}

exports.cancelSubscription = (req, res) => {
  Subscription.findById(req.params['subscriptionId']).exec()
  .then(subscription => {
    //verifica se a inscricao existe e só deleta ela se estiver relacionada ao voluntario autenticado
    if(subscription){
      if(subscription.status === status.ACCEPTED) {
        res.status(400).send({message:'Subscription cannot be canceled, because it was accepted already!'})
      } else {
        if(`${subscription.voluntair}` === `${req.userId}`){
          Subscription.deleteOne({_id: subscription._id})
          .then(() => {
            res.status(200).send({message:`Subscription (${req.params['subscriptionId']}) canceled!`});  
          }).catch(err => errorHandler(err, res));
        } else {
          res.status(404).send({message:'Subscription not found for this voluntair!'});
        }
      }
    } else {
      res.status(200).send();
    }
  })
  .catch(err => errorHandler(err, res));
}

exports.acceptSubscription = (req, res) => {
  Subscription.findById(req.params['subscriptionId']).populate("demand").exec()
  .then(subscription => {
    //verifica se a inscricao existe e só aceita se ela estiver relacionada a instituicao autenticada
    if(subscription){
      if(`${subscription.demand.institution}` === `${req.userId}`){
        subscription.status = status.ACCEPTED;

        subscription.save().then(() => {
          res.status(200).send({message:`Subscription ${req.params['subscriptionId']} accepted!`});  
        }).catch(err => errorHandler(err, res));
      } else {
        res.status(404).send({message:'Demand of this subscription was not found for this institution!'});
      }
    } else {
      res.status(404).send();
    }
  })
  .catch(err => errorHandler(err, res));
}

exports.voluntairSubscriptions = (req, res) => {
//usuario voluntario logado ver oq ele se inscreveu
  Subscription.find({voluntair:req.userId}).populate({path:'demand',populate:{path:'institution'}}).exec()
  .then(subs => {
    if(subs){
      let result = [];

      subs.map(s => {
        result.push({
          id:s._id,
          date:s.date,
          status:s.status,
          demand:{
            id:s.demand._id,
            institution:{
              name: s.demand.institution.name,
              contactPhone: s.demand.institution.contactPhone,
              contactEmail: s.demand.institution.contactEmail,
              resume: s.demand.institution.resume,
              site: s.demand.institution.site,
              address: s.demand.institution.address,
              zipcode: s.demand.institution.zipcode,
              photos: s.demand.institution.photos,
            },
            title: s.demand.title,
            resume: s.demand.resume,
            recurrence: s.demand.recurrence,
          }
        });
      });

      res.status(200).send(result);
    } else {
      res.status(204).send();
    }
  })
  .catch(err => errorHandler(err, res));
}

exports.subscriptionsByInstitutionDemands = (req, res) => {
//usuario instituição logada ver oq outros se increveram em suas demandas
  let result = [];  

  Subscription.find().populate('voluntair')
    .populate({path:'demand', populate: {path:'institution'}}).exec()
    .then(subs => {
      if(subs){
        subs.map(s => {
          if(`${s.demand.institution._id}` === `${req.userId}`){
            result.push({
              id:s._id,
              date:s.date,
              status:s.status,
              voluntair: {
                name: s.voluntair.name,
                phone: s.voluntair.contactPhone,
                email: s.voluntair.contactEmail,
                resume: s.voluntair.resume,
              },
              demand:`${s.demand.title} - ${s.demand.recurrence}`
            });
          }
        });

        res.status(200).send(result);
      }
    })
    .catch(err => errorHandler(err, res));
}