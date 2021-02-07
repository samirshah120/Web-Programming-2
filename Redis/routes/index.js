const tvmazeRoutes = require("./tvmaze")
const constructorMethod = app => {
    app.use("/", tvmazeRoutes);
    app.use("*", (req, res) => {
      res.sendStatus(404);
    });
  };
  module.exports = constructorMethod;