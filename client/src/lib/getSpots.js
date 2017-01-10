import config from './config.js';


const getSpots = (lat, lon, distance,location) => {
  return new Promise((resolve, reject) => {
    //sends a GET request to our server/spots
  fetch(`${config.apiUrl}/spots?lat=${lat}&lon=${lon}&distance=${distance}`)
    .then((response) => {
      //with fetch we gotta json it before we can use it
      //we then call imageGetter on the data, and then send it back to the app
      return response.json();
    })
    .then((data) => {
      return resolve(distanceGetter(data, location));
    })
    .catch((err) => {
      console.log('Error in get spots', err); 
      reject(err);
    });
  });
};
const distanceGetter = (data, location) => {
            data.forEach((item) => {
             item.node.distance = distance(item.node.latitude, item.node.longitude, location.latitude, location.longitude);
            });
            return data.map(item => item = item.node);
}
//this will go through all of our data, check the category and tag it with an icon to later be used

//this gives 
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
export default getSpots;
