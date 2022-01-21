const path = require('path');


module.exports = {
    resolve: {
        alias: {
            '@root': path.resolve(__dirname, './src')
        },
        extensions: ['.ts']
    }
}