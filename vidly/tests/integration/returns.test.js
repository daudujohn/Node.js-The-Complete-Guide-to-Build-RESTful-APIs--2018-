const moment = require('moment');
const {Rental} = require('../../models/rental');
const {User} = require('../../models/user');
const request = require('supertest');
const { default: mongoose } = require('mongoose');
const { Movie } = require('../../models/movie');


describe('/api/returns', () => {
    let server;
    let customerId;
    let movieId;
    let rental;
    let token;
    let movie;

    const exec = async() => {
        return await request(server)
        .post('/api/returns/')
        .set('x-auth-token', token)
        .send({customerId, movieId});
    }

    beforeEach(async() => {


        server = require('../../index');
        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();
        token = new User().generateAuthToken();
        

        await Rental.deleteMany({});
        await Movie.deleteMany({})

        movie = new Movie({
            _id: movieId, 
            title: 'abc', 
            genre: {name: '12345'}, 
            dailyRentalRate: 2, 
            numberInStock: 10
        })
        await movie.save();

        rental = new Rental({
            customer: {
                _id: customerId, 
                name: '123', 
                phone: '12345678'
            }, 
            movie: {
                _id: movieId, 
                title: 'abc', 
                dailyRentalRate: 2
            }
        })
        await rental.save();
    });

    afterEach(async () => {
        await server.close();
        await Rental.deleteMany({});
        await Movie.deleteMany({})
    });

    it('should return 401 if client is unauthorized', async () => {
        token = '';

        const res = await exec();

        expect(res.status).toBe(401);
    })

    it('should return 400 if customerId is not provided', async () => {
        customerId = '';

        const res = await exec();

        expect(res.status).toBe(400);
    })

    it('should return 400 if movieId is not provided', async () => {
        movieId = '';

        const res = await exec();

        expect(res.status).toBe(400);
    })

    it('should return 404 if no rental is found for customer/movie', async () => {
        await Rental.deleteMany({})

        const res = await exec();

        expect(res.status).toBe(404);
    })

    it('should return 400 if rental has already been processed', async () => {
        rental.dateReturned = new Date();
        await rental.save();

        const res = await exec();

        expect(res.status).toBe(400);
    })

    it('should return 200 if request is valid', async () => {

        const res = await exec();

        expect(res.status).toBe(200);
    })

    it('should set the returnDate if request is valid', async () => {
        const res = await exec();

        const rentalInDb = await Rental.findById(rental._id)
        const diffInTime = new Date() - rentalInDb.dateReturned;

        expect(diffInTime).toBeLessThan(10 * 1000);
    })

    it('should calculate the rental fee if request is valid', async () => {
        rental.dateOut = moment().add(-7, 'days').toDate();
        await rental.save();

        const res = await exec();

        const rentalInDb = await Rental.findById(rental._id)
        expect(rentalInDb.rentalFee).toBe(14);
    })
    it('should increase movie stock if request is valid', async () => {
        const res = await exec();

        const movieInDb = await Movie.findById(movieId)
        expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
    })
    it('should return the rental if request is valid', async () => {
        const res = await exec();

        expect(res.body).toHaveProperty('_id');
        expect(res.body).toHaveProperty('customer.name', '123');
        expect(res.body).toHaveProperty('movie.title', 'abc');

        // OR

        expect(Object.keys(res.body)).toEqual(
            expect.arrayContaining(['dateOut', 'dateReturned', 'rentalFee', 
        'customer', 'movie']))

    })


})