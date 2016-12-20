const axios = require('axios');
const server = require('../server.js');

describe('basic server stuff', () => {
  it('returns 404 on a fake path', () => {
    return axios.get('http://localhost:4040/sahdude').catch((error) => {
      console.log(error)
      expect(error.response.status).toBe(404);
    });
  });
  it('returns 200 on real path', () => {
    return axios.get('http://localhost:4040/').then((response) => {
      console.log(response)
      expect(response.status).toBe(200);
    });
  });
});
describe('database paths', () => {
  it(' /spots should return something', () => {
    return axios.get('http://localhost:4040/spots').then((response) => {
      expect(response.data.length).toBeTruthy();
      //console.log(response.data)
    }).catch((error) => console.log(error));
  });
  // it('/categories should return something',()=>{
  //   return axios.get('http://localhost:4040/categories').then((response)=>{
  //     expect(response.data.length).toBeTruthy()
  //   }).catch((error)=>console.log(error))
  // })
  // it('/users should return something',()=>{
  //   return axios.get('http://localhost:4040/users').then((response)=>{
  //     expect(response.data.length).toBeTruthy();
  //   }).catch((error)=>console.log(error))
  // })
});
  //process.exitCode = 1;
