const layout = require('./layout');
const constructorMethod = app => {
    app.use("/", layout);

    app.use("*", (req, res) => {
        res.status(404).json({error:'Not found'});
      });
};
module.exports = constructorMethod;