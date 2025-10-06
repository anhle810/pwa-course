function getEnvironmentFileNameTs(env) {
    switch (env) {
        case 'dev':
            return 'dev.json';
        case 'stag':
            return 'staging.json';
        case 'prod':
            return 'prod.json';
        default:
            throw new Error("Unknown environment: \"".concat(env, "\""));
    }
}
console.log(getEnvironmentFileNameTs('dev'));
console.log(getEnvironmentFileNameTs('stag'));
console.log(getEnvironmentFileNameTs('prod'));
console.log(getEnvironmentFileNameTs('test'));
