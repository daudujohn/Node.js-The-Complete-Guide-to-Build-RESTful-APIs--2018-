// To create a promise that is already resolved, maybe for unit tesitng
const p = Promise.resolve({id: 1});
p.then(result => console.log(result)); 