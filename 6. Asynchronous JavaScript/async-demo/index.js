console.log('before')
getUser(23)
    .then(user => getRepositories(user.gitHubUsername))
    .then(repos => getCommits(repos[0]))
    .then(commits => console.log('Commits', commits))
    .catch(err => console.log('Error', err.message));
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
            console.log('Getting repositories')
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