const express = require('express');
const app = express();
const path = require('path')
const static = express.static(__dirname + '/public');
const configRoutes = require('./routes');
const exphbs = require('express-handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/public', static);
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname + '/views'));

configRoutes(app);
app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:3000"); 
});