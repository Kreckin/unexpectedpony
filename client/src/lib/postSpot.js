import config from './config.js';

const postSpot = (data) => {
  //we make an object for the photo so the form knows how to read it
  const photo = {
    uri: `file://${data.uri}`,
    type: 'image/jpeg',
    name: 'photo.jpg',
  };
//where the magic happens, we simulate a form and add everything we're passed to this form
  const form = new FormData();
  
  if (data.title) {
    form.append('title', data.title);
  }
  if (data.description) {
    form.append('description', data.description);
  }
  if (data.category) {
    form.append('category', data.category);
  }
  if (data.latitude) {
    form.append('latitude', data.latitude);
  }
  if (data.longitude) {
    form.append('longitude', data.longitude);
  }
  if (data.uri){
    form.append('spot_image', photo);
  }

  //a postConfig object that tells the fetch function what to do
  const postConfig = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
     'Content-Type': 'multipart/form-data; boundary=6ff46e0b6b5148d984f148b6542e5a5d',
    },
    body: form,
  };
  //send a fetch rquest with our postConfig file, complete with a body that contains our simulated form
  fetch(`${config.apiUrl}/spots`, postConfig)
    .then((response) => {
      console.log(response);
    }).catch(error => console.log(error));
 };

export default postSpot;
