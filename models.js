var Sequelize = require('sequelize');

var config = require('config');
var dbConfig = config.get('dbConfig');
var sequelize = new Sequelize(dbConfig);

var db = {};

var Headline = sequelize.define('headline', {
  uuid: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    primaryKey: true
  },
  site: {
    type: Sequelize.TEXT
  },
  category: {
    type: Sequelize.TEXT
  },
  story_title: {
    type: Sequelize.TEXT
  },
  story_description: {
    type: Sequelize.TEXT
  },
  story_byline: {
    type: Sequelize.TEXT
  },
  story_byline_url: {
    type: Sequelize.TEXT
  },
  story_date: {
    type: Sequelize.TEXT
  },
  story_url: {
    type: Sequelize.TEXT, unique: true
  },
  third_party: {
    type: Sequelize.TEXT
  },
  network: {
    type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false 
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.Headline = Headline;

module.exports = db;

