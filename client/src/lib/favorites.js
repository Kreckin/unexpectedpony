import config from './config.js';

//fetch is fickle so I had to use this new Header thing-a-ma-jig
const myHeaders = new Headers();
//append the content type we're sending up
myHeaders.append('Content-Type', 'application/json');

const favorites = {
    get: (userID) => {
      return new Promise((resolve, reject) => {
      //sends a fetch request to the url with the ID
      fetch(`${config.apiUrl}/users/${userID}/favorites`)
        .then((response) => {
          console.log('response from server on get favorites', response);
          return response.json();
        })
        //returns an array of objects that the user has favorited
        .then((data) => resolve(distanceGetter(data)))
        .catch((err) => reject('Error in get favorites', err));
      });
    },
    add: (userID, spotID) => {
      //a postConfig object that tells the fetch function what to do
      const postConfig = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify({ spotID: spotID }),
      };
      return new Promise((resolve, reject) => {
        fetch(`${config.apiUrl}/users/${userID}/favorites/add`, postConfig)
          .then((response) => {
            console.log(response);
          }).catch(error => console.log(error));
      });
    },
    remove: (userID, spotID) => {
      //a postConfig object that tells the fetch function what to do
      const postConfig = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify({ spotID }),
      };
      return new Promise((resolve, reject) => {
        fetch(`${config.apiUrl}/users/${userID}/favorites/remove`, postConfig)
              .then((response) => {
                console.log(response);
                resolve(response);
              }).catch((error) => {
                console.log(error);
                reject(error);
              });
        }
      );
    },
    checkIfFavorite: (userID, spotID) => {
      return new Promise((resolve, reject) => {
        fetch(`${config.apiUrl}/users/${userID}/favorites/${spotID}`)
          .then((response) => {
            console.log(response);
          }).catch(error => console.log(error));
      });
    }
  };

  function distanceGetter(data) {
    if (data.length === 0) { return []; }
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((position, err) => {
          if (err) {
            console.log('Err getting current postion in moveMapToCurrentPostion', err);
            reject(err);
          } else {
              data.forEach((item) => {
               item.distance = distance(item.latitude, item.longitude, position.coords.latitude, position.coords.longitude);
              });
              resolve(data);
          }
      });
    });
}

function distance(lat1, lon1, lat2, lon2) {
  const radlat1 = Math.PI * lat1 / 180;
  const radlat2 = Math.PI * lat2 / 180;
  const theta = lon1 - lon2;
  const radtheta = Math.PI * theta / 180;
  let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist);
  dist = dist * 180 / Math.PI;
  dist = dist * 60 * 1.1515;
  return dist;
}

export default favorites;
