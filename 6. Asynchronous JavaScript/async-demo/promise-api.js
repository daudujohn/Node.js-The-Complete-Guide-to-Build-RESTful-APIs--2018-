// To create a promise that is already resolved, maybe for unit tesitng
const p = Promise.resolve({id: 1});
p.then(result => console.log(result)); 

const p1 = new Promise((resolve) => {
  setTimeout(() => {
    console.log('Async operation 1...')
    resolve(1);
  }, 2000);  
})

const p2 = new Promise((resolve) => {
    setTimeout(() => {
      console.log('Async operation 2...')
      resolve(2);
    }, 2000);  
})

const p3 = new Promise((resolve) => {
  setTimeout(() => {
    console.log('Async operation 3...')
    resolve(3);
  }, 2000);  
})

Promise.all([p1, p2, p3])
    .then(result => console.log(result))

// To carry out an operation when one promise is complete, use .race
// The return value is not an array, its the value of the first fufilled promise
Promise.race([p1, p2, p3])
    .then(result => console.log(result))
    .catch(err => console.log('Error', err))