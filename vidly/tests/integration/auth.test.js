const {Genre} = require('../../models/genre');
const {User} = require('../../models/user');
const request = require('supertest');
const auth = require('../../middleware/auth');
let server;

describe ('auth middleware', () => {
    
    let token;
    
    const exec = () => {
        return request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({name: 'genre1'});
        }
        
        beforeEach(() => {
            token = new User().generateAuthToken();
            server = require('../../index');
        });
        afterEach(async () => {
            server.close();
            await Genre.deleteMany({});
        });

    it('should return 401 if no token is provided', async () => {
        token = '';

        const res = await exec();

        expect(res.status).toBe(401)
    })
    it('should return 400 if an invalid token is provided', async () => {
        token = 'a';

        const res = await exec();

        expect(res.status).toBe(400);
    })
    it('should return 200 if a valid token is provided', async () => {
        const res = await exec();

        expect(res.status).toBe(200);
    })
})