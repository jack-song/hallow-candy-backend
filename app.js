var express  = require('express');
var connect  = require('connect');
var app      = express();
var port     = process.env.PORT || 8080;

var dbParams  = require('./config').dbParams;
var Sequelize = require('sequelize-mysql').sequelize;

var sequelize = new Sequelize(dbParams.database, dbParams.user, dbParams.pass, {
    host: dbParams.host,
    port: dbParams.port,
    socketPath: dbParams.socketPath,
    dialect: dbParams.dialect
});

sequelize.sync();

var db = require('./components/model')(sequelize).db;

// Configuration
app.use(express.static(__dirname + '/public'));
app.use(connect.cookieParser());
app.use(connect.logger('dev'));
app.use(connect.bodyParser());
 
app.use(connect.json());
app.use(connect.urlencoded());
 
// Routes
 
require('./components/routes.js')(app, db);
 
 
app.listen(port);
console.log('The App runs on port ' + port);