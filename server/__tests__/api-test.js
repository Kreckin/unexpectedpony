const axios = require('axios')
const http = require('http')
describe('server side stuff',()=>{
it('returns 404', ()=> {
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