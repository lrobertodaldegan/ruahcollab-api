const express = require("express");
 
const app = express();
 
// parse requests of content-type - application/json
app.use(express.json({limit:'50mb'}));
 
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true, limit:'50mb' }));
 
//mongoose
const db = require("./app/models");
const Role = db.role;
 
const dbConfig = require("./app/config/db.config");
 
db.mongoose
  .connect(`mongodb://${dbConfig.USER}:${dbConfig.PASS}@${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });
 
function initial() {
  Role.estimatedDocumentCount()
    .then((count) => {
      if (count === 0) {
        new Role({
          name: "voluntair"
        }).save()
          .then(() => {
            console.log("added 'voluntair' to roles collection");
          })
          .catch(err => {
            if (err)
              console.log("error", err);
          });//criando role voluntair
 
        new Role({
          name: "institution"
        }).save()
          .then(() => {
            console.log("added 'institution' to roles collection");
          })
          .catch(err => {
            if (err)
              console.log("error", err);
          });//criando role instituicao
      }
    })
    .catch(err => {
      if (err)
        console.log("error", err);
    });
}
//mongoose
 
// simple route
app.get("/ruahcollab/", (req, res) => {
  res.json({ message: "Welcome to ruachcollab application." });
});
 
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://rc.acaodoespirito.com.br');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,UserAgent,X-Requested-With,Accept');
  res.header('Access-Control-Allow-Credentials', true);
 
  next();
});
 
// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/demand.routes')(app);
require('./app/routes/subscription.routes')(app);
 
// set port, listen for requests
const PORT = 21017;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});