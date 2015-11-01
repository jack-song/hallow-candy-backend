var Sequelize = require('sequelize-mysql').sequelize;
var config = require('../config');

module.exports = function(sequelize) {

  db = {};

  db.image = sequelize.define('image', {
    name: Sequelize.STRING,
    lat: Sequelize.FLOAT,
    lon: Sequelize.FLOAT
  });

  return {
      db : db
  };
}
