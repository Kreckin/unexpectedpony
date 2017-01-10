const deploy = !process.env.server ? require('./config').graph_local : { server: process.env.server, user: process.env.user, pass: process.env.pass }; 
const db = require('seraph')(deploy);
const model = require('seraph-model');

const Spot = model(db, 'Spot');
Spot.useTimestamps();
const User = model(db, 'User');
User.useTimestamps();
const Category = model(db, 'Categories');

const spotUpdater = require('./controllers/spotUpdater');

// ------ SPOT VALIDATION ------
// this will validate Spot whenever its updated/saved, anything not in this list will be removed 
Spot.schema = {
  title: { type: String, required: true },
  categories: { type: Array, required: false },
  img_url: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  upvotes: { type: Number, default: 1 },
  downvotes: { type: Number, default: 0 },
  mehvotes: { type: Number, default: 0 }, 
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
  } else if (!spot.categories.length) {
    callback('enter some categories');
  } else {
    callback();
  }
};

Spot.on('validate', validateSpot);

// ------ GEO VALIDATION? ------
// adds the spot to the 'geom' layer after save
const addSpotToGeomLayerAfterSave = function (spot) { 
// TODO look into using db.query rather query from than seraph-model
  Spot.query(`MATCH (n:Spot) WHERE id(n)=${spot.id}
              CALL spatial.addNode("geom", n)
              YIELD node`, (err) => {
    if (err) {
      console.log('Err in addSpotToGeomLayerAfterSave', err);
    }
  });
};

//Spot.on('afterSave', addSpotToGeomLayerAfterSave);
//------ USER VALIDATION ------
User.schema = {
  facebookID: { type: String, required: true },
};

module.exports = {
  spots: {
    get: (query) => {
      if (query.lat === undefined) {
        return new Promise((resolve, reject) => {
          Spot.findAll((err, spots) => {
            if (err) reject(err);
            else resolve(spots);
          });
        });
      } else {
        return new Promise((resolve, reject) => {
          db.query('CALL spatial.withinDistance("geom", {coordinates}, {distance})',
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
          else {
            addSpotToGeomLayerAfterSave(savedObject);
            resolve(savedObject);
          }
        });
      });
    },
    visited: (uid, sid) => {
      return new Promise((resolve, reject) => {
        db.query(`MATCH (u:User) -[r:voted] -> (s:Spot) WHERE ID(u) = ${uid} AND ID(s) = ${sid} RETURN r`, (error, votes) => {
          if (error) { reject(error); }
          else { 
            console.log(Boolean(votes.length));
            resolve({value:Boolean(votes.length)}); } 
        });  
      });
    }
  },

  users: {
    get: (id) => {
      return new Promise((resolve, reject) => {
        User.read(id, ((err, user) => {
          if (err) reject(err);
          else {
            resolve(user[0]);
          }
        }));
      });
    },
    post: (obj) => {
      console.log('obj-----------', obj);
      return new Promise((resolve, reject) => {
        User.exists(obj, (err, doesExist) => {
          if (err) reject(err);
          else if (!doesExist) {
            User.save(obj, (error, savedObject) => {
              if (error) reject(error);
              else resolve(savedObject);
            });
          } else {
            resolve(module.exports.users.get(obj.id));
          }
        });
      });
    },
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
    update: (userID, spotID, voteType) => {
      return new Promise((resolve, reject) => {
        db.query(`MATCH (u:User) -[r:voted] -> (s:Spot) WHERE ID(u) = ${userID} AND ID(s) = ${spotID} RETURN r`, (error, relationship) => {
          if (error) { reject(error); } 
          else {
            console.log('relationship', relationship);
            if (relationship.length) {
              relationship[0].properties.voteType = voteType;
              db.rel.update(relationship[0], (error, savedObject) => {
                if (error) reject(error);
                else resolve(savedObject);
              });
            } else {
              db.relate(userID, 'voted', spotID, { voteType: voteType }, (err, res) => {
                if (err) reject(err);
                else resolve(res);
              });
            }
          }
        });
      });
    },
    updateSpotPercentage: (spotID) => {
      return new Promise((resolve, reject) => {
        db.relationships(spotID, 'in', 'voted', (err, votes) => {
           if (err) { reject(err);}
           else {
            const voteInfo = spotUpdater(votes);
            db.query(`MATCH (u:User) -[r:voted] -> (s:Spot) WHERE ID(s) = ${spotID} RETURN s`, (error, node) => {
              if (err) { reject(err); }
              else {
                node[0].upvotes    = voteInfo.ups;
                node[0].downvotes  = voteInfo.downs;
                node[0].mehvotes   = voteInfo.mehs;
                node[0].percentage = voteInfo.percent;

                db.save(node[0], (err, node) => {
                  resolve(node);
                });
              }
            });
           }   
        });
      });
    },
    mehVote: (userID, spotID) => { return module.exports.votes.update(userID, spotID, 'mehvote')
      .then(() => (module.exports.votes.updateSpotPercentage(spotID)));
    },
    upVote: (userID, spotID) => { return module.exports.votes.update(userID, spotID, 'upvote')
      .then(() => (module.exports.votes.updateSpotPercentage(spotID)));
    },
    downVote: (userID, spotID) => { return module.exports.votes.update(userID, spotID, 'downvote')
      .then(() => (module.exports.votes.updateSpotPercentage(spotID)));
    },
  },

  // votes: {
  //   upvote: (id) => {
  //     return new Promise((resolve, reject) => {
  //       Spot.where({ spot_id: id }, ((err, spot) => {
  //         if (err) reject(err);
  //         else {
  //           console.log('this is the spot!', spot);
  //           spot[0].upvotes++;
  //           spot[0].percentage = votePercentage(spot[0]);
  //           Spot.update(spot[0], (error, savedObject) => {
  //             console.log('this is the second spot, ', spot)
  //             if (error) reject(error);
  //             else resolve(savedObject);
  //             });
  //         }
  //       }));
  //     });
  //   },
  //   downvote: (id) => {
  //     return new Promise((resolve, reject) => {
  //       Spot.where({ spot_id: id }, (err, spot) => {
  //         spot[0].downvotes++;
  //         spot[0].percentage = votePercentage(spot[0]);
  //         Spot.update(spot[0], (error, savedObject) => {
  //           if (error) reject(error);
  //           else resolve(savedObject);
  //         });
  //       });
  //     });
  //   },
  //   mehvote: (id) => {
  //     return new Promise((resolve, reject) => {
  //       Spot.where({ spot_id: id }, (err, spot) => {
  //         console.log('spot[0]', spot[0]);
  //         spot[0].mehvotes++;
  //         spot[0].percentage = votePercentage(spot[0]);
  //         console.log(spot[0].percentage);
  //         Spot.update(spot[0], (error, savedObject) => {
  //           if (error) reject(error);
  //           else resolve(savedObject);
  //         });
  //       });
  //     });
  //   }
  // },

  favorites: {
    get: (userID, spotID) => {
      if (spotID === undefined) { // just a call to get all favs
        return new Promise((resolve, reject) => {
          db.query(`MATCH (u:User)-[r:favorite]->(s:Spot) WHERE ID(u) = ${userID} RETURN s LIMIT 100`, (error, favorites) => {
            if (error) reject(error);
            else resolve(favorites);
          });
        });
      } else {
        return new Promise((resolve, reject) => {
          db.query(`MATCH (u:User)-[r:favorite]->(s:Spot) WHERE ID(u) = ${userID} RETURN s LIMIT 100`, (error, favorites) => {
            if (error) reject(error);
            else resolve(favorites);
          });
        });
      }
    },
    add: (userID, spotID) => {
      return new Promise((resolve, reject) => {
        db.relationships(userID, 'all', 'favorite', (err, relationships) => {
          if (err) {
            console.log('error adding relationship', err);
            reject(err);
          } else {
            const relationship = relationships.filter((rel) => rel.end === parseInt(spotID, 10));
            if (!relationship.length) {
              db.relate(userID, 'favorite', spotID, {}, (err, relationship) => {
                if (err) reject(err);
                else resolve(relationship);
              });
            } else reject('Already a relationship with this node');
          }
        });
      });
    },
    remove: (userID, spotID) => {
      return new Promise((resolve, reject) => {
        db.relationships(userID, 'all', 'favorite', (err, relationships) => {
          const relationship = relationships.filter((rel) => rel.end === parseInt(spotID, 10));
          if (relationship.length) {
           db.rel.delete(relationship[0].id, (err) => {
             if (err) reject(err);
             else resolve('Relationship was deleted');
           });
          } else reject('No relationship with this node');
        });
      });
    }
  }
};
