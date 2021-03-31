const request = require('supertest');
const app = require('../app');
describe('Valid Login check', () => {
    it('should test for valid login id and password', async () => {
        const res = await request(app)
        .post('/api/login')
        .send({
            email:'dkk@gmail.com',
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
            email:'dkk@gmail.com',
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
        .set({authorization:`Bearer dsnanfnan`})
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('error');
    })
})

describe('Invalid auth token check', () => {
    it('should test for access without valid auth token', async () =>{
        const res = await request(app)
        .get('/api/orders')
        .set({authorization:`Bearer dsnanfnan`})
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('error');
    })
})

describe('Invalid auth token check', () => {
    it('should test for access without valid auth token', async () =>{
        const res = await request(app)
        .get('/api/expense_report')
        .set({authorization:`Bearer dsnanfnan`})
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('error');
    })
})

describe('Valid auth token check', ()=>{
    it('should test for access with valid auth token', async()=>{
        const res = await request(app)
        .post('/api/login')
        .send({
            email:'dkk@gmail.com',
            password:'abcdefgh'
        })
        const authToken = res.body.token;
        const getUsersRes = await request(app)
        .get('/api/users')
        .set({authorization:`Bearer ${authToken}`})
        expect(getUsersRes.statusCode).toEqual(200);
    })
})