const mongoose = require("mongoose");
const express = require("express");
require("dotenv").config();
require("./middleware/passport.js");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Mongo Connection successful"))
  .catch((err) => console.error(err));

app.use("/api/users/", require("./routes/api/users"));
app.use("/api/posts/", require("./routes/api/posts"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
