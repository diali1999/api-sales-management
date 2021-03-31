const request = require('supertest');
const app = require('../app');
describe('Login check', () => {
    it('should test for valid login id and password', async () => {
        const res = await request(app)
        .post('/api/login')
        .send({
            email:'harshitdxt3004@gmail.com',
            password:'abcdefgh'
        })
        expect(res.statusCode).toEqual(200)
    })
})

describe('Invalid Login check', () => {
    it('should test for valid login id and password', async () => {
        const res = await request(app)
        .post('/api/login')
        .send({
            email:'harshitdxt3004@gmail.com',
            password:'abcdef'
        })
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('error');
    })
})

describe('Invalid auth token check', () => {
    it('should test for access without valid auth token', async () =>{
        const res = await request(app)
        .get('/api/users')
        .send()
    })
})