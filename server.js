const mongoose = require('mongoose');
const express = require('express');
require('dotenv').config();
const passport = require("passport");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

// const MONGO_URI = process.env.MONGO_URI
const MONGO_URI = 'mongodb://localhost/blogdb'

mongoose
  .connect(MONGO_URI,{ useNewUrlParser: true,useUnifiedTopology: true })
  .then(() => console.log("Mongo Connection successful"))
  .catch(err => console.log("err"));

mongoose.set("useFindAndModify", false);
mongoose.Promise = global.Promise;

app.use(passport.initialize());
require("./middleware/passport")(passport);
app.use("/api/users/", require("./routes/api/users"));
app.use("/api/posts/", require("./routes/api/posts"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>console.log(`Server listening on port ${PORT}`))