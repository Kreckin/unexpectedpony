const neo4j = require('neo4j-driver').v1;
const deploy = !process.env.server ? require('/config.js').graph : {server:process.env.server,user:process.env.user,pass:process.env.pass}; 
const db = require('seraph')deploy
const model = require('seraph-model');

const Spot = model(db, 'Spot');
const User = model(db, 'User');
const Category = model(db, 'Categories');

// TODO: add validation
// model.on('validate', validateAge);
module.exports = {
  spots: {
    get: function () {
      return new Promise((resolve, reject) => {
        Spot.findAll((err, allOfTheseModels) => {
          if (err) reject(err);
          else resolve(allOfTheseModels);
        });
      });
    },
    post: function(obj) {
      return new Promise((resolve, reject) => {
        Spot.save(obj, (err, savedObject) => {
          if (err) reject(err);
          else resolve(savedObject);
        });
      });
    },
  },

  users: {
    get: function() {
      return new Promise((resolve, reject) => {
        User.findAll((err, allOfTheseModels) => {
          if (err) reject(err)
          else resolve(allOfTheseModels);
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
