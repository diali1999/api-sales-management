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

describe('Invalid auth token check', () => {
    it('should test for access without valid auth token', async () =>{
        const res = await request(app)
        .get('/api/working_report')
        .set({authorization:`Bearer dsnanfnan`})
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('error');
    })
})

describe('Invalid auth token check', () => {
    it('should test for access without valid auth token', async () =>{
        const res = await request(app)
        .get('/api/qr')
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
        .get('/api/orders')
        .set({authorization:`Bearer ${authToken}`})
        expect(getUsersRes.statusCode).toEqual(200);
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
        .get('/api/expense_report')
        .set({authorization:`Bearer ${authToken}`})
        expect(getUsersRes.statusCode).toEqual(200);
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
        .get('/api/working_report')
        .set({authorization:`Bearer ${authToken}`})
        expect(getUsersRes.statusCode).toEqual(200);
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
        .get('/api/qr')
        .set({authorization:`Bearer ${authToken}`})
        expect(getUsersRes.statusCode).toEqual(200);
    })
})

describe('Valid auth token check', ()=>{
    it('should test for creation with valid auth token', async()=>{
        const res = await request(app)
        .post('/api/login')
        .send({
            email:'dkk@gmail.com',
            password:'abcdefgh'
        })
        const authToken = res.body.token;
        const getUsersRes = await request(app)
        .post('/api/users')
        .send({
            password: "ijklmnop",
            phone: "7004464600",
            firstName: "Anisha",
            lastName: "Pandey",
            email: "anishapandey135@gmail.com",
            DOB: "1999-11-19",
            role: "User",
            department: "Marketing agent",
            gender: "F",
            salary: "23200",
            DOJ: "2021-01-23"
        })
        .set({authorization:`Bearer ${authToken}`})
        expect(getUsersRes.statusCode).toEqual(200);
        
        const deleteUsersRes = await request(app)
        .delete(`/api/users/${getUsersRes.body.id}`)
        .set({authorization:`Bearer ${authToken}`})
        expect(deleteUsersRes.statusCode).toEqual(200);
    })
})

describe('Invalid auth token check', ()=>{
    it('should test for creation without valid auth token', async()=>{
        const res = await request(app)
        .post('/api/login')
        .send({
            email:'dkk@gmail.com',
            password:'abcdefgh'
        })
        const authToken = res.body.token;
        const getUsersRes = await request(app)
        .post('/api/expense_report')
        .send({
            type : "Food",
            expense: "70",
            date: "2021-03-10",
            remarks: "just testing"
        })
        .set({authorization:`Bearer ${authToken}`})
        expect(getUsersRes.statusCode).toEqual(401);
        expect(getUsersRes.text).toBe('Can\'t post!');
    })
})

describe('Invalid auth token check', ()=>{
    it('should test for creation without valid auth token', async()=>{
        const res = await request(app)
        .post('/api/login')
        .send({
            email:'dkk@gmail.com',
            password:'abcdefgh'
        })
        const authToken = res.body.token;
        const getUsersRes = await request(app)
        .post('/api/orders')
        .send({
            customer: "Diali Kundu",
            product: [
                { productName: "books" , quantity: "3"}
            ],
            date: "2021-04-01"
        })
        .set({authorization:`Bearer ${authToken}`})
        expect(getUsersRes.statusCode).toEqual(401);
        expect(getUsersRes.text).toBe('Can\'t post!');

    })
})
