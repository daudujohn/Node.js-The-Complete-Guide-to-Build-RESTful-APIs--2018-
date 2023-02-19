console.log('before')
getUser(1, function(user) {
    getRepositories(user.gitHubUsername, repos => {
        console.log('Repos', repos)
    })
})
console.log('After')

function getUser(id, callback){
    setTimeout(() => {
        console.log('fetching user data...');
        callback({id: id, gitHubUsername: 'daudu'});
    }, 2000);
}

function getRepositories(username, callback){
    setTimeout(() => {
        callback(['repo1', 'repo2', 'repo3']);
    }, 2000);
}