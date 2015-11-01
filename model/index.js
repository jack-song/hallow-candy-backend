var Sequelize = require('sequelize-mysql').sequelize;
var config = require('../config');

module.exports = function(sequelize) {

  db = {};

  db.image = sequelize.define('image', {
    name: {
      type:Sequelize.STRING,
      default: "Hello"
    },
    lat: {
      type:Sequelize.STRING,
      default: "World"
    },
    lon: {
      type:Sequelize.STRING,
      default: "Julie"
    }
  });

  return {
      db : db
  };
}
