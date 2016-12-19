const path = require('path');
const fs = require('fs');
const express = require('express');
const db = require('./db');
const bodyParser = require('body-parser');
const cloudinary = require('cloudinary'); // stores images
cloudinary.config(require('./config').cloudinary);
const multer = require('multer'); // Node.js middleware for handling `multipart/form-data`

const upload = multer({ dest: 'temp/' }); // set temp location of new files

const app = express();

// ----- MIDDLEWARE -----
app.use(express.static(path.join(__dirname, '/../web/public/')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => { // print out requests
    console.log('---------');
    console.log('Received', req.method, req.url);
    next();
});

// ----- ROUTES -----
app.get('/', (req, res) => {
    res.sendFile(path.resolve(path.join(__dirname, '/../web/public/index.html')));
});

app.get('/spots', (req, res) => {
  db.spots.get()
    .then((resolve) => {
      console.log('sending', resolve);
      res.send(resolve);
    })
    .catch((reject) => {
      console.log('rejecting with', reject);
      res.status(500).send(reject);
    });
});

app.post('/spots', upload.single('spot_image'), (req, res) => {
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

app.get('/users', (req, res) => {
  db.users.get()
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

// app.get('/spots/:spotId', function (req, res) {
//   db.spots.get(req.params, function(err, data){
//     res.send(data);
//   })
// })

// ----- LISTEN -----
const port = process.env.PORT || 4040;
app.listen(port);
console.log('Listening on port ' + port);