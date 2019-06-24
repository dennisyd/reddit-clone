var exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const express = require('express')
const expressValidator = require('express-validator');
const app = express()
const posts = require('./controllers/posts');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());

// Set db
require('./data/reddit-db');

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.get('/', (req,res) => {
   res.render('home')
})
app.use('/posts', posts)

app.listen(3000, () => {
    console.log('App listening on port 3000!')
})
module.exports = app;
