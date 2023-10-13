const db = require("../models");
const Device = db.device;

const errorHandler = (err, res) => {
  if (err) {
    console.log(err);
    res.status(500).send({ message:  'Ops!' });
    return;
  }
}

exports.userDevices = (req, res) => {
  let filter = {
    path:'user',
    match: {_id: req.userId}
  }
  
  Device.find({}).populate(filter).exec().then(devices => {
    if(!devices || devices.length < 1){
      res.status(404).send({message:`0 devices found!`});
    } else {
      res.status(200).send(devices); 
    }
  }).catch(err => errorHandler(err, res));
}

exports.deviceValidation = (req, res) => {
  let filter = {
    path:'user',
    match: {_id: req.userId}
  }
  
  Device.find({deviceId:req.body.deviceId}).populate(filter).exec().then(devices => {
      res.status(200).send({valid:(!devices || devices.length < 1) ? false : true}); 
  }).catch(err => errorHandler(err, res));
}