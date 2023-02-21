const p = new Promise((resolve, reject) => {
    // Kick off some async work
    setTimeout(() => {
        reject(new Error('message'))
        resolve(1);
    }, 2000)
})

p
    .then(res => {console.log('Result', res)})
    .catch(err => console.log('Error', err.message))