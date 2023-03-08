const ex = require('../exercise1');

describe('fizzBuzz', () => {
    it('should throw an error if input is not a number', () => {
        expect(() => {ex.fizzBuzz('a')}).toThrow();
        expect(() => {ex.fizzBuzz(null)}).toThrow();
        expect(() => {ex.fizzBuzz(undefined)}).toThrow();
        expect(() => {ex.fizzBuzz({})}).toThrow();

    })

    it('should return FizzBuzz if divisible by 3 and 5', () => {
        const result = ex.fizzBuzz(15);
        expect(result).toBe('FizzBuzz');
    })

    it('should return Fizz if divisible by 3', () => {
        const result = ex.fizzBuzz(3);
        expect(result).toBe('Fizz');
    })

    it('should return Buzz if divisible by 5', () => {
        const result = ex.fizzBuzz(5);
        expect(result).toBe('Buzz');
    })

    it('should return input if indivisible by 3 or 5', () => {
        const result = ex.fizzBuzz(1);
        expect(result).toBe(1);
    })
})