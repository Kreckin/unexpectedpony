const axios = require('axios')

describe('basic server stuff',()=>{
it('returns 404 on a fake path', ()=> {
  return axios.get('http://localhost:4040/sahdude').catch((error)=>{
    expect(error.response.status).toBe(404)
  })
})
it('returns 200 on real path',()=>{
  return axios.get('http://localhost:4040/').then((response)=>{
    expect(response.status).toBe(200)
  })
})
})
describe('database paths',()=>{
  it('should return something',()=>{
    return axios.get('http://localhost:4040/spots').then((response)=>{
      console.log(response)
    }).catch((error)=>{console.log(error)})
  })
})