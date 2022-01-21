const {override, addWebpackAlias} = require('customize-cra');
const path = require('path');

module.exports = override(
    addWebpackAlias({
        ['@apps']: path.resolve(__dirname, 'src/apps'),
        ['@components']: path.resolve(__dirname, 'src/components'),
        ['@conf']: path.resolve(__dirname, 'src/conf'),
        ['@visuals']: path.resolve(__dirname, 'src/visuals'),
        ['@models']: path.resolve(__dirname, 'src/models'),
        ['@services']: path.resolve(__dirname, 'src/services')
    })
)


/*"scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }*/