const path = require('path');
const fs = require('fs');
const express = require('express');
const db = require('./db');
const bodyParser = require('body-parser');
const cloudinary = require('cloudinary'); // stores images
const request = require('request');

if (!process.env.cloud_name) {
  cloudinary.config(require('./config').cloudinary);
} else {
  const deploy = {
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
  };
  cloudinary.config(deploy);
}

const multer = require('multer'); // Node.js middleware for handling `multipart/form-data`

const upload = multer({ dest: 'temp/' }); // set temp location of new files

const app = express();

// ----- MIDDLEWARE -----
app.use(express.static(path.join(__dirname, '/../web/public/')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => { // print out incoming requests
    console.log('---------');
    console.log('Received', req.method, req.url);
    next();
});

// ----- ROUTES -----
app.get('/', (req, res) => {
    res.sendFile(path.resolve(path.join(__dirname, '/../web/public/index.html')));
});

app.get('/spots', (req, res) => {
  db.spots.get(req.query)
    .then((resolve) => {
      console.log('sending', resolve);
      res.send(resolve);
    })
    .catch((reject) => {
      console.log('rejecting with', reject);
      res.status(500).send(reject);
    });
});

// TODO below
// app.get('/spots/:spotId', function (req, res) {
//   db.spots.get(req.params, function(err, data){
//     res.send(data);
//   })
// })

app.post('/spots', upload.single('spot_image'), (req, res) => {
  //we parse the latitude and longitude we get here so we save a number in our database
  req.body.categories = JSON.parse(req.body.categories);
  req.body.latitude = parseFloat(req.body.latitude);
  req.body.longitude = parseFloat(req.body.longitude);
  if (req.file !== undefined) {
    // send spot photo to cloudinary
    cloudinary.uploader.upload(req.file.path, (result) => { 
      // delete file from server
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error('Error on image delete:', err); 
        } else {
          const postObj = req.body;
          postObj.img_url = result.secure_url;
          db.spots.post(req.body)
            .then((resolve) => {
              console.log('sending', resolve);
              res.status(201).send(resolve);
            })
            .catch((reject) => {
              console.log('rejecting with', reject);
              res.status(500).send(reject);
            });
        }
      });
    });
  } else {
    res.status(400).send('Spots require images');
  }
});

app.get('/spots/visited/:uid/:sid', (req, res) => {
  console.log('params, ', req.params);
  db.spots.visited(parseFloat(req.params.uid), parseFloat(req.params.sid))
    .then((resolve) => {
      console.log('sending', resolve);
      res.send(resolve);
    })
    .catch((reject) => {
      console.log('rejecting with', reject);
      res.status(500).send(reject);
    });
});

app.get('/categories', (req, res) => {
  db.categories.get()
    .then((resolve) => {
      console.log('sending', resolve);
      res.send(resolve);
    })
    .catch((reject) => {
      console.log('rejecting with', reject);
      res.status(500).send(reject);
    });
});

app.post('/categories', (req, res) => {
  db.categories.post(req.body)
    .then((resolve) => {
      console.log('sending', resolve);
      res.send(resolve);
    })
    .catch((reject) => {
      console.log('rejecting with', reject);
      res.status(500).send(reject);
    });
});

app.get('/users/:id', (req, res) => {
  const id = req.params.id;
  db.users.get(id)
    .then((resolve) => {
      console.log('sending', resolve);
      res.send(resolve);
    })
    .catch((reject) => {
      console.log('rejecting with', reject);
      res.status(500).send(reject);
    });
});

app.post('/users', (req, res) => {
  db.users.post(req.body)
    .then((resolve) => {
      console.log('sending', resolve);
      res.send(resolve);
    })
    .catch((reject) => {
      console.log('rejecting with', reject);
      res.status(500).send(reject);
    });
});

app.get('/upvote/:uid/:sid', (req, res) => {
  console.log('req.params', req.params);
  db.votes.upVote(parseFloat(req.params.uid), parseFloat(req.params.sid))
    .then((resolve) => {
      console.log('sending', resolve);
      res.send(resolve);
    })
    .catch((reject) => {
      console.log('rejecting with', reject);
      res.status(500).send(reject);
    });
});

app.get('/downvote/:uid/:sid', (req, res) => {
  db.votes.downVote(parseFloat(req.params.uid), parseFloat(req.params.sid))
    .then((resolve) => {
      console.log('sending', resolve);
      res.send(resolve);
    })
    .catch((reject) => {
      console.log('rejecting with', reject);
      res.status(500).send(reject);
    });
});

app.get('/mehvote/:uid/:sid', (req, res) => {
  db.votes.mehVote(parseFloat(req.params.uid), parseFloat(req.params.sid))
    .then((resolve) => {
      console.log('sending', resolve);
      res.send(resolve);
    })
    .catch((reject) => {
      console.log('rejecting with', reject);
      res.status(500).send(reject);
    });
});

app.get('/fetchLatLong/:address', (req, res) => {
  const mapKey = process.env.mapKey || require('./config').maps.mapKey;
  const address = req.params.address;
  const url = 'https://maps.googleapis.com/maps/api/geocode/json?';
  request(`${url}&address=${address}&key=${mapKey}`, (err, response, body) => {
    if (err) res.status(500).send(err);
    if (!err && response.statusCode === 200) {
      res.send(body);
    }
  });
});

app.get('/users/:userID/favorites', (req, res) => {
  db.favorites.get(req.params.userID, req.params.spotID)
    .then((resolve) => {
      console.log('sending', resolve);
      res.send(resolve);
    })
    .catch((reject) => {
      console.log('rejecting with', reject);
      res.status(500).send(reject);
    });
});

app.get('/users/:userID/favorites/:spotID', (req, res) => {
  db.favorites.get(req.params.userID, req.params.spotID)
    .then((resolve) => {
      console.log('sending', resolve);
      res.send(resolve);
    })
    .catch((reject) => {
      console.log('rejecting with', reject);
      res.status(500).send(reject);
    });
});

app.post('/users/:userID/favorites/add', (req, res) => {
  db.favorites.add(req.params.userID, req.body.spotID)
    .then((resolve) => {
      console.log('add sending', resolve);
      res.send(resolve);
    })
    .catch((reject) => {
      console.log('add rejecting with', reject);
      res.status(500).send(reject);
    });
});

app.post('/users/:userID/favorites/remove', (req, res) => {
  db.favorites.remove(req.params.userID, req.body.spotID)
    .then((resolve) => {
      console.log('sending', resolve);
      res.send(resolve);
    })
    .catch((reject) => {
      console.log('rejecting with', reject);
      res.status(500).send(reject);
    });
});


// ----- LISTEN -----
const port = process.env.PORT || 4040;
app.listen(port);
console.log('Listening on port ' + port);

