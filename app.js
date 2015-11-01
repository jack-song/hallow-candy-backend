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

var db = require('./model')(sequelize).db;

sequelize.sync();

sequelize
    .authenticate()
    .complete(function(err) {
        if (!!err) {
            console.log('Unable to connect to the database:', err)
        } else {
            console.log('Connection has been established successfully.')
        }
    })
 
 // Configuration
app.use(express.static(__dirname + '/public'));
app.use(connect.cookieParser());
app.use(connect.logger('dev'));
app.use(connect.bodyParser());
 
app.use(connect.json());
app.use(connect.urlencoded());
require('./components/routes.js')(app, db);
 
 
app.listen(port);
console.log('The App runs on port ' + port);