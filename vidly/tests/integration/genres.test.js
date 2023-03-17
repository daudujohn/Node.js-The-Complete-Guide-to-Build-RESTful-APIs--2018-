const {Genre} = require('../../models/genre');
const {User} = require('../../models/user');
const request = require('supertest');
const { default: mongoose } = require('mongoose');
let server;


describe('/api/genres', () => {
    beforeEach(() => {
        server = require('../../index')
    });
    afterEach(async () => {
        await server.close();
        await Genre.deleteMany({});
    });

    describe('GET /', () => {
        it('should return all genres', async () => {
            await Genre.collection.insertMany([
                {name: 'genre1'}, 
                {name: 'genre2'}
            ]);
            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
        })
    })

    describe('GET /:id', () => {
        it('should return a genre if id is passed', async () => {
            const genre = new Genre({
                name: 'genre1'
            })
            await genre.save();
            
            const res = await request(server).get('/api/genres/' + genre._id)
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
        })

        it('should return 404 if invalid id is passed', async () => {        
            const res = await request(server).get('/api/genres/1234')
            expect(res.status).toBe(404);
        })
        it('should return 404 if no genre exists for the given id', async () => {        
            id = mongoose.Types.ObjectId();
            const res = await request(server).get('/api/genres/' + id);
            expect(res.status).toBe(404);
        })
    })

    
    describe ('PUT /:id', () => {
        let token;
        let name;
        let _id;

        const exec = async() => {
            return await request(server)
                .put('/api/genres/' + _id)
                .set('x-auth-token', token)
                .send({name: name});
        }
        beforeEach(() => {
            token = new User().generateAuthToken();
            name = 'genre1';
            _id = mongoose.Types.ObjectId();
        })

        it('should return 401 if client is not logged in', async() => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        })

        it('should return 404 if invalid id is passed', async() => {
            _id = '';

            const res = await exec();

            expect(res.status).toBe(404);
        })

        it('should return 400 if genre is less than 3 characters', async () => {
            name = 'a';

            const res = await exec();

            expect(res.status).toBe(400);
        })

        it('should return 400 if genre is more than 50 characters', async () => {
            name = new Array(52).join('a');

            const res = await exec();

            expect(res.status).toBe(400);
        })

        it('should return 404 if genre to be updated is not found', async () => {
            const res = await exec();

            expect(res.status).toBe(404);
        })

        it('should return 200 if genre has been updated', async () => {
            let genre = new Genre({
                name: name
            })
            await genre.save()
            
            _id = genre._id
            name = 'mygenre'
            const res = await exec();

            genre = await Genre.findByIdAndUpdate(genre._id, {
                name: name
            }, {new: true})

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', 'mygenre');
        })
    })

    describe('DELETE /:id', () => {

        let token;
        let _id;

        const exec = async() => {
            return await request(server)
                .delete('/api/genres/' + _id)
                .set('x-auth-token', token)
        } 

        beforeEach(() => {
            token = new User({isAdmin: true}).generateAuthToken();
            _id = mongoose.Types.ObjectId();
        })

        it('should return 401 if client is not authorized', async () => {
            token = '';

            const res = await exec();                
          
            expect(res.status).toBe(401)
        })

        it('should return 403 if the client is not an admin', async() => {
            token = new User({isAdmin: false}).generateAuthToken();

            const res = await exec();
          
            expect(res.status).toBe(403)
        })

        it('should return 404 if id is invalid', async() => {
            _id = '1';

            const res = await exec();
          
            expect(res.status).toBe(404)
        })

        it('should return 400 if genre is not found', async() => {
            const res = await exec();
          
            expect(res.status).toBe(400)
        })

        it('should return 200 if a valid genre is deleted', async() => {
            const genre = new Genre({
                name: 'genre1'
            })
            await genre.save();

            _id = genre._id;

            const res = await exec();
        //   
            expect(res.status).toBe(200);
        })
        it('should return deleted genre', async() => {
            const genre = new Genre({
                name: 'genre1'
            })
            await genre.save();

            _id = genre._id;

            const res = await exec();
          
            expect(res.body).toHaveProperty('_id')
            expect(res.body).toHaveProperty('name', 'genre1')
        })

    })

    describe ('POST /', () => {
        let token;
        let name;

        const exec = async () => {
                return await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({name: name});
        }

        beforeEach(() => {
            token = new User().generateAuthToken();
            name =  'genre1';
        })

        it('should return 401 if client is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        })
        it('should return 400 if genre is less than 3 characters', async () => {
            name = 'a';
            
            const res = await exec();

            expect(res.status).toBe(400);
        })
        it('should return 400 if genre is more than 50 characters', async () => {
            name = new Array(52).join('a');

            const res = await exec();

            expect(res.status).toBe(400);
        })
        it('should save genre if it is valid', async () => {

            const res = await exec();

            const genre = await Genre.find({name: 'genre1'})

            expect(genre).not.toBeNull();
        })
        it('should return the genre if it is valid', async () => {
            const res = await exec();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'genre1');
        })
    })

})