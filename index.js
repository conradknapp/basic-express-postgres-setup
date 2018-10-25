const express = require("express");
const app = express();
const models = require("./models");

const PORT = 3000;

models.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
  });
});
