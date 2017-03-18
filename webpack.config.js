var libraryName = 'starterpack';

var siteUrl = "",
    username = "",
    password = "";

var path = require('path'),
    argv = require('yargs').argv,
    mode = argv.mode,
    env = argv.env,
    plugins = [], 
    outputFile;

var webpack = require('webpack'),
    uglifyJsPlugin = webpack.optimize.UglifyJsPlugin,
    extractTextPlugin = require('extract-text-webpack-plugin'),
    autoprefixer = require('autoprefixer'),
    spSaveWebpackPlugin = require('spsave-webpack-plugin');

plugins.push(new extractTextPlugin('../css/screen.css', {
    allChunks: true
}));

if (mode === 'build') {
    plugins.push(new webpack.DefinePlugin({
        "process.env": { 
            NODE_ENV: JSON.stringify("production") 
        }
    }));

    plugins.push(new uglifyJsPlugin({
        compress: {
            warnings: false
        }
    }));

    outputFile = libraryName + '.min.js';
} 
else {
    outputFile = libraryName + '.js';
}

if(env && env.upload) {
    plugins.push(new spSaveWebpackPlugin({
        "coreOptions": {
            "checkin": true,
            "checkinType": 1,
            "notification": true,
            "siteUrl": siteUrl
        },
        "credentialOptions": {
            username: username,
            password: password
        },
        "fileOptions": {
            "folder": "Style Library/" + libraryName + "/js"
        }
    }));
}

var config = {
    entry: __dirname + '/assets/js/src/index.jsx',
    devtool: 'source-map',
    output: {
        path: __dirname + '/public/js',
        filename: outputFile,
        library: libraryName,
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    stats: {
        children: false  
    },
    module: {
        preLoaders: [
            {
                test: /(\.jsx|\.js)$/,
                exclude: /node_modules/,
                loader: 'eslint-loader'
            }
        ],
        loaders: [
            {
                test: /(\.jsx|\.js)$/,
                loader: 'babel',
                exclude: /(node_modules|bower_components)/
            },
            {
                test: /\.scss$/,
                loader: extractTextPlugin.extract('css?url=false&modules&importLoaders=1&localIdentName=[name]_[local]!sass!sass-resources!postcss')
            }
        ]
    },
    sassResources: [
        __dirname + '/assets/css/utils/_variables.scss', 
        __dirname + '/assets/css/utils/mixins/_breakpoints.scss'
    ],
    postcss: [
        autoprefixer({ browsers: ['last 3 versions'] })
    ],
    resolve: {
        modulesDirectories: ['node_modules', 'assets'],
        extensions: ['', '.js', '.jsx']
    },
    plugins: plugins
};

module.exports = config;