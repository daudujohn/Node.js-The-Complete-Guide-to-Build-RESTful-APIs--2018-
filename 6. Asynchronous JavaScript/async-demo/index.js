console.log('before')
getUser(1, getRepos)
console.log('After')

function getRepos(user) {
    getRepositories(user.gitHubUsername, displayRepositories)
}

function displayRepositories(repos){
    console.log('Repos', repos)
}
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