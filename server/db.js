const neo4j = require('neo4j-driver').v1;
const deploy = !process.env.server ? require('./config').graph_local : { server: process.env.server, user: process.env.user, pass: process.env.pass }; 
const db = require('seraph')(deploy);
const model = require('seraph-model');

const Spot = model(db, 'Spot');
const User = model(db, 'User');
const Category = model(db, 'Categories');

// ------ VALIDATION ------
// this will validate Spot whenever its updated/saved, anything not in this list will be removed 
Spot.schema = {
  title: { type: String, required: true },
  category: { type: String, required: true },
  img_url: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  upvotes: { type: Number, default: 1 },
  downvotes: { type: Number, default: 0 },
  percentage: { type: Number, default: 1 },
  //we give it a "random" id since we can't use the built in one for some reason
  spot_id: { default: Math.floor(Math.random() * 10000000) }
};
// further improved validation, since empty strings would pass the schema check
const validateSpot = function (spot, callback) {
  if (!spot.title.length) {
    callback('enter a title');
    // even though schema says lat/long are required, could submit it empty before without this for some reason
  } else if (!spot.latitude || !spot.longitude) {
    callback('enter coordinates');
  } else if (!spot.img_url.length) {
    callback('enter a photo');
  } else if (!spot.category.length) {
    callback('enter a category');
  } else {
    callback();
  }
};

Spot.on('validate', validateSpot);

// ------ VALIDATION ------
// adds the spot to the 'geom' layer after save
const addSpotToGeomLayerAfterSave = function (spot) {
  console.log('adding spot to layer after save!', spot); //TODO look into using db.query rather query from than seraph-model
  Spot.query(`MATCH (n:Spot) WHERE id(n)=${spot.id}
              CALL spatial.addNode("geom", n)
              YIELD node`, (err) => {
    if (err) {
      console.log('Err in addSpotToGeomLayerAfterSave', err);
    }
  });
};

Spot.on('afterSave', addSpotToGeomLayerAfterSave);
//------ VALIDATION ------
User.schema = {
  Name: { type: String, required: true },
  Upvoted: { type: Array, default: [] },
  // Downvoted: { type: Array, default: [] },
  // SavedPlaces: { type: Array, default: [] },
  //we give it a "random" id since we can't use the built in one for some reason
  user_id: { default: Math.floor(Math.random() * 10000000) }
};

module.exports = {
  spots: {
    get: (query) => {
      if (query.lat === undefined) {
        console.log('is undefined', query)
        return new Promise((resolve, reject) => {
          Spot.findAll((err, spots) => {
            if (err) reject(err);
            else resolve(spots);
          });
        });
      } else {
        console.log('query',query)
        return new Promise((resolve, reject) => {
          Spot.query('CALL spatial.withinDistance("geom", {coordinates}, {distance}) YIELD node',
            { coordinates: { lat: parseFloat(query.lat), lon: parseFloat(query.lon) }, distance: parseFloat(query.distance) },
            (err, spots) => {
              if (err) reject(err);
              else resolve(spots);
          });
        });
      }
    },
    post: (obj) => {
      return new Promise((resolve, reject) => {
        Spot.save(obj, (err, savedObject) => {
          if (err) reject(err);
          else resolve(savedObject);
        });
      });
    },
  },

  users: {
    get: () => {
      return new Promise((resolve, reject) => {
        User.findAll((err, allOfTheseModels) => {
          if (err) reject(err);
          else resolve(allOfTheseModels);
        });
      });
    },
    post: (obj) => {
      return new Promise((resolve, reject) => {
        User.save(obj, (err, savedObject) => {
          if (err) reject(err);
          else resolve(savedObject);
        });
      });
    }
  },

  categories: {
    get: () => {
      return new Promise((resolve, reject) => {
        Category.findAll((err, allOfTheseModels) => {
          if (err) reject(err);
          else resolve(allOfTheseModels);
        });
      });
    },
    post: (obj) => {
      return new Promise((resolve, reject) => {
        Category.save(obj, (err, savedObject) => {
          if (err) reject(err);
          else resolve(savedObject);
        });
      });
    }
  },

  votes: {
    upvote: (id) => {
      return new Promise((resolve, reject) => {
        Spot.where({ spot_id: id }, ((err, spot) => {
          if (err) reject(err);
          else {
            console.log('this is the spot!', spot);
            spot[0].upvotes++;
            spot[0].percentage = spot[0].upvotes / (spot[0].upvotes + spot[0].downvotes);
            Spot.update(spot[0], (error, savedObject) => {
              console.log('this is the second spot, ', spot)
              if (error) reject(error);
              else resolve(savedObject);
              });
          }
        }));
      });
    },
    downvote: (id) => {
      return new Promise((resolve, reject) => {
        Spot.where({ spot_id: id }, (err, spot) => {
          spot[0].downvotes++;
          spot[0].percentage = spot[0].upvotes / (spot[0].upvotes + spot[0].downvotes);
          Spot.update(spot[0], (error, savedObject) => {
            if (error) reject(error);
            else resolve(savedObject);
          });
        });
      });
    }
  },
};
