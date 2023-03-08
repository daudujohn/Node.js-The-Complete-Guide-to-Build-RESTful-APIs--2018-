const lib = require('../lib');
const db = require('../db');
const mail = require('../mail');

describe('absolute', () => {
    test('should always return a positive number if input is positive', () => {
        const result = lib.absolute(1);
        expect(result).toBe(1);
    })
    
    test('should always return a positive number if input is negative', () => {
        const result = lib.absolute(-1);
        expect(result).toBe(1);
    })
    
    test('should always return zero if input is zero', () => {
        const result = lib.absolute(0);
        expect(result).toBe(0);
    })  
})

describe('greet', () => {
    it('should return a greeting message', () => {
        const result = lib.greet('John');
        expect(result).toContain('John');
        // or use a regex
        expect(result).toMatch(/John/);
    })
})

describe('getCurrencies', () => {
    it('should return a list of supported currencies', () => {
        const result = lib.getCurrencies();
        expect(result).toEqual(expect.arrayContaining(['EUR', 'USD', 'AUD']))
    })   
})

describe('getProduct', () => {
	const result = lib.getProduct(1);
	expect(result).toEqual({id: 1, price: 10}); // Approach 1
	expect(result).toMatchObject({id: 1, price: 10}); // Approach 2

    expect(result).toHaveProperty('id', 1)
})

describe('registerUser', () => {
    it('should throw an error if username is falsy', () => {
        args = [NaN, null, false, '', 0, undefined]
        args.forEach(a => {
            expect( () => {lib.registerUser(a)}).toThrow();
        });
    });
   
    it('should return a user object if username is valid', () => {
        const result = lib.registerUser('john');
        expect(result).toMatchObject({username: 'john'})
        expect(result.id).toBeGreaterThan(0);
    })
})

describe('applyDiscount', () => {
    it('should apply 10% discount if the customer has more than 10 points', () => {
        // create a mock function
        db.getCustomerSync = function(customerId){
            console.log('Fake reading customer...');
            return {id: customerId, points: 20};
        }

        const order = {customerId: 1, totalPrice: 10};
        lib.applyDiscount(order)
        expect(order.totalPrice).toBe(9)
    })
})

describe('notifyCustomer', () => {
    it('should send an email to the customer', () => {
        db.getCustomerSync = function(customerId){
            return {email: 'a'}
        }

        mailSent = false
        mail.send = function (email, message){
            mailSent = true
        }

        lib.notifyCustomer({customerId: 1})
        expect(mailSent).toBe(true)
    })
})