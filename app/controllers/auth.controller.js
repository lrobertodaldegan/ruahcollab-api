const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const errorHandler = (err, res) => {
  if (err) {
    console.log(err);
    res.status(500).send({ message:  'Ops!' });
    return;
  }
}

exports.institutionSignUp = (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    site: req.body.site,
    contactEmail: req.body.contactEmail,
    contactPhone: req.body.contactPhone,
    password: bcrypt.hashSync(req.body.password, 8),
    resume: req.body.resume,
    zipcode: req.body.zipcode,
    address: req.body.address
  });

  user.save().then(user => {
    Role.findOne({ name: "institution" }).then(role => {
      user.role = role._id;

      user.save().then(user => {
        res.status(201).send({ message: `User ${user.name} was registered successfully!` });
      }).catch(err => errorHandler(err, res));
    }).catch(err => errorHandler(err, res));
  }).catch(err => errorHandler(err, res));
}

exports.voluntairSignUp = (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    contactEmail: req.body.email,
    contactPhone: req.body.phone,
    password: bcrypt.hashSync(req.body.password, 8),
    resume: req.body.resume,
  });

  user.save().then(user => {
    Role.findOne({ name: "voluntair" }).then(role => {
      user.role = role._id;

      user.save().then(user => {
        res.status(201).send({ message: `User ${user.name} was registered successfully!` });
      }).catch(err => errorHandler(err, res));
    }).catch(err => errorHandler(err, res));
  }).catch(err => errorHandler(err, res));
};

exports.signin = (req, res) => {
  User.findOne({email: req.body.email}).populate("role")
      .exec()
      .then(user => {
        if (!user)
          return res.status(404).send({ message: "User Not found." });

        var passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.password
        );

        if (!passwordIsValid)
          return res.status(401).send({ message: "Invalid Password!" });

        var authorities = `ROLE_${user.role.name.toUpperCase()}`;

        const token = jwt.sign({ id: user._id, role: authorities},
                                config.secret,
                                {
                                  algorithm: 'HS256',
                                  allowInsecureKeySizes: true,
                                  expiresIn: 3600,//1 hour
                                });
        req.session.token = token;//set-cookie

        res.status(200).send({
          id: user._id,
          role: authorities,
        });
    }).catch(err => errorHandler(err, res));
};

exports.signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({ message: "You've been signed out!" });
  } catch (err) {
    this.next(err);
  }
};