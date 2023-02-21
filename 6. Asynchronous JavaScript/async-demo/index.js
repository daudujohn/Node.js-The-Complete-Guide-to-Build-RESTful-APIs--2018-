console.log('before')
console.log('After')

function getUser(id){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('fetching user data...');
            resolve({id: id, gitHubUsername: 'daudu'});
        }, 2000);
    })
}

function getRepositories(username){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(['repo1', 'repo2', 'repo3']);
        }, 2000);
    })
}

function getCommits(repo){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('Calling Github API')            ;
            resolve(['commit'])
        }, 2000);
    })
}