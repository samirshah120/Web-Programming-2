const moviesRoutes = require("./movies")

const constructorMethod = app => {
    app.use("/api/movies", moviesRoutes);
    app.use("*", (req, res) => {
      res.sendStatus(404);
    });
  };
  
  module.exports = constructorMethod;