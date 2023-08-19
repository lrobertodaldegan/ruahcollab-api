const db = require("../models");
const User = db.user;

var bcrypt = require("bcryptjs");

const errorHandler = (err, res) => {
  if (err) {
    console.log(err);
    res.status(500).send({ message:  'Ops!' });
    return;
  }
}

exports.userInfo = (req, res) => {
  User.findById(req.userId).populate('role').exec()
      .then(user => {
        if(!user){
          res.status(404).send({ message: "User Not found." });
        } else {
          res.status(200).send({
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            contactPhone: user.contactPhone,
            contactEmail: user.contactEmail,
            resume: user.resume,
            site: user.site,
            address: user.address,
            zipcode: user.zipcode,
            photos: user.photos,
            role: user.role.name
          });
        }
      })
      .catch(err => errorHandler(err, res));
}

exports.updateUser = (req, res) => {
  User.findById(req.userId).exec()
      .then(user => {
        if (!user){
          res.status(404).send({ message: "User Not found." });
        } else {
          if(req.body.password && req.body.password != null)
            user.password = bcrypt.hashSync(req.body.password, 8);

          if(req.body.name && req.body.name != null)
            user.name = req.body.name;

          if(req.body.email && req.body.email != null)
            user.email = req.body.email;

          if(req.body.phone && req.body.phone != null)
            user.phone = req.body.phone;

          if(req.body.contactPhone && req.body.contactPhone != null)
            user.contactPhone = req.body.contactPhone;

          if(req.body.address && req.body.address != null)
            user.address = req.body.address;

          if(req.body.contactEmail && req.body.contactEmail != null)
            user.contactEmail = req.body.contactEmail;

          if(req.body.resume && req.body.resume != null)
            user.resume = req.body.resume;

          if(req.body.site && req.body.site != null)
            user.site = req.body.site;

          if(req.body.zipcode && req.body.zipcode != null)
            user.zipcode = req.body.zipcode;

          if(req.body.photos && req.body.photos != null 
                              && req.body.photos.length > 0){
            let photos = [];

            for(let i=0;i<req.body.photos.length;i++){
              photos.push(req.body.photos[i]);
            }

            user.photos = photos;
          }

          user.save().then(user => {
            res.status(200).send({ message: `User ${user.name} updated!` });
          }).catch(err => errorHandler(err, res));
        }
      })
      .catch(err => errorHandler(err, res));
}