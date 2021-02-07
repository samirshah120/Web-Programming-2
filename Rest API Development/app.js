const express = require("express")
const app = express()
const configRoutes = require('./routes');

app.use(express.json()); //to read request body
let total = 0;
app.use(function (req, res, next) {
    total++;
    console.log("total requests made to server",total)
    next()
  });

app.use(function (req, res, next) {
    console.log('Request body:', req.body);
    console.log('Request url:', req.originalUrl);
    console.log("Http verb:",req.method);
    next()
  });
  const pathsAccessed = {};
  app.use(function(request, response, next) {
    if (!pathsAccessed[request.path]) pathsAccessed[request.path] = 0;
    pathsAccessed[request.path]++;
    console.log('There have now been ' + pathsAccessed[request.path] + ' requests made to ' + request.path);
    next();
  });
configRoutes(app); //configure routes

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});