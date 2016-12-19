var getSpots = (callback) => {
//sends off an api request with options we pass in, this gets the closest address to our lat & long
  fetch(`http://localhost:5050/spots`).then((response)=>{
    callback(response.data)
  })
};


export default getSpots