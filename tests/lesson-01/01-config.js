// function getEnvironmentFileName(env) {
//     return env.concat('.json')
// };
function getEnvironmentFileName(env) {
    switch (env) {
        case 'dev':
            return 'dev.json';
        case 'stag':
            return 'staging.json';
        case 'prod':
            return 'prod.json';
        default:
            throw new Error(`Unknown environment: "${env}"`);
    }
}

console.log(getEnvironmentFileName('dev'));
console.log(getEnvironmentFileName('stag'));
console.log(getEnvironmentFileName('prod'));
console.log(getEnvironmentFileName('test'));