const neo4j = require('neo4j-driver').v1;
const db = require('seraph')(require('./config.js').graph)
const model = require('seraph-model');
fergergergerg
const Spot = model(db, 'Spot');
const User = model(db, 'User');
const Category = model(db, 'Categories');

// TODO: add validation
// model.on('validate', validateAge);
module.exports = {
  spots: {
    get: function(params){
      return new Promise(function(resolve, reject){
        Spot.findAll(function (err, allOfTheseModels) {
          if (err) reject(err)
          else resolve (allOfTheseModels)
        });
      })
    },
    post: function(obj) {
      return new Promise(function (resolve, reject) {
        Spot.save(obj, function (err, savedObject) {
          if (err) reject(err)
          else resolve (savedObject)
        })
      })
    }
  },

  users: {
    get: function(params){
      return new Promise(function(resolve, reject){
        User.findAll(function (err, allOfTheseModels) {
          if (err) reject(err)
          else resolve (allOfTheseModels)
        });
      })
    },
    post: function(obj) {
      return new Promise(function (resolve, reject) {
        User.save(obj, function (err, savedObject) {
          if (err) reject(err)
          else resolve (savedObject)
        })
      })
    }
  },

  categories: {
    get: function(params){
      return new Promise(function(resolve, reject){
        Category.findAll(function (err, allOfTheseModels) {
          if (err) reject(err)
          else resolve (allOfTheseModels)
        });
      })
    },
    post: function(obj) {
      return new Promise(function (resolve, reject) {
        Category.save(obj, function (err, savedObject) {
          if (err) reject(err)
          else resolve (savedObject)
        })
      })
    }
  }
}
