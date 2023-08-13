const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "bezkoder-session",
    keys: ["COOKIE_SECRET"], // should use as secret environment variable
    httpOnly: true
  })
);

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
app.get("/", (req, res) => {
  res.json({ message: "Welcome to ruachcollab application." });
});

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});