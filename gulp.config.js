module.exports = function () {
    var client = './src/client/';
    var clientApp = client + 'app/';
    var temp = './tmp/';
    var server = './src/server/';

    var config = {
        images: client + 'images/**/*.*',
        temp: temp,
        less: client + '/styles/styles.less',
        client: client,
        css: temp + 'styles.css',
        server: server,
        index: client + 'index.html',
        js: [
            clientApp + '**/*.module.js',
            clientApp + '**/*.js'
        ],

        /**
         * Bower Settings
         **/
        bower: {
            json: require('./bower.json'),
            directory: './bower_components.json',
            ignorePath: '../..'
        },

        /**
         * Node Settings
         **/
        defaultPort: 7203,
        nodeServer: './src/server/app.js'
    };
    config.getWiredepDefaultOptions = function () {
        var options = {
            bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath
        };
    };
    return config;
};
